from flask import Flask, request, jsonify
import pandas as pd
import torch
from torch.utils.data import Dataset, DataLoader
from transformers import T5ForConditionalGeneration, T5TokenizerFast
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from transformers import BertTokenizer, BertForSequenceClassification
from utils.all_model import analyzeAllModel

app = Flask(__name__)

# 맞춤법, 감정, 불쾌 발언, 존댓말, 감정TF, 불쾌TF 모델 불러오기
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
grammar_model = T5ForConditionalGeneration.from_pretrained('./saved_model/grammar').to(device)
emotion_model = AutoModelForSequenceClassification.from_pretrained("./saved_model/emotion").to(device)
moral_model = BertForSequenceClassification.from_pretrained('./saved_model/moral').to(device)
politely_model = AutoModelForSequenceClassification.from_pretrained("./saved_model/politely").to(device)
emotion_TF_model = AutoModelForSequenceClassification.from_pretrained("./saved_model/emotion_TF").to(device)
moral_TF_model = AutoModelForSequenceClassification.from_pretrained("./saved_model/moral_TF").to(device)

# 4개의 토크나이저 불러오기
grammar_tokenizer = T5TokenizerFast.from_pretrained('./saved_model/grammar')
emotion_tokenizer = AutoTokenizer.from_pretrained("./saved_model/emotion")
moral_tokenizer = BertTokenizer.from_pretrained('./saved_model/moral')
politely_tokenizer = AutoTokenizer.from_pretrained('beomi/kcbert-base')
emotion_TF_tokenizer = AutoTokenizer.from_pretrained("./saved_model/emotion_TF")
moral_TF_tokenizer = AutoTokenizer.from_pretrained("./saved_model/moral_TF")

@app.route('/', methods=['POST'])
def home():
    return jsonify({'message': 'test'})

@app.route('/analysis', methods=['POST'])
def analysis():
    if request.is_json:
        data = request.get_json()  # JSON 데이터를 파이썬 딕셔너리로 변환
        request_array = data.get('requestArray')  # 'requestArray' 키로 배열 데이터 추출

        if request_array is None:
            return jsonify({'error': 'No requestArray key found'}), 400

        results = []        
        print("분석 시작")
        for speaker in request_array:
            textArray = speaker
            result = analyzeAllModel(corrected_texts = textArray, device = device, grammar_model = grammar_model, emotion_TF_model = emotion_TF_model, emotion_model = emotion_model, moral_TF_model = moral_TF_model, moral_model = moral_model, politely_model = politely_model,
                            grammar_tokenizer = grammar_tokenizer, emotion_TF_tokenizer = emotion_TF_tokenizer, emotion_tokenizer = emotion_tokenizer, moral_TF_tokenizer = moral_TF_tokenizer, moral_tokenizer = moral_tokenizer, politely_tokenizer = politely_tokenizer)
            results.append(result)
        print("분석 완료, 전송")
        return jsonify({'received': True, 'data': results})
    else:
        return jsonify({'error': 'Request must be JSON'}),

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5001, debug=True)