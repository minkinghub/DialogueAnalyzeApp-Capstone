import torch
import pandas as pd
from transformers import BertTokenizer, BertForSequenceClassification
from torch.utils.data import DataLoader, Dataset

# 모델 로드
model = BertForSequenceClassification.from_pretrained('./saved_model')
tokenizer = BertTokenizer.from_pretrained('./saved_model')

# 모델 학습
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model.to(device)

# 데이터셋 정의
class HateSpeechDataset(Dataset):
    def __init__(self, texts, tokenizer):
        self.texts = texts
        self.tokenizer = tokenizer
        
    def __len__(self):
        return len(self.texts)
    
    def __getitem__(self, idx):
        text = self.texts[idx]
        inputs = self.tokenizer.encode_plus(
            text,
            None,
            add_special_tokens=True,
            max_length=128,
            padding='max_length',
            return_token_type_ids=False,
            truncation=True,
            return_attention_mask=True,
            return_tensors='pt'
        )
        return {
            'input_ids': inputs['input_ids'].flatten().to(device),
            'attention_mask': inputs['attention_mask'].flatten().to(device)
        }
    
# 데이터 로드
df = pd.read_csv('../politely/data/typos_test.csv')

df = df.sample(n=20, random_state=42)
X = df['corrected'].tolist()
print(X)

test_dataset = HateSpeechDataset(X, tokenizer)

test_loader = DataLoader(test_dataset, batch_size=16, shuffle=True)

# 평가
model.eval()
offset = 0  # 각 배치의 시작 인덱스를 추적하기 위한 변수 추가
for batch in test_loader:
    batch = {k: v.to(device) for k, v in batch.items()}
    with torch.no_grad():
        outputs = model(**batch)
    logits = outputs.logits
    batch_predictions = torch.argmax(logits, dim=1).tolist()
    
    for i in range(len(batch_predictions)):
        # 오프셋을 이용하여 전체 데이터셋에서의 정확한 위치를 찾습니다.
        text = X[offset + i]
        pred = batch_predictions[i]
        print(f"Text: {text}")
        print(f"Predicted Label: {pred}")
        print()
    
    offset += len(batch_predictions)  # 배치 크기만큼 오프셋 업데이트
