import pandas as pd
import torch
import json
from torch.utils.data import Dataset, DataLoader
from transformers import T5ForConditionalGeneration, T5TokenizerFast
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from transformers import BertTokenizer, BertForSequenceClassification
from utils import clean
from collections import defaultdict

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# 4개의 모델 불러오기
grammar_model = T5ForConditionalGeneration.from_pretrained('./grammar/saved_model')
emotion_model = AutoModelForSequenceClassification.from_pretrained("./emotion/saved_model").to(device)
moral_model = BertForSequenceClassification.from_pretrained('./moral/saved_model').to(device)
politely_model = AutoModelForSequenceClassification.from_pretrained("./politely/saved_model/save").to(device)

# 4개의 토크나이저 불러오기
grammar_tokenizer = T5TokenizerFast.from_pretrained('./grammar/saved_model')
emotion_tokenizer = AutoTokenizer.from_pretrained("./emotion/saved_model")
moral_tokenizer = BertTokenizer.from_pretrained('./moral/saved_model')
politely_tokenizer = AutoTokenizer.from_pretrained('beomi/kcbert-base')

# 맞춤법 검증 모델

# 데이터 불러오기
df_test = pd.read_csv("./grammar/data/typos_test.csv")
df_test_sample = df_test.sample(n=200)  # 무작위로 20개 샘플 선택

corrected_texts = []
for _, row in df_test_sample.iterrows():
    input_text = "맞춤법을 고쳐주세요: " + row['original']
    output_text = grammar_model.generate(
        input_ids=grammar_tokenizer(input_text, return_tensors='pt').input_ids,
        max_length=128,
        num_beams=5,
        early_stopping=True
    )[0].squeeze().tolist()
    output_text = grammar_tokenizer.decode(output_text, skip_special_tokens=True).replace("정답: ", "").strip('.')
    corrected_texts.append(output_text)

# 감정 분석 모델
def sentence_predict(sent):
    emotion_model.eval()
    tokenized_sent = emotion_tokenizer(
        [sent],
        return_tensors="pt",
        max_length=128,
        padding=True,
        truncation=True,
        add_special_tokens=True,
    )
    tokenized_sent = {k: v.to(device) for k, v in tokenized_sent.items()}
    with torch.no_grad():
        outputs = emotion_model(
            input_ids=tokenized_sent["input_ids"],
            attention_mask=tokenized_sent["attention_mask"],
        )
    logits = outputs[0]
    logits = logits.detach().cpu()
    result = logits.argmax(-1).numpy()[0]
    return result

# 불쾌 발언 탐지 모델

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

test_dataset = HateSpeechDataset(corrected_texts, moral_tokenizer)

test_loader = DataLoader(test_dataset, batch_size=16, shuffle=True)

# 평가
def moral_predict(dataloader):
    moral_model.eval()
    all_predictions = []
    
    for batch in test_loader:
        batch = {k: v.to(device) for k, v in batch.items()}
        with torch.no_grad():
            outputs = moral_model(**batch)
        logits = outputs.logits
        batch_predictions = torch.argmax(logits, dim=1).tolist()
        all_predictions.extend(batch_predictions)
    
    return all_predictions

# 존댓말 반말 검증 모델
class FormalClassifier(object):
    def predict(self, text: str):
        text = clean(text)
        inputs = politely_tokenizer(
            text, return_tensors="pt", max_length=64, truncation=True, padding="max_length")
        input_ids = inputs["input_ids"].to(device)
        token_type_ids = inputs["token_type_ids"].to(device)
        attention_mask = inputs["attention_mask"].to(device)

        model_inputs = {
            "input_ids": input_ids,
            "token_type_ids": token_type_ids,
            "attention_mask": attention_mask,
        }
        return torch.softmax(politely_model(**model_inputs).logits, dim=-1)

    def is_formal(self, text):
        if self.predict(text)[0][1] > self.predict(text)[0][0]:
            return True
        else:
            return False

    def formal_percentage(self, text):
        return round(float(self.predict(text)[0][1]), 2)

    def print_message(self, text):
        result = self.formal_percentage(text)
        if result > 0.5:
            print(f'{text} : 존댓말입니다. ( 확률 {result*100}% )')
        else:
            print(f'{text} : 반말입니다. ( 확률 {((1 - result)*100)}% )')

o = 0
# JSON 파일로 저장
model_results = []
for sentence in corrected_texts:
    grammar_result = grammar_model.generate(
        input_ids=grammar_tokenizer(f"맞춤법을 고쳐주세요: {sentence}", return_tensors='pt').input_ids,
        max_length=128,
        num_beams=5,
        early_stopping=True
    )[0].squeeze().tolist()
    grammar_result = grammar_tokenizer.decode(grammar_result, skip_special_tokens=True).replace("정답: ", "").strip('.')

    emotion_result = sentence_predict(sentence)
    moral_result = moral_predict(sentence)

    politely_result = FormalClassifier().formal_percentage(sentence)
    if politely_result > 0.5:
        politely_label = 1
    else:
        politely_label = 0

    model_result = {
        "Text": sentence,
        "grammar": grammar_result,
        "emotion": int(emotion_result),
        "moral": moral_result[o],
        "politely": politely_label
    }
    o += 1
    model_results.append(model_result)

with open("model_results.json", "w", encoding="utf-8") as f:
    json.dump(model_results, f, ensure_ascii=False, indent=2)
