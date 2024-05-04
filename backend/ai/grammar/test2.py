import torch
from transformers import T5ForConditionalGeneration, T5TokenizerFast
from transformers import ElectraForSequenceClassification, ElectraTokenizer
import pandas as pd
import random

# 모델 및 토크나이저 로드
model = T5ForConditionalGeneration.from_pretrained('./saved_model')
tokenizer = T5TokenizerFast.from_pretrained('./saved_model')

# 테스트 데이터 로드
df = pd.read_csv('./data/typos_test.csv')
test_samples = df.sample(n=20, random_state=42)

corrected_texts = []
for _, row in test_samples.iterrows():
    input_text = "맞춤법을 고쳐주세요: " + row['original']
    output_text = model.generate(
        input_ids=tokenizer(input_text, return_tensors='pt').input_ids,
        max_length=128,
        num_beams=5,
        early_stopping=True
    )[0].squeeze().tolist()
    output_text = tokenizer.decode(output_text, skip_special_tokens=True)
    output_text = output_text.replace("정답: ", "").strip('.')

    print("원문:", row['original'])
    print("수정된 문장:", output_text)
    print("정답 문장:", row['corrected'])
    print()
    corrected_texts.append(output_text)

print(corrected_texts)

