import pandas as pd
from torch.utils.data import DataLoader, Dataset
from tqdm import tqdm
from transformers import BertTokenizer, BertForSequenceClassification, AdamW, BertConfig
from transformers import get_linear_schedule_with_warmup
import torch
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import matplotlib.pyplot as plt

# 데이터 로드
df = pd.read_csv('data/moralTFTrain.csv')
# 일부 데이터 랜덤으로 사용
df = df.sample(n=10000, random_state=42)

# KoBERT 토크나이저 로드
tokenizer = BertTokenizer.from_pretrained('kykim/bert-kor-base')

# 데이터셋 정의
class HateSpeechDataset(Dataset):
    def __init__(self, texts, labels, tokenizer, max_len=128):
        self.texts = texts
        self.labels = labels
        self.tokenizer = tokenizer
        self.max_len = max_len

    def __len__(self):
        return len(self.texts)

    def __getitem__(self, idx):
        text = self.texts[idx]
        label = self.labels[idx]

        encoding = self.tokenizer.encode_plus(
            text,
            add_special_tokens=True,
            max_length=self.max_len,
            return_token_type_ids=False,
            padding='max_length',
            return_attention_mask=True,
            return_tensors='pt',
        )

        return {
            'input_ids': encoding['input_ids'].flatten(),
            'attention_mask': encoding['attention_mask'].flatten(),
            'labels': torch.tensor(label, dtype=torch.long)
        }

# 데이터 준비
X_train, X_test, y_train, y_test = train_test_split(df['text'], df['types'], test_size=0.2, random_state=42)

train_dataset = HateSpeechDataset(X_train.tolist(), y_train.tolist(), tokenizer)
test_dataset = HateSpeechDataset(X_test.tolist(), y_test.tolist(), tokenizer)

train_loader = DataLoader(train_dataset, batch_size=16, shuffle=True)
test_loader = DataLoader(test_dataset, batch_size=16, shuffle=False)

# 모델 로드 및 파인 튜닝
config = BertConfig.from_pretrained('kykim/bert-kor-base', hidden_dropout_prob=0.3, attention_probs_dropout_prob=0.3)
model = BertForSequenceClassification.from_pretrained('kykim/bert-kor-base', config=config)
model.cuda()

optimizer = AdamW(model.parameters(), lr=1e-5, weight_decay=0.01)
total_steps = len(train_loader) * 20
scheduler = get_linear_schedule_with_warmup(optimizer, num_warmup_steps=0, num_training_steps=total_steps)

# 모델 학습
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

train_loss_values = []
train_accuracy_values = []
val_loss_values = []
val_accuracy_values = []

for epoch in range(20):
    model.train()
    train_loss = 0.0
    train_correct = 0
    train_total = 0
    
    for batch in tqdm(train_loader, desc=f'Training Epoch {epoch+1}'):
        optimizer.zero_grad()
        inputs = {key: value.to(device) for key, value in batch.items()}
        outputs = model(**inputs)
        loss = outputs.loss
        loss.backward()
        optimizer.step()
        scheduler.step()

        train_loss += loss.item()
        preds = outputs.logits.argmax(dim=1)
        train_correct += (preds == inputs['labels']).sum().item()
        train_total += inputs['labels'].size(0)
    
    avg_train_loss = train_loss / len(train_loader)
    train_accuracy = train_correct / train_total

    train_loss_values.append(avg_train_loss)
    train_accuracy_values.append(train_accuracy)
    
    model.eval()
    val_loss = 0.0
    val_correct = 0
    val_total = 0
    
    with torch.no_grad():
        for batch in tqdm(test_loader, desc=f'Validation Epoch {epoch+1}'):
            inputs = {key: value.to(device) for key, value in batch.items()}
            outputs = model(**inputs)
            loss = outputs.loss

            val_loss += loss.item()
            preds = outputs.logits.argmax(dim=1)
            val_correct += (preds == inputs['labels']).sum().item()
            val_total += inputs['labels'].size(0)
    
    avg_val_loss = val_loss / len(test_loader)
    val_accuracy = val_correct / val_total
    
    val_loss_values.append(avg_val_loss)
    val_accuracy_values.append(val_accuracy)

    print(f'Epoch {epoch+1}/{20}')
    print(f'Train Loss: {avg_train_loss:.4f} | Train Accuracy: {train_accuracy:.4f}')
    print(f'Val Loss: {avg_val_loss:.4f} | Val Accuracy: {val_accuracy:.4f}')

# 모델 저장
model.save_pretrained('./saved_TF_model')
tokenizer.save_pretrained('./saved_TF_model')

# 결과 시각화
plt.figure(figsize=(12, 5))

plt.subplot(1, 2, 1)
plt.plot(train_loss_values, label='Train Loss')
plt.plot(val_loss_values, label='Validation Loss')
plt.xlabel('Epoch')
plt.ylabel('Loss')
plt.legend()
plt.title('Loss Over Epochs')

plt.subplot(1, 2, 2)
plt.plot(train_accuracy_values, label='Train Accuracy')
plt.plot(val_accuracy_values, label='Validation Accuracy')
plt.xlabel('Epoch')
plt.ylabel('Accuracy')
plt.legend()
plt.title('Accuracy Over Epochs')

plt.savefig('loss_and_accuracy.png')

plt.show()
