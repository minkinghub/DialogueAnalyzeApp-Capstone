import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification, TrainingArguments, Trainer
from transformers.trainer_callback import TrainerCallback, EarlyStoppingCallback
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split

# GPU 설정
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# 데이터 로드
df = pd.read_csv("./Data/emotion3.tsv", sep="\t")
df = df.sample(10000, random_state=42)
null_idx = df[df["document"].isnull()].index
df.loc[null_idx]

# 데이터셋 분리
train_data, val_data = train_test_split(df, test_size=0.2, random_state=42)

# 데이터셋 갯수 확인
print("학습 데이터셋: {}".format(len(train_data)))
print("검증 데이터셋: {}".format(len(val_data)))

MODEL_NAME = "beomi/KcELECTRA-base"
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)

tokenizer_train_sentences = tokenizer(
    list(train_data['document']),
    return_tensors="pt",
    max_length=128,
    padding=True,
    truncation=True,
    add_special_tokens=True,
)
tokenizer_val_sentences = tokenizer(
    list(val_data['document']),
    return_tensors="pt",
    max_length=128,
    padding=True,
    truncation=True,
    add_special_tokens=True,
)

class CurseDataset(torch.utils.data.Dataset):
    def __init__(self, encodings, labels):
        self.encodings = encodings
        self.labels = labels

    def __getitem__(self, idx):
        item = {key: torch.tensor(val[idx]) for key, val in self.encodings.items()}
        item["labels"] = torch.tensor(self.labels[idx])
        return item

    def __len__(self):
        return len(self.labels)

train_label = train_data['label'].values
val_label = val_data['label'].values

train_dataset = CurseDataset(tokenizer_train_sentences, train_label)
val_dataset = CurseDataset(tokenizer_val_sentences, val_label)

model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME, num_labels=7).to(device)


# Accuracy 계산 함수
def compute_metrics(eval_pred):
    logits, labels = eval_pred
    if isinstance(logits, tuple):
        logits = logits[0]
    if isinstance(labels, tuple):
        labels = labels[0]

    # numpy.ndarray를 torch.Tensor로 변환
    if isinstance(logits, np.ndarray):
        logits = torch.tensor(logits)
    if isinstance(labels, np.ndarray):
        labels = torch.tensor(labels)

    preds = torch.argmax(logits, dim=-1)
    acc = accuracy_score(labels.flatten(), preds.flatten())

    return {"eval_accuracy": acc}

class AccuracyAndLossCallback(TrainerCallback):
    def __init__(self):
        super().__init__()
        self.train_loss_set = []
        self.train_acc_set = []
        self.val_loss_set = []
        self.val_acc_set = []
        self.current_epoch = 0
        self.epoch_loss = 0
        self.epoch_accuracy = 0
        self.num_logs = 0

    def on_epoch_begin(self, args, state, control, **kwargs):
        self.current_epoch += 1
        self.epoch_loss = 0
        self.epoch_accuracy = 0
        self.num_logs = 0

    def on_log(self, args, state, control, logs=None, **kwargs):
        if 'loss' in logs:
            self.epoch_loss += logs['loss']
        if 'train_accuracy' in logs:
            self.epoch_accuracy += logs['train_accuracy']
        self.num_logs += 1

    def on_epoch_end(self, args, state, control, **kwargs):
        if self.num_logs > 0:
            self.train_loss_set.append(self.epoch_loss / self.num_logs)
            self.train_acc_set.append(self.epoch_accuracy / self.num_logs)

    def on_evaluate(self, args, state, control, metrics=None, **kwargs):
        self.val_loss_set.append(metrics["eval_loss"])
        self.val_acc_set.append(metrics["eval_accuracy"])

accuracy_and_loss_callback = AccuracyAndLossCallback()

# Custom Trainer 정의
class CustomTrainer(Trainer):
    def training_step(self, model, inputs):
        model.train()
        inputs = self._prepare_inputs(inputs)
        
        # Use AMP to scale the loss
        with torch.cuda.amp.autocast():
            outputs = model(**inputs)
            loss = outputs.loss

        # Scale the loss
        if self.args.fp16:
            self.scaler.scale(loss).backward()
        else:
            loss.backward()

        # Compute and log training accuracy
        preds = outputs.logits.argmax(dim=-1)
        accuracy = (preds == inputs["labels"]).float().mean().item()
        self.log({"train_accuracy": accuracy})

        return loss

training_args = TrainingArguments(
    output_dir="./results",
    evaluation_strategy="epoch",
    learning_rate=3e-5,  # 학습률 감소
    per_device_train_batch_size=16,
    per_device_eval_batch_size=64,
    num_train_epochs=10,
    weight_decay=0.01,
    save_strategy="epoch",
    metric_for_best_model="eval_loss",
    fp16=True,
    logging_steps=10,
    lr_scheduler_type='linear',  # 학습률 스케줄러 추가
    load_best_model_at_end=True,  # 조기 종료 시 가장 좋은 모델을 로드
    early_stopping_patience=3,  # 개선되지 않으면 3 epoch 후 조기 종료
)

trainer = CustomTrainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=val_dataset,
    compute_metrics=compute_metrics,
    callbacks=[accuracy_and_loss_callback, EarlyStoppingCallback(early_stopping_patience=3)],
)

trainer.train()

model.save_pretrained("./saved_model")
tokenizer.save_pretrained("./saved_model")

# Plotting
epochs = list(range(1, len(accuracy_and_loss_callback.train_loss_set) + 1))

plt.figure(figsize=(12, 5))

plt.subplot(1, 2, 1)
plt.plot(epochs, accuracy_and_loss_callback.train_loss_set, label='Train Loss')
plt.plot(epochs, accuracy_and_loss_callback.val_loss_set, label='Validation Loss')
plt.xlabel('Epoch')
plt.ylabel('Loss')
plt.legend()
plt.title('Loss Over Epochs')

plt.subplot(1, 2, 2)
plt.plot(epochs, accuracy_and_loss_callback.train_acc_set, label='Train Accuracy')
plt.plot(epochs, accuracy_and_loss_callback.val_acc_set, label='Validation Accuracy')
plt.xlabel('Epoch')
plt.ylabel('Accuracy')
plt.legend()
plt.title('Accuracy Over Epochs')

plt.savefig('loss_and_accuracy.png')
plt.show()
