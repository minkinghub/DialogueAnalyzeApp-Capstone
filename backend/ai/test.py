import torch
from torch.utils.data import Dataset, DataLoader
# from transformers import T5ForConditionalGeneration, T5TokenizerFast
# from transformers import AutoTokenizer, AutoModelForSequenceClassification
# from transformers import BertTokenizer, BertForSequenceClassification
from .cleaner import clean

# device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
# grammar_model = T5ForConditionalGeneration.from_pretrained('./saved_model/grammar')
# emotion_model = AutoModelForSequenceClassification.from_pretrained("./saved_model/emotion").to(device)
# moral_model = BertForSequenceClassification.from_pretrained('./saved_model/moral').to(device)
# politely_model = AutoModelForSequenceClassification.from_pretrained("./saved_model/politely").to(device)

# # 4개의 토크나이저 불러오기
# grammar_tokenizer = T5TokenizerFast.from_pretrained('./saved_model/grammar')
# emotion_tokenizer = AutoTokenizer.from_pretrained("./saved_model/emotion")
# moral_tokenizer = BertTokenizer.from_pretrained('./saved_model/moral')
# politely_tokenizer = AutoTokenizer.from_pretrained('beomi/kcbert-base')

def analyzeAllModel(corrected_texts, device, grammar_model, emotion_TF_model, emotion_model, moral_TF_model, moral_model, politely_model, grammar_tokenizer, emotion_TF_tokenizer, emotion_tokenizer, moral_TF_tokenizer, moral_tokenizer, politely_tokenizer): # 정제된 문자열 배열

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

    # 감정 분석 1호기(긍정 혹은 부정)
    def sentence_predict_TF(sent):
        emotion_TF_model.eval()
        tokenized_sent = emotion_TF_tokenizer(
            [sent],
            return_tensors="pt",
            max_length=128,
            padding=True,
            truncation=True,
            add_special_tokens=True,
        )
        tokenized_sent = {k: v.to(device) for k, v in tokenized_sent.items()}
        with torch.no_grad():
            outputs = emotion_TF_model(**tokenized_sent)
        logits = outputs.logits
        probabilities = torch.softmax(logits, dim=1)
        predicted_label = torch.argmax(probabilities, dim=1).item()
        return predicted_label

    # 감정 분석 2호기(7가지 세부 감정)
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

    # moral 1호기(탐지 혹은 미탐지)
    def moral_predict_TF(sent):
        moral_TF_model.eval()
        tokenized_sent = moral_TF_tokenizer(
            [sent],
            return_tensors="pt",
            max_length=128,
            padding=True,
            truncation=True,
            add_special_tokens=True,
        )
        tokenized_sent = {k: v.to(device) for k, v in tokenized_sent.items()}
        with torch.no_grad():
            outputs = moral_TF_model(**tokenized_sent)
        logits = outputs.logits
        probabilities = torch.softmax(logits, dim=1)
        predicted_label = torch.argmax(probabilities, dim=1).item()
        return predicted_label

    # moral 2호기(6가지 감정 분류)
    def moral_predict(sent):
        moral_model.eval()
        tokenized_sent = moral_tokenizer(
            [sent],
            return_tensors="pt",
            max_length=128,
            padding=True,
            truncation=True,
            add_special_tokens=True,
        )
        tokenized_sent = {k: v.to(device) for k, v in tokenized_sent.items()}
        with torch.no_grad():
            outputs = moral_model(
                input_ids=tokenized_sent["input_ids"],
                attention_mask=tokenized_sent["attention_mask"],
            )
        logits = outputs[0]
        logits = logits.detach().cpu()
        result = logits.argmax(-1).numpy()[0]
        return result

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
        grammar = corrected_texts_results[i]
        grammar_result = 1 if original_texts[i] == corrected_texts_results[i] else 0

        # emotion_result = sentence_predict(corrected_texts[i])
        emotion_result_TF = sentence_predict_TF(corrected_texts_results[i])
        # 감정 분석 1호기는 감정 분석 2호기 결과가 0(부정)일 경우에만 실행
        # if emotion_result_TF == 0:
        #     emotion_result = sentence_predict(corrected_texts_results[i])
        # else:
        #     emotion_result = 7 # 0~6 범위의 값을 가지므로 7로 고정

        # 감정 분석이 부정일 경우 세부 분석 시행
        if emotion_result_TF == 0:
            emotion_result_TF = sentence_predict(corrected_texts_results[i])
        else:
            emotion_result_TF = 100

        #moral_result = moral_predict(sentence)
        moral_result_TF = moral_predict_TF(corrected_texts_results[i])
        # moral 또한 1호기 결과가 0(불쾌 발언 존재)일 경우에만 실행
        # if moral_result_TF == 0:
        #     moral_result = moral_predict(corrected_texts_results[i])
        # else:
        #     moral_result = 6 # 0~5 범위의 값을 가지므로 6으로 고정

        # 불쾌 발언이 부정일 경우 세부 분석 시행
        if moral_result_TF == 0:
            moral_result_TF = moral_predict(corrected_texts_results[i])
        else:
            moral_result_TF = 100

        politely_result = FormalClassifier().formal_percentage(corrected_texts_results[i])
        if politely_result > 0.5:
            politely_label = 1
        else:
            politely_label = 0

        # 원문, 맞춤법 수정문, 맞춤법 수정 여부, 감정, 불쾌 발언, 존댓말 여부
        model_result = {
            "Text": corrected_texts[i],
            "grammar_text": grammar,
            "grammar": grammar_result,
            #"emotion_TF": int(emotion_result_TF),
            #"emotion": int(emotion_result),
            "emotion": int(emotion_result_TF),
            #"moral_TF": int(moral_result_TF),
            #"moral": int(moral_result),
            "moral": int(moral_result_TF),
            "politely": politely_label
        }
        print(model_result)
        model_results.append(model_result)
    return model_results