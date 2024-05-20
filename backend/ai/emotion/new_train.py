import pandas as pd
import matplotlib.pyplot as plt

import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification, TrainingArguments, Trainer
from sklearn.metrics import precision_recall_fscore_support, accuracy_score

# gpu 설정
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

df = pd.read_csv("./Data/emotion.tsv", sep="\t")

print(df.columns)

null_idx = df[df["document"].isnull()].index
df.loc[null_idx]

train_data = df.sample(frac=0.8, random_state=42)
test_data = df.drop(train_data.index)

print("중복 제거 전 학습 데이터셋: {}".format(len(train_data)))
print("중복 제거 전 테스트 데이터셋: {}".format(len(test_data)))

# 중복 데이터 제거
train_data = train_data.drop_duplicates(["document"])
test_data = test_data.drop_duplicates(["document"])

# 데이터셋 갯수 확인
print("중복 제거 후 학습 데이터셋: {}".format(len(train_data)))
print("중복 제거 후 테스트 데이터셋: {}".format(len(test_data)))

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

tokenizer_test_sentences = tokenizer(
    list(test_data['document']),
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
test_label = test_data['label'].values

train_dataset = CurseDataset(tokenizer_train_sentences, train_label)
test_dataset = CurseDataset(tokenizer_test_sentences, test_label)

model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME, num_labels=3).to(device)

traning_args = TrainingArguments(
    output_dir="./results",
    num_train_epochs=1,
    per_device_train_batch_size=32,
    per_device_eval_batch_size=32,
    warmup_steps=500,
    weight_decay=0.01,
    logging_dir="./logs",
)

def compute_metrics(pred):
    labels = pred.label_ids
    preds = pred.predictions.argmax(-1)
    precision, recall, f1, _ = precision_recall_fscore_support(labels, preds, average="weighted")
    acc = accuracy_score(labels, preds)
    return {
        "accuracy": acc,
        "f1": f1,
        "precision": precision,
        "recall": recall,
    }

trainer = Trainer(
    model=model,
    args=traning_args,
    train_dataset=train_dataset,
    eval_dataset=test_dataset,
    compute_metrics=compute_metrics,
)

trainer.train()

trainer.evaluate(eval_dataset=test_dataset)

# 모델과 토크나이저 저장
model.save_pretrained("./saved_model")
tokenizer.save_pretrained("./saved_model")

# 저장된 모델과 토크나이저 불러오기
model = AutoModelForSequenceClassification.from_pretrained("./saved_model")
tokenizer = AutoTokenizer.from_pretrained("./saved_model")

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

def sentence_predict(sent):
    model.eval()
    tokenized_sent = tokenizer(
        [sent],
        return_tensors="pt",
        max_length=128,
        padding=True,
        truncation=True,
        add_special_tokens=True,
    )
    tokenized_sent = {k: v.to(device) for k, v in tokenized_sent.items()}
    with torch.no_grad():
        outputs = model(
            input_ids=tokenized_sent["input_ids"],
            attention_mask=tokenized_sent["attention_mask"],
        )
    logits = outputs[0]
    logits = logits.detach().cpu()
    result = logits.argmax(-1).numpy()[0]
    return result

# 데이터 로드 및 샘플링
data = pd.read_csv("Data/ratings.tsv", sep='\t')
sampled_data = data.sample(n=1000)

# 정확도 계산을 위한 변수 초기화
correct_predictions = 0

for index, row in sampled_data.iterrows():
    sentence = row['document']
    true_label = row['label']
    predicted_label = sentence_predict(sentence)
    print(f"True Label: {true_label}, Predicted Label: {predicted_label}")
    if true_label == predicted_label:
        correct_predictions += 1

accuracy = correct_predictions / len(sampled_data)
print(f"정확도: {accuracy * 100:.2f}%")