import torch
import pandas as pd
import matplotlib.pyplot as plt
from transformers import BertTokenizer, BertForSequenceClassification
from torch.utils.data import DataLoader, Dataset
from tqdm import tqdm
from sklearn.metrics import classification_report, accuracy_score, precision_score, recall_score, f1_score

# 모델 로드
moral_TF_model = BertForSequenceClassification.from_pretrained('./saved_TF_model', num_labels=2)
moral_model = BertForSequenceClassification.from_pretrained('./saved_model', num_labels=6)

moral_TF_tokenizer = BertTokenizer.from_pretrained('./saved_TF_model')
moral_tokenizer = BertTokenizer.from_pretrained('./saved_model')

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

moral_TF_model.to(device)
moral_model.to(device)


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
df = pd.read_csv('data/sum.csv')
# 데이터 랜덤으로 1000개 선택
df = df.sample(n=1000, random_state=42)

X = df['text'].tolist()
y = df['types'].tolist()
y2 = df['types2'].tolist()

test_dataset = HateSpeechDataset(X, y, moral_tokenizer)
test_loader = DataLoader(test_dataset, batch_size=16, shuffle=True)

# 평가 (moral_model)
moral_model.eval()
moral_correct = 0
moral_total = 0
moral_data_processed = []
moral_accuracies = []
moral_metrics = {
    'accuracy': [],
    'precision': [],
    'recall': [],
    'f1': []
}


for batch in tqdm(test_loader, desc='Evaluating'):
    batch = {k: v.to(device) for k, v in batch.items()}
    with torch.no_grad():
        outputs = moral_model(**batch)
    logits = outputs.logits
    batch_predictions = torch.argmax(logits, dim=1).tolist()
    batch_true_labels = batch['labels'].tolist()
    
    for i in range(len(batch_predictions)):
        pred = batch_predictions[i]
        true_label = batch['labels'][i].item()
        if pred == true_label:
            moral_correct += 1
    moral_total += len(batch_predictions)
    
    batch_accuracy = accuracy_score(batch_true_labels, batch_predictions)
    batch_precision = precision_score(batch_true_labels, batch_predictions, average='weighted')
    batch_recall = recall_score(batch_true_labels, batch_predictions, average='weighted')
    batch_f1 = f1_score(batch_true_labels, batch_predictions, average='weighted')
    
    moral_metrics['accuracy'].append(batch_accuracy)
    moral_metrics['precision'].append(batch_precision)
    moral_metrics['recall'].append(batch_recall)
    moral_metrics['f1'].append(batch_f1)

# 평가 (moral_TF_model)
moral_TF_model.eval()
moral_TF_correct = 0
moral_TF_total = 0
moral_TF_data_processed = []
moral_TF_accuracies = []
moral_TF_metrics = {
    'accuracy': [],
    'precision': [],
    'recall': [],
    'f1': []
}

for batch in tqdm(test_loader, desc='Evaluating'):
    batch = {k: v.to(device) for k, v in batch.items()}
    with torch.no_grad():
        outputs = moral_TF_model(**batch)
    logits = outputs.logits
    batch_predictions = torch.argmax(logits, dim=1).tolist()
    batch_true_labels = batch['labels'].tolist()
    
    for i in range(len(batch_predictions)):
        pred = batch_predictions[i]
        true_label = batch['labels'][i].item()
        if pred == true_label:
            moral_TF_correct += 1
    moral_TF_total += len(batch_predictions)
    
    batch_accuracy = accuracy_score(batch_true_labels, batch_predictions)
    batch_precision = precision_score(batch_true_labels, batch_predictions, average='weighted')
    batch_recall = recall_score(batch_true_labels, batch_predictions, average='weighted')
    batch_f1 = f1_score(batch_true_labels, batch_predictions, average='weighted')
    
    moral_TF_metrics['accuracy'].append(batch_accuracy)
    moral_TF_metrics['precision'].append(batch_precision)
    moral_TF_metrics['recall'].append(batch_recall)
    moral_TF_metrics['f1'].append(batch_f1)

# 그래프 그리기
plt.figure(figsize=(10, 6))
for metric in ['accuracy', 'precision', 'recall', 'f1']:
    plt.plot(moral_data_processed, moral_metrics[metric], label=f'moral_model {metric}')
    plt.plot(moral_TF_data_processed, moral_TF_metrics[metric], label=f'moral_TF_model {metric}')
plt.xlabel('Number of data processed')
plt.ylabel('Metric value')
plt.title('Evaluation metrics per data processed during evaluation')
plt.legend()
plt.grid(True)
plt.savefig('metrics_graph.png')
plt.show()