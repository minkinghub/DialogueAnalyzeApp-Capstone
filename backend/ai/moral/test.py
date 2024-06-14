import torch
import pandas as pd
import matplotlib.pyplot as plt
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

#df = df.sample(n=1000, random_state=42)
X = df['text'].tolist()
y = df['types'].tolist()

test_dataset = HateSpeechDataset(X, y, tokenizer)

test_loader = DataLoader(test_dataset, batch_size=16, shuffle=True)

# 평가
model.eval()
correct = 0
total = 0
data_processed = []  # 처리된 데이터의 총량을 저장할 리스트
accuracies = []  # 각 스텝에서의 정확도를 저장할 리스트

for batch in test_loader:
    batch = {k: v.to(device) for k, v in batch.items()}
    with torch.no_grad():
        outputs = model(**batch)
    logits = outputs.logits
    batch_predictions = torch.argmax(logits, dim=1).tolist()
    batch_true_labels = batch['labels'].tolist()
    
    for i in range(len(batch_predictions)):
        pred = batch_predictions[i]
        true_label = batch_true_labels[i]
        if pred == true_label:
            correct += 1
    total += len(batch_predictions)
    
    # 각 배치 후 정확도 계산하여 리스트에 추가
    batch_accuracy = correct / total
    accuracies.append(batch_accuracy)
    data_processed.append(total)  # 처리된 데이터의 총량을 리스트에 추가

# 정확도 그래프 그리기
plt.figure(figsize=(10, 6))
plt.plot(data_processed, accuracies, label='Accuracy per data processed')  # x축을 처리된 데이터의 총량으로 변경
plt.xlabel('Number of data processed')
plt.ylabel('Accuracy')
plt.title('Accuracy per data processed during evaluation')
plt.legend()
plt.grid(True)
plt.savefig('accuracy_graph.png')  # 그래프를 파일로 저장
plt.show()
