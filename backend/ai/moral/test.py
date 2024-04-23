import pandas as pd
import torch
from transformers import BertTokenizer, BertForSequenceClassification

# 저장된 모델과 토크나이저 로드
model_path = './saved_model/trained_model.pt'
tokenizer = BertTokenizer.from_pretrained('kykim/bert-kor-base')

model = BertForSequenceClassification.from_pretrained('kykim/bert-kor-base', num_labels=2)
model.load_state_dict(torch.load(model_path))
model.eval()  # 평가 모드로 설정

# GPU 사용 설정
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

# 데이터 로드 및 무작위로 1000개의 문자열 추출
test_df = pd.read_csv('data/test.csv')
samples = test_df.sample(n=1000)

# 혐오 표현 분류 및 결과 확인
correct_predictions = 0
for _, row in samples.iterrows():
    text = row['text']
    true_label = row['is_immoral']
    
    # 텍스트를 모델이 이해할 수 있는 형태로 인코딩
    inputs = tokenizer.encode_plus(
        text,
        return_tensors="pt",
        max_length=128,
        truncation=True,
        padding="max_length",
        add_special_tokens=True,
        return_attention_mask=True
    )
    
    inputs = {key: value.to(device) for key, value in inputs.items()}
    
    with torch.no_grad():
        outputs = model(**inputs)
    
    prediction = torch.argmax(outputs.logits, dim=1).cpu().numpy()[0]
    
    # 예측 결과가 실제 레이블과 일치하는지 확인
    correct_predictions += (prediction == true_label)

# 정확도 계산
accuracy = correct_predictions / len(samples)
print(f"Accuracy: {accuracy}")
