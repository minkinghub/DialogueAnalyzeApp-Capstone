import torch
import pandas as pd
from transformers import BertTokenizer, BertForSequenceClassification
from torch.utils.data import DataLoader, Dataset
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

# 모델 로드
model = BertForSequenceClassification.from_pretrained('./saved_model')
tokenizer = BertTokenizer.from_pretrained('./saved_model')

# 모델 학습
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

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
            'input_ids': inputs['input_ids'].flatten(),
            'attention_mask': inputs['attention_mask'].flatten(),
            'labels': torch.tensor(label, dtype=torch.long)
        }
    

# 데이터 로드
df = pd.read_csv('data/output.csv')

# 데이터 타입 숫자로 변환
type_mapping = {
    'is_immoral': 0,
    'DISCRIMINATION': 1,
    'SEXUAL': 1,
    'ABUSE': 2,
    'VIOLENCE': 3,
    'CRIME': 3,
    'HATE': 4,
    'CENSURE': 5
}
df['types'] = df['types'].map(type_mapping)

# NaN 값이 있는 행 삭제
df = df.dropna(subset=['types'])

X_train, X_test, y_train, y_test = train_test_split(df['text'], df['types'], test_size=0.2, random_state=42)

train_dataset = HateSpeechDataset(X_train.tolist(), y_train.tolist(), tokenizer)
test_dataset = HateSpeechDataset(X_test.tolist(), y_test.tolist(), tokenizer)

train_loader = DataLoader(train_dataset, batch_size=16, shuffle=True)
test_loader = DataLoader(test_dataset, batch_size=16, shuffle=False)


# 평가
model.eval()
predictions, true_labels = [], []
for batch in test_loader:
    batch = {k: v.to(device) for k, v in batch.items()}
    with torch.no_grad():
        outputs = model(**batch)
    logits = outputs.logits
    predictions.extend(torch.argmax(logits, dim=1).tolist())
    true_labels.extend(batch['labels'].tolist())

print(classification_report(true_labels, predictions))
