import torch
from transformers import T5ForConditionalGeneration, T5TokenizerFast, Trainer, TrainingArguments
from transformers.trainer_callback import TrainerCallback
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split

# T5 모델 로드
model = T5ForConditionalGeneration.from_pretrained('paust/pko-t5-small')
tokenizer = T5TokenizerFast.from_pretrained('paust/pko-t5-small')

# 데이터 로드 및 준비
df = pd.read_csv("./data/typos_test.csv", index_col=0)
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
class LossLoggingCallback(TrainerCallback):
    def __init__(self):
        super().__init__()
        self.train_loss_set = []
        self.val_loss_set = []

    def on_evaluate(self, args, state, control, metrics=None, **kwargs):
        self.val_loss_set.append(metrics["eval_loss"])

    def on_log(self, args, state, control, logs=None, **kwargs):
        if 'loss' in logs:
            self.train_loss_set.append(logs['loss'])

# 콜백 인스턴스 생성
loss_logging_callback = LossLoggingCallback()

# Trainer 설정
training_args = TrainingArguments(
    output_dir="./outputs",
    evaluation_strategy="epoch",
    learning_rate=1e-4,
    per_device_train_batch_size=16,
    num_train_epochs=3,
    weight_decay=0.01,
    save_strategy="epoch",
    metric_for_best_model="eval_loss",
    greater_is_better=False,
    fp16=True,
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=val_dataset,
    callbacks=[loss_logging_callback]
)

# 학습 실행
trainer.train()

# 모델 및 tokenizer 저장
model.save_pretrained("./saved_model")
tokenizer.save_pretrained("./saved_model")

# loss 그래프 출력
plt.plot(loss_logging_callback.train_loss_set, label="Train Loss")
plt.plot(loss_logging_callback.val_loss_set, label="Validation Loss")
plt.xlabel("epoch")
plt.ylabel("Loss")
plt.title("Loss Curves")
plt.legend()
plt.savefig("loss_and_accuracy.png")
plt.show()
