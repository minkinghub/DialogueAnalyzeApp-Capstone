import torch
from transformers import T5ForConditionalGeneration, T5TokenizerFast
import pandas as pd
import random
import matplotlib.pyplot as plt
import time

# 모델 및 토크나이저 로드
model = T5ForConditionalGeneration.from_pretrained('./saved_model')
tokenizer = T5TokenizerFast.from_pretrained('./saved_model')

# 테스트 데이터 로드
df = pd.read_csv('./data/typos_test.csv')
#df = df.sample(n=1000, random_state=42)

# 맞춤법 교정 및 정답 여부 확인
start_time = time.time()
correct_count = 0
accuracy_list = []  # 각 스텝에서의 정확도를 저장할 리스트

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

    # 정답 여부 확인
    if row['original'] != row['corrected'] and output_text != row['original']:
        correct_count += 1
    elif row['original'] == row['corrected'] and output_text == row['original']:
        correct_count += 1

    # 현재까지의 정확도 계산 및 저장
    current_accuracy = correct_count / (idx + 1)
    accuracy_list.append(current_accuracy)

    # 현재 처리 중인 데이터 번호 출력
    print(f"Processing sample {idx+1} out of 202309...")

# 최종 정확도 출력
final_accuracy = correct_count / len(df)
print(f"맞춤법 교정 모델 정확도: {final_accuracy:.2%}")

# 총 걸린 시간 출력
end_time = time.time()
total_time = end_time - start_time
print(f"Total time taken: {total_time:.2f} seconds")

# 정확도 그래프 그리기
plt.figure(figsize=(10, 6))
plt.plot(accuracy_list, label='Accuracy')
plt.xlabel('Sample Number')
plt.ylabel('Accuracy')
plt.title('Accuracy of Spelling Correction Model Over Time')
plt.legend()
plt.grid(True)

# 그래프 저장
plt.savefig('./accuracy_graph.png')
