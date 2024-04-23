import pandas as pd
import torch
import re
import json
import pickle
from keras.preprocessing.text import Tokenizer
from torch.utils.data import Dataset, DataLoader
from transformers import ElectraForSequenceClassification, ElectraTokenizer
import tensorflow as tf
from tensorflow import keras
from keras.utils import pad_sequences
from konlpy.tag import Okt

import keras

from transformers import AutoTokenizer, AutoModelForSequenceClassification
from pathlib import Path
from utils import clean

# 맞춤법 검증 모델
# 저장된 모델과 토크나이저 불러오기
model_save_path = './grammar/saved_model'
tokenizer_save_path = './grammar/saved_tokenizer'
loaded_model = ElectraForSequenceClassification.from_pretrained(model_save_path)
loaded_tokenizer = ElectraTokenizer.from_pretrained(tokenizer_save_path)

print("모델과 토크나이저가 성공적으로 불러와졌습니다.")

# 데이터 불러오기
df_test = pd.read_csv("./grammar/data/typos_test.csv")
df_test_sample = df_test.sample(n=20)  # 무작위로 20개 샘플 선택
test_texts = df_test_sample['original'].tolist()

# 테스트 데이터셋 클래스 정의
class TestDataset(Dataset):
    def __init__(self, tokenizer, texts, labels, max_len):
        self.tokenizer = tokenizer
        self.texts = texts
        self.labels = labels
        self.max_len = max_len

    def __len__(self):
        return len(self.texts)

    def __getitem__(self, item):
        text = str(self.texts[item])
        label = self.labels[item]

        encoding = self.tokenizer.encode_plus(
          text,
          add_special_tokens=True,
          max_length=self.max_len,
          return_token_type_ids=False,
          padding='max_length',
          return_attention_mask=True,
          return_tensors='pt',
          truncation=True,
        )

        return {
          'review_text': text,
          'input_ids': encoding['input_ids'].flatten(),
          'attention_mask': encoding['attention_mask'].flatten(),
          'labels': torch.tensor(label, dtype=torch.long)
        }

# 테스트 데이터셋 생성
max_len = 128  # 최대 시퀀스 길이
test_labels = [0] * len(test_texts)  # 실제 레이블은 사용하지 않으므로 0으로 초기화
test_dataset = TestDataset(tokenizer=loaded_tokenizer, texts=test_texts, labels=test_labels, max_len=max_len)

# 예측 함수
def predict(model, dataset):
    model.eval()  # 평가 모드
    predictions = []
    with torch.no_grad():
        for item in DataLoader(dataset, batch_size=1):
            outputs = model(item['input_ids'].to(model.device), attention_mask=item['attention_mask'].to(model.device))
            logits = outputs.logits
            predictions.append(torch.argmax(logits, dim=1).cpu().numpy())
    return predictions

# 예측 실행
predictions = predict(loaded_model, test_dataset)

# 예측 결과 출력 및 맞춤법 교정된 텍스트 저장
corrected_texts = []
for idx, (text, pred) in enumerate(zip(test_texts, predictions)):
    correct_text = df_test_sample.iloc[idx]['corrected']  # 올바른 텍스트를 가져옵니다.
    corrected_texts.append(correct_text)
    print(f"텍스트: {text}, 예측: {'맞춤법이 틀림' if pred==1 else '맞춤법이 맞음'}, 올바른 맞춤법: {correct_text}")

print("corrected_texts값" + str(corrected_texts))
# 감정 분석 모델
tf.config.run_functions_eagerly(True)

okt = Okt()
tokenizer = Tokenizer()

# 설정 파일 및 토크나이저 불러오기
DATA_CONFIGS = 'data_configs.json'
prepro_configs = json.load(open('C:/final_project/CalendarRecipe-Capstone/backend/ai/emotion/content/sample_data/CLEAN_DATA/' + DATA_CONFIGS, 'r'))

with open('C:/final_project/CalendarRecipe-Capstone/backend/ai/emotion/content/sample_data/CLEAN_DATA/tokenizer.pickle', 'rb') as handle:
    word_vocab = pickle.load(handle)

prepro_configs['vocab'] = word_vocab
tokenizer.fit_on_texts(word_vocab)

# 문장 최대 길이 설정
MAX_LENGTH = 8

# 학습한 모델 불러오기
model = keras.models.load_model('C:/final_project/CalendarRecipe-Capstone/backend/ai/emotion/content/sample_data/my_models/')
model.load_weights('C:/final_project/CalendarRecipe-Capstone/backend/ai/emotion/content/sample_data/DATA_OUT/cnn_classifier_kr/weights.h5')

# 맞춤법 교정된 텍스트로 감정 분석 실행
for sentence in corrected_texts:
    print(f"분석할 문장: {sentence}")
    sentence = re.sub(r'[^ㄱ-ㅎㅏ-ㅣ가-힣\s]', '', sentence)
    stopwords = ['은', '는', '이', '가', '하', '아', '것', '들', '의', '있', '되', '수', '보', '주', '등', '한']
    sentence = okt.morphs(sentence, stem=True)  # 토큰화
    sentence = [word for word in sentence if not word in stopwords]  # 불용어 제거
    vector = tokenizer.texts_to_sequences([sentence])
    pad_new = pad_sequences(vector, maxlen=MAX_LENGTH)  # 패딩

    predictions = model.predict(pad_new)
    predictions = float(predictions.squeeze(-1)[0])

    if predictions > 0.5:
        print("{:.2f}% 확률로 긍정 문장입니다.\n".format(predictions * 100))
    else:
        print("{:.2f}% 확률로 부정 문장입니다.\n".format((1 - predictions) * 100))


# 존댓말 반말 검증 모델

BASE_DIR = str(Path(__file__).resolve().parent)

latest_model_path = BASE_DIR + '/politely/formal_classifier_latest'
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
    classifier = FormalClassifier()
    
    for sentence in corrected_texts:
        classifier.print_message(sentence)
