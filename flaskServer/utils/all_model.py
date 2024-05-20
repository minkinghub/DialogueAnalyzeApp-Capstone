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

def analyzeAllModel(corrected_texts, device, grammar_model, emotion_model, moral_model, politely_model, grammar_tokenizer, emotion_tokenizer, moral_tokenizer, politely_tokenizer): # 정제된 문자열 배열

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
        grammar_result = 1 if (corrected_texts[i] == corrected_texts_results[i]) else 0
        emotion_result = sentence_predict(corrected_texts[i])
        moral_result = moral_predict(sentence)

        politely_result = FormalClassifier().formal_percentage(corrected_texts[i])
        if politely_result > 0.5:
            politely_label = 1
        else:
            politely_label = 0

        model_result = {
            "chatContent": corrected_texts[i],
            "grammarChat" : corrected_texts_results[i],
            "isGrammar": grammar_result,
            "isPositive": int(emotion_result),
            "isMoral": moral_result[0],
            "isPolite": politely_label
        }
        print(model_result)
        model_results.append(model_result)

    return model_results
# with open("model_results.json", "w", encoding="utf-8") as f:
#     json.dump(model_results, f, ensure_ascii=False, indent=2)