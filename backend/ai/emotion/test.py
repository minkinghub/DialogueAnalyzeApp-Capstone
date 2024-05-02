import pandas as pd
import numpy as np
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification

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
data = pd.read_csv("Data/ratings_train2.tsv", sep='\t')
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
