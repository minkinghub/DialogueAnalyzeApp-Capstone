import pandas as pd
import torch
import json
from torch.utils.data import Dataset, DataLoader
from transformers import T5ForConditionalGeneration, T5TokenizerFast
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from transformers import BertTokenizer, BertForSequenceClassification
from utils import clean

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
grammar_model = T5ForConditionalGeneration.from_pretrained('./saved_model/grammar')
emotion_model = AutoModelForSequenceClassification.from_pretrained("./saved_model/emotion").to(device)
moral_model = BertForSequenceClassification.from_pretrained('./saved_model/moral').to(device)
politely_model = AutoModelForSequenceClassification.from_pretrained("./saved_model/politely").to(device)

# 4개의 토크나이저 불러오기
grammar_tokenizer = T5TokenizerFast.from_pretrained('./saved_model/grammar')
emotion_tokenizer = AutoTokenizer.from_pretrained("./saved_model/emotion")
moral_tokenizer = BertTokenizer.from_pretrained('./saved_model/moral')
politely_tokenizer = AutoTokenizer.from_pretrained('beomi/kcbert-base')

# 정제된 문자열 배열
corrected_texts = [
    "가람 초등학교는 완전히 끝난거 맞죠?",
    "가람초 해당되는 강사분들 답변바랍니다",
    "제가알기론 13일날 한번 남은걸로 알고있습니다.!",
    "추가로 스마트팜 조립은 프레임 빼고 다 해놨고 오늘 공진건 학생 안와서 5개만 되어있어요.",
    "각 조립에 학생들 이름 붙여놨으니 구별할 수 있습니다.",
    "그냥 그대로 하루에 2차시씩 한거 맞나요?",
    "결과보고서 및 기증문서 대부분은 제가 다 작성해놓았으니 서명받고 사업단에 제출하시면 됩니다",
    "네. 원래 일정상 13일이 마지막 날입니다",
    "안녕하세요, 11월 말일까지 진행했던 해봄학교 교육활동 출석부만 먼저 제출 부탁드립니다~ ",
    "현재 다 완료되지 않은 관계로 활동결과보고서 전체가 아닌 서명부 부탁드립니다. ",
    "지금 현재 본인이 담당하고 있는 클래스 주 강사는 현재까지 '출석부' 날짜 잘 보이게 사진 찍어서 내일 10:00시까지 보내주세요.",
    "강사비 지급 '마지막' 공지입니다. 수요일 오후 14:00시까지 1번, 2번 서류 작성해서 보내주세요.",
    "안 보내시면강사비 지급 '불가'합니다.최종으로 공지드립니다.",
    "출석부 12월 1일까지의 출결사항 및 근무일자 기재 후 필히 보내주시기 바랍니다.",
    "선문대학교 담당자입니다.",
    "내일 회식 참석 전",
    "또는 귀가 전",
    "시발새끼",
    "난 너가 너무 싫어",
    "혐오스러워",
    "진짜 세상 다 안망하네~ 인생 잣같네 진짜",
    "싫다 진자 전부 다 귀찮다 이젠",
    "너가 너무 미워서 정말 시러"
]

# 맞춤법 검증 모델
corrected_texts_results = []
original_texts = []
for text in corrected_texts:
    input_text = "맞춤법을 고쳐주세요: " + text
    output_text = grammar_model.generate(
        input_ids=grammar_tokenizer(input_text, return_tensors='pt').input_ids,
        max_length=128,
        num_beams=5,
        early_stopping=True
    )[0].squeeze().tolist()
    output_text = grammar_tokenizer.decode(output_text, skip_special_tokens=True).replace("정답: ", "").strip('.')
    corrected_texts_results.append(output_text)
    original_texts.append(text)

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

test_dataset = HateSpeechDataset(corrected_texts_results, moral_tokenizer)
test_loader = DataLoader(test_dataset, batch_size=16, shuffle=True)

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

# JSON 파일로 저장
model_results = []
for i, sentence in enumerate(corrected_texts_results):
    grammar_result = corrected_texts_results[i]
    emotion_result = sentence_predict(corrected_texts[i])
    moral_result = moral_predict(sentence)

    politely_result = FormalClassifier().formal_percentage(corrected_texts[i])
    if politely_result > 0.5:
        politely_label = 1
    else:
        politely_label = 0

    model_result = {
        "Text": corrected_texts[i],
        "grammar": grammar_result,
        "emotion": int(emotion_result),
        "moral": moral_result[0],
        "politely": politely_label
    }
    model_results.append(model_result)

with open("model_results.json", "w", encoding="utf-8") as f:
    json.dump(model_results, f, ensure_ascii=False, indent=2)