import pandas as pd
from torch.utils.data import DataLoader, Dataset
from tqdm import tqdm
from transformers import BertTokenizer, BertForSequenceClassification, AdamW
from transformers import get_linear_schedule_with_warmup
import torch
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

# 데이터 로드
df = pd.read_csv('data/output.csv')

# KoBERT 토크나이저 로드
tokenizer = BertTokenizer.from_pretrained('kykim/bert-kor-base')

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
    
# 데이터 준비
X_train, X_test, y_train, y_test = train_test_split(df['text'], df['types'], test_size=0.2, random_state=42)

train_dataset = HateSpeechDataset(X_train.tolist(), y_train.tolist(), tokenizer)
test_dataset = HateSpeechDataset(X_test.tolist(), y_test.tolist(), tokenizer)

train_loader = DataLoader(train_dataset, batch_size=16, shuffle=True)
test_loader = DataLoader(test_dataset, batch_size=16, shuffle=False)

# 모델 로드 및 파인 튜닝
model = BertForSequenceClassification.from_pretrained('kykim/bert-kor-base', num_labels=6)
model.cuda()

optimizer = AdamW(model.parameters(), lr=2e-5)
total_steps = len(train_loader) * 10
scheduler = get_linear_schedule_with_warmup(optimizer, num_warmup_steps=0, num_training_steps=total_steps)

# 모델 학습
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model.train()

for epoch in range(10):
    train_loss = 0.0
    train_steps = 0
    
    # 프로그레스 바 추가
    train_loader = tqdm(train_loader, desc=f"Epoch {epoch+1}/10", unit="batch")
    
    for batch in train_loader:
        batch = {k: v.to(device) for k, v in batch.items()}
        outputs = model(**batch)
        loss = outputs.loss
        loss.backward()
        optimizer.step()
        scheduler.step()
        optimizer.zero_grad()
        
        train_loss += loss.item()
        train_steps += 1
        
        # 프로그레스 바 업데이트
        train_loader.set_postfix(loss=train_loss/train_steps)
        
    print(f"Epoch {epoch+1}/10 - Training Loss: {train_loss/train_steps:.4f}")


# 모델 저장
model.save_pretrained('./saved_model')

# 토크나이저 저장
tokenizer.save_pretrained('./saved_model')

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
