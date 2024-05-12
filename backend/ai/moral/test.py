import torch
import pandas as pd
from transformers import BertTokenizer, BertForSequenceClassification
from torch.utils.data import DataLoader, Dataset
from sklearn.metrics import classification_report

# 모델 로드
model = BertForSequenceClassification.from_pretrained('./saved_model')
tokenizer = BertTokenizer.from_pretrained('./saved_model')

# 모델 학습
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model.to(device)

# 데이터셋 정의
class HateSpeechDataset(Dataset):
    def __init__(self, texts, labels, tokenizer):
        self.texts = texts
        self.labels = labels
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
        label = self.labels[idx]
        return {
            'input_ids': inputs['input_ids'].flatten().to(device),
            'attention_mask': inputs['attention_mask'].flatten().to(device),
            'labels': torch.tensor(label, dtype=torch.long).to(device)
        }
    

# 데이터 로드
df = pd.read_csv('data/test.csv')

df = df.sample(n=1000, random_state=42)
X = df['text'].tolist()
y = df['types'].tolist()

test_dataset = HateSpeechDataset(X, y, tokenizer)

test_loader = DataLoader(test_dataset, batch_size=16, shuffle=True)

# 평가
model.eval()
correct = 0
total = 0
offset = 0  # 추가된 코드: 각 배치의 시작 인덱스를 추적하기 위함
for batch in test_loader:
    batch = {k: v.to(device) for k, v in batch.items()}
    with torch.no_grad():
        outputs = model(**batch)
    logits = outputs.logits
    batch_predictions = torch.argmax(logits, dim=1).tolist()
    batch_true_labels = batch['labels'].tolist()
    
    # 0~5까지의 레이블을 0과 1로 축소
    #batch_predictions = [0 if pred == 0 else 1 for pred in batch_predictions]
    #batch_true_labels = [0 if true_label == 0 else 1 for true_label in batch_true_labels]
    
    # 수정된 코드: 각 배치에 대해 올바른 텍스트, 예측, 실제 레이블을 출력하기 위해 인덱스를 조정
    for i in range(len(batch_predictions)):
        text = X[offset + i]
        pred = batch_predictions[i]
        true_label = batch_true_labels[i]
        print(f"Text: {text}")
        print(f"Predicted Label: {pred}")
        print(f"True Label: {true_label}")
        print()
        if pred == true_label:
            correct += 1
    total += len(batch_predictions)
    offset += len(batch_predictions)  # 각 배치 후 인덱스 업데이트

accuracy = correct / total
print(f"Accuracy: {accuracy:.2f}")
