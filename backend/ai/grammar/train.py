import numpy as np
import torch
from transformers import T5ForConditionalGeneration, T5TokenizerFast, Trainer, TrainingArguments
from transformers.trainer_callback import TrainerCallback
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# T5 모델 로드
model = T5ForConditionalGeneration.from_pretrained('paust/pko-t5-small')
tokenizer = T5TokenizerFast.from_pretrained('paust/pko-t5-small')

# 데이터 로드 및 준비
df = pd.read_csv("./data/typos_test.csv", index_col=0)
# 데이터를 1000개 랜덤으로 선택
df = df.sample(n=1000, random_state=42)

train_df, val_df = train_test_split(df, test_size=0.2, random_state=42)

# 입력 및 출력 문장 준비
train_df["input"] = "맞춤법을 고쳐주세요: " + train_df["original"]
val_df["input"] = "맞춤법을 고쳐주세요: " + val_df["original"]
train_df["output"] = "정답: " + train_df["corrected"] + "."
val_df["output"] = "정답: " + val_df["corrected"] + "."

# 인코딩
train_encodings = tokenizer(train_df["input"].tolist(), max_length=128, padding=True, truncation=True)
train_labels_encodings = tokenizer(train_df["output"].tolist(), max_length=128, padding=True, truncation=True)
val_encodings = tokenizer(val_df["input"].tolist(), max_length=128, padding=True, truncation=True)
val_labels_encodings = tokenizer(val_df["output"].tolist(), max_length=128, padding=True, truncation=True)

# 데이터셋 클래스 정의
class SpellCorrectionDataset(torch.utils.data.Dataset):
    def __init__(self, encodings, labels_encodings):
        self.encodings = encodings
        self.labels_encodings = labels_encodings

    def __getitem__(self, idx):
        item = {key: torch.tensor(val[idx]) for key, val in self.encodings.items()}
        item["labels"] = torch.tensor(self.labels_encodings["input_ids"][idx])
        return item

    def __len__(self):
        return len(self.encodings["input_ids"])

# 데이터셋 준비
train_dataset = SpellCorrectionDataset(train_encodings, train_labels_encodings)
val_dataset = SpellCorrectionDataset(val_encodings, val_labels_encodings)

# loss 기록을 위한 콜백 클래스 정의
class LossAccuracyLoggingCallback(TrainerCallback):
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
        self.train_loss_set.append(self.epoch_loss / self.num_logs)
        self.train_acc_set.append(self.epoch_accuracy / self.num_logs)

    def on_evaluate(self, args, state, control, metrics=None, **kwargs):
        self.val_loss_set.append(metrics["eval_loss"])
        self.val_acc_set.append(metrics["eval_accuracy"])

# 콜백 인스턴스 생성
loss_accuracy_logging_callback = LossAccuracyLoggingCallback()

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

        # Compute and log training accuracy
        preds = outputs.logits.argmax(dim=-1)
        accuracy = (preds == inputs["labels"]).float().mean().item()
        self.log({"train_accuracy": accuracy})

        return loss
# Trainer 설정
training_args = TrainingArguments(
    output_dir="./outputs",
    evaluation_strategy="epoch",
    learning_rate=1e-4,
    per_device_train_batch_size=8,
    gradient_accumulation_steps=2,
    num_train_epochs=10,
    weight_decay=0.01,
    save_strategy="epoch",
    metric_for_best_model="eval_loss",
    greater_is_better=False,
    fp16=True,
    logging_steps=10,
)

trainer = CustomTrainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=val_dataset,
    compute_metrics=compute_metrics,
    callbacks=[loss_accuracy_logging_callback]
)

# 학습 실행
trainer.train()
print(trainer.state.log_history)

# 모델 및 tokenizer 저장
model.save_pretrained("./saved_model")
tokenizer.save_pretrained("./saved_model")

# loss와 accuracy 그래프 출력
plt.figure(figsize=(12, 6))

# 훈련 loss 그래프
plt.subplot(1, 2, 1)
plt.plot(loss_accuracy_logging_callback.train_loss_set, label="Train Loss")
plt.plot(loss_accuracy_logging_callback.val_loss_set, label="Validation Loss")
plt.xlabel("Steps")
plt.ylabel("Loss")
plt.title("Loss Curves")
plt.legend()

# 훈련 accuracy 그래프
plt.subplot(1, 2, 2)
plt.plot(loss_accuracy_logging_callback.train_acc_set, label="Train Accuracy")
plt.plot(loss_accuracy_logging_callback.val_acc_set, label="Validation Accuracy")
plt.xlabel("Steps")
plt.ylabel("Accuracy")
plt.title("Accuracy Curves")
plt.legend()

plt.savefig("loss_and_accuracy.png")
plt.show()