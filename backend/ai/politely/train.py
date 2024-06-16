from transformers import TrainingArguments
from transformers import Trainer
from transformers.trainer_callback import TrainerCallback
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from datasets.dataset_dict import DatasetDict
from datasets import Dataset
from sklearn.metrics import accuracy_score

import torch
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

from typing import Final
from pathlib import Path

# Base Model (108M)
device = "cuda:0" if torch.cuda.is_available() else "cpu"
print(device)

BASE_DIR = Path(__file__).resolve().parent.parent

_use_native_amp = True
_use_apex = False
amp = None

class CustomTrainer(Trainer):
    def training_step(self, model, inputs):
        model.train()
        inputs = self._prepare_inputs(inputs)

        if self.args.fp16 and _use_native_amp:
            with torch.autocast(device_type=self.args.device.type if self.args.device else 'cuda', dtype=torch.float16):
                loss = self.compute_loss(model, inputs)
        else:
            loss = self.compute_loss(model, inputs)

        if self.args.n_gpu > 1:
            loss = loss.mean()  # mean() to average on multi-gpu parallel training

        if self.args.gradient_accumulation_steps > 1:
            loss = loss / self.args.gradient_accumulation_steps

        if self.args.fp16 and _use_native_amp:
            self.scaler.scale(loss).backward()
        elif self.args.fp16 and _use_apex:
            with amp.scale_loss(loss, self.optimizer) as scaled_loss:
                scaled_loss.backward()
        else:
            loss.backward()

        # Compute and log training accuracy
        if "labels" in inputs:
            preds = model(**inputs)
            preds = preds.logits.argmax(dim=-1)
            accuracy = (preds == inputs["labels"]).float().mean().item()
            self.log({"train_accuracy": accuracy})

        return loss.detach()

class CustomTrainerCallback(TrainerCallback):
    def __init__(self, formal_classifier):
        self.formal_classifier = formal_classifier

    def on_log(self, args, state, control, **kwargs):
        logs = kwargs.get("logs", {})
        if "loss" in logs:
            self.formal_classifier.train_loss_values.append(logs["loss"])
        if "train_accuracy_step" in logs:
            self.formal_classifier.train_acc_step_values.append(logs["train_accuracy_step"])
        if "eval_loss" in logs:
            self.formal_classifier.val_loss_values.append(logs["eval_loss"])
        if "eval_accuracy" in logs:
            self.formal_classifier.val_acc_values.append(logs["eval_accuracy"])

        # 매 step마다의 값을 epoch 단위로 기록
        current_epoch = int(logs.get("epoch", 0))
        if len(self.formal_classifier.train_loss_epoch_values) < current_epoch + 1:
            self.formal_classifier.train_loss_epoch_values.append([])
            self.formal_classifier.train_acc_epoch_values.append([])
        
        self.formal_classifier.train_loss_epoch_values[current_epoch].append(logs.get("loss", 0))
        self.formal_classifier.train_acc_epoch_values[current_epoch].append(logs.get("train_accuracy_step", 0))

        return control

    def on_epoch_end(self, args, state, control, **kwargs):
        # 각 epoch가 끝날 때 train loss와 train accuracy 값을 기록
        current_epoch = int(state.epoch) - 1
        if current_epoch >= 0:
            train_loss = np.mean(self.formal_classifier.train_loss_epoch_values[current_epoch])
            train_acc = np.mean(self.formal_classifier.train_acc_epoch_values[current_epoch])
            self.formal_classifier.train_loss_epoch_values[current_epoch] = train_loss
            self.formal_classifier.train_acc_epoch_values[current_epoch] = train_acc

        return control

class FormalClassifier:
    def __init__(self):
        self.model_name = "beomi/kcbert-base"
        self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
        self.model = AutoModelForSequenceClassification.from_pretrained(
            self.model_name).to(device)

        self.batch_size: Final[int] = 32
        self.max_len: Final[int] = 64
        self.dataLoader()

        self.train_loss_values = []
        self.train_acc_step_values = []
        self.train_loss_epoch_values = []
        self.train_acc_epoch_values = []
        self.val_loss_values = []
        self.val_acc_values = []

    def tokenize_function(self, examples):
        return self.tokenizer(examples["sentence"], padding="max_length", truncation=True, max_length=self.max_len)

    def dataLoader(self):
        train = pd.read_csv(BASE_DIR.joinpath(
            'politely', 'Data', 'train.tsv'), sep='\t', index_col=0)
        dev = pd.read_csv(BASE_DIR.joinpath(
            'politely', 'Data', 'dev.tsv'), sep='\t', index_col=0)

        # 데이터의 일부만 사용
        train = train.iloc[:10000]
        # dev 데이터의 일부만 사용
        dev = dev.iloc[:1000]

        dataset = DatasetDict({
            'train': Dataset.from_dict({'sentence': train['sentence'].tolist(), 'label': train['label'].tolist()}),
            'dev': Dataset.from_dict({'sentence': dev['sentence'].tolist(), 'label': dev['label'].tolist()}),
        })

        tokenized_datasets = dataset.map(self.tokenize_function, batched=True)

        self.train_dataset = tokenized_datasets["train"]
        self.dev_dataset = tokenized_datasets["dev"]

    def compute_metrics(self, eval_pred):
        logits, labels = eval_pred
        predictions = np.argmax(logits, axis=-1)
        accuracy = accuracy_score(labels, predictions)
        return {"eval_accuracy": accuracy}

    def train(self):
        training_args = TrainingArguments("./saved_model",
                                          per_device_train_batch_size=self.batch_size,
                                          num_train_epochs=20,
                                          learning_rate=3e-05,
                                          save_strategy="epoch",
                                          evaluation_strategy="epoch",
                                          fp16=True,
                                          )

        trainer = CustomTrainer(
            model=self.model,
            args=training_args,
            train_dataset=self.train_dataset,
            eval_dataset=self.dev_dataset,
            compute_metrics=self.compute_metrics,
            callbacks=[CustomTrainerCallback(self)],
        )

        trainer.train()
        trainer.evaluate()

        self.model.save_pretrained("./saved_model")
        self.tokenizer.save_pretrained("./saved_model")

        # 학습 과정 중 loss와 accuracy 그래프 그리기
        self.plot_loss_and_accuracy()

    def plot_loss_and_accuracy(self):
        plt.figure(figsize=(12, 6))

        # 훈련 loss 그래프
        plt.subplot(1, 2, 1)
        plt.plot(range(len(self.train_loss_epoch_values[:-1])), [np.mean(x) for x in self.train_loss_epoch_values[:-1]], label="Train Loss")
        plt.plot(range(len(self.val_loss_values[:-1])), self.val_loss_values[:-1], label="Validation Loss")
        plt.xlabel("Epoch")
        plt.ylabel("Loss")
        plt.title("Loss Curves")
        plt.legend()

        # 훈련 accuracy 그래프
        plt.subplot(1, 2, 2)
        plt.plot(range(len(self.train_acc_epoch_values[:-1])), [np.mean(x) for x in self.train_acc_epoch_values[:-1]], label="Train Accuracy")
        plt.plot(range(len(self.val_acc_values[:-1])), self.val_acc_values[:-1], label="Validation Accuracy")
        plt.xlabel("Epoch")
        plt.ylabel("Accuracy")
        plt.title("Accuracy Curves")
        plt.legend()

        plt.savefig("loss_and_accuracy.png")
        plt.show()

if __name__ == "__main__":
    model = FormalClassifier()
    model.train()
