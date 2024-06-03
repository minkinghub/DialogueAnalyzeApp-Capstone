from transformers import TrainingArguments
from transformers import Trainer
from datasets import load_metric
import numpy as np
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from datasets.dataset_dict import DatasetDict
from datasets import Dataset
from transformers.trainer_callback import TrainerCallback

import torch
import pandas as pd
import matplotlib.pyplot as plt

from typing import Final
from pathlib import Path

# Base Model (108M)

device = "cuda:0" if torch.cuda.is_available() else "cpu"
print(device)

BASE_DIR = Path(__file__).resolve().parent.parent

class CustomTrainerCallback(TrainerCallback):
    def __init__(self, formal_classifier):
        self.formal_classifier = formal_classifier

    def on_train_begin(self, args, state, control, **kwargs):
        self.formal_classifier.train_loss_values = []
        self.formal_classifier.train_acc_values = []
        self.formal_classifier.val_loss_values = []
        self.formal_classifier.val_acc_values = []
        return control

    def on_log(self, args, state, control, **kwargs):
        logs = kwargs.get("logs", {})
        if "loss" in logs:
            self.formal_classifier.train_loss_values.append(logs["loss"])
        if "eval_loss" in logs:
            self.formal_classifier.val_loss_values.append(logs["eval_loss"])
        if "eval_accuracy" in logs:
            self.formal_classifier.val_acc_values.append(logs["eval_accuracy"])
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
        self.train_acc_values = []
        self.val_loss_values = []
        self.val_acc_values = []

    def tokenize_function(self, examples):
        return self.tokenizer(examples["sentence"], padding="max_length", truncation=True, max_length=self.max_len)

    def dataLoader(self):
        train = pd.read_csv(BASE_DIR.joinpath(
            'politely', 'Data', 'train.tsv'), sep='\t', index_col=0)
        dev = pd.read_csv(BASE_DIR.joinpath(
            'politely', 'Data', 'dev.tsv'), sep='\t', index_col=0)

        train = train.dropna()
        dev = dev.dropna()

        dataset = DatasetDict({
            'train': Dataset.from_dict({'sentence': train['sentence'].tolist(), 'label': train['label'].tolist()}),
            'dev': Dataset.from_dict({'sentence': dev['sentence'].tolist(), 'label': dev['label'].tolist()}),
        })

        tokenized_datasets = dataset.map(self.tokenize_function, batched=True)

        self.train_dataset = tokenized_datasets["train"]
        self.dev_dataset = tokenized_datasets["dev"]

    def compute_metrics(self, eval_pred):
        metric = load_metric("accuracy")
        logits, labels = eval_pred
        predictions = np.argmax(logits, axis=-1)
        return metric.compute(predictions=predictions, references=labels)

    def train(self):
        training_args = TrainingArguments("./saved_model",
                                        per_device_train_batch_size=self.batch_size,
                                        num_train_epochs=2,
                                        learning_rate=3e-05,
                                        save_strategy="epoch",
                                        evaluation_strategy="epoch",
                                        fp16=True,
                                        )

        trainer = Trainer(
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
        plt.plot(self.train_loss_values, label="Train Loss")
        plt.plot(self.val_loss_values, label="Validation Loss")
        plt.xlabel("Epoch")
        plt.ylabel("Loss")
        plt.title("Loss Curves")
        plt.legend()

        # 훈련 accuracy 그래프
        plt.subplot(1, 2, 2)
        plt.plot(self.train_acc_values, label="Train Accuracy")
        plt.plot(self.val_acc_values, label="Validation Accuracy")
        plt.xlabel("Epoch")
        plt.ylabel("Accuracy")
        plt.title("Accuracy Curves")
        plt.legend()

        plt.savefig("loss_and_accuracy.png")
        plt.show()

if __name__ == "__main__":
    model = FormalClassifier()
    model.train()
