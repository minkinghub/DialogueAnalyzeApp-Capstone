import torch
from transformers import T5ForConditionalGeneration, T5Tokenizer, pipeline

model = T5ForConditionalGeneration.from_pretrained('j5ng/et5-typos-corrector')
tokenizer = T5Tokenizer.from_pretrained('j5ng/et5-typos-corrector')

typos_corrector = pipeline(
    "text2text-generation",
    model=model,
    tokenizer=tokenizer,
    device=0 if torch.cuda.is_available() else -1,
    framework="pt",
)

input_text = "지베 가고 시따"
output_text = typos_corrector("맞춤법을 고쳐주세요: " + input_text,
            max_length=128,
            num_beams=5,
            early_stopping=True)[0]['generated_text']

print(output_text)