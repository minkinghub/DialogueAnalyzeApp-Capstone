import pandas as pd
import transformers
import torch
from pathlib import Path

from transformers import AutoTokenizer, AutoModelForSequenceClassification
from utils import clean

BASE_DIR = str(Path(__file__).resolve().parent)

latest_model_path = BASE_DIR + '/formal_classifier_latest'
device = 'cuda:0'

class FormalClassifier(object):
    def __init__(self):
        self.model = AutoModelForSequenceClassification.from_pretrained(
            latest_model_path).to(device)
        self.tokenizer = AutoTokenizer.from_pretrained('beomi/kcbert-base')

    def predict(self, text: str):
        text = clean(text)
        inputs = self.tokenizer(
            text, return_tensors="pt", max_length=64, truncation=True, padding="max_length")
        input_ids = inputs["input_ids"].to(device)
        token_type_ids = inputs["token_type_ids"].to(device)
        attention_mask = inputs["attention_mask"].to(device)

        model_inputs = {
            "input_ids": input_ids,
            "token_type_ids": token_type_ids,
            "attention_mask": attention_mask,
        }
        return torch.softmax(self.model(**model_inputs).logits, dim=-1)

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

if __name__ == "__main__":
    # CSV 파일에서 'corrected' 열의 무작위 20개 문장을 선택
    df = pd.read_csv(BASE_DIR + '/data/typos_test.csv')
    random_sentences = df['corrected'].sample(n=20)

    classifier = FormalClassifier()
    
    for sentence in random_sentences:
        classifier.print_message(sentence)
