import torch
from transformers import T5ForConditionalGeneration, T5TokenizerFast
import pandas as pd
import random
import matplotlib.pyplot as plt
import time
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

# 모델 및 토크나이저 로드
model = T5ForConditionalGeneration.from_pretrained('./saved_model')
tokenizer = T5TokenizerFast.from_pretrained('./saved_model')

# 테스트 데이터 로드
df = pd.read_csv('./data/typos_test.csv')
df = df.sample(n=1000, random_state=42)

# 맞춤법 교정 및 평가지표 계산
start_time = time.time()
true_labels = []
pred_labels = []

for idx, row in enumerate(df.iterrows()):
    _, row = row
    input_text = "맞춤법을 고쳐주세요: " + row['original']
    output_text = model.generate(
        input_ids=tokenizer(input_text, return_tensors='pt').input_ids,
        max_length=128,
        num_beams=5,
        early_stopping=True
    )[0].squeeze().tolist()
    output_text = tokenizer.decode(output_text, skip_special_tokens=True)
    output_text = output_text.replace("정답: ", "").strip('.')

    # 정답 레이블 생성
    if row['original'] != row['corrected']:
        true_label = 1  # 맞춤법 오류
    else:
        true_label = 0  # 맞춤법 정확
    true_labels.append(true_label)

    # 예측 레이블 생성
    if output_text != row['original']:
        pred_label = 1  # 맞춤법 오류 예측
    else:
        pred_label = 0  # 맞춤법 정확 예측
    pred_labels.append(pred_label)

    # 현재 처리 중인 데이터 번호 출력
    print(f"Processing sample {idx+1} out of 202309...")

# 평가지표 계산
accuracy = accuracy_score(true_labels, pred_labels)
precision = precision_score(true_labels, pred_labels)
recall = recall_score(true_labels, pred_labels)
f1 = f1_score(true_labels, pred_labels)


metrics = ['accuracy', 'precision', 'recall', 'F1-Score']
values = [accuracy, precision, recall, f1]

# 정확도 그래프 그리기
plt.figure(figsize=(8, 6))
plt.bar(metrics, values)

# 값 표시
for i, value in enumerate(values):
    plt.text(i, value, f"{value:.2f}", ha='center', va='bottom')

plt.xlabel('Metric')
plt.ylabel('Value')
plt.title('Grammar Model')
plt.savefig('./accuracy_results.png')
plt.show()

