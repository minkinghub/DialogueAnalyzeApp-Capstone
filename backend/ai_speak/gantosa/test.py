import speech_recognition as sr
from google.cloud import storage
from pydub import AudioSegment
import os

# Google Cloud Speech-to-Text API 키 설정
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "C:/final_project/CalendarRecipe-Capstone/backend/ai_speak/gantosa/Data/sst.json"

def convert_audio_to_text(audio_file_path):
    # GCS에서 오디오 파일 다운로드
    bucket_name = 'speech_to_text_save'
    blob_name = 'test.m4a'
    
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(blob_name)
    
    with open("temp.m4a", "wb") as file:
        blob.download_to_file(file)
    
    # 오디오를 WAV 형식으로 변환
    audio = AudioSegment.from_file("temp.m4a", format="m4a")
    audio.export("temp.wav", format="wav")
    
    # 음성 인식기 생성
    recognizer = sr.Recognizer()
    
    # WAV 파일 열기
    with sr.AudioFile("temp.wav") as source:
        audio_data = recognizer.record(source)
    
    try:
        # Google Cloud Speech-to-Text API를 사용하여 텍스트로 변환 (문장 단위)
        text = recognizer.recognize_google_cloud(audio_data, language="ko-KR")
        print("변환된 텍스트:")
        for sentence in text.split("\n"):
            print(sentence)
        
        # Google Speech Recognition을 사용하여 텍스트로 변환 (원문 그대로)
        raw_text = recognizer.recognize_google(audio_data, language="ko-KR")
        print("\n원문 그대로의 텍스트:", raw_text)
    except sr.UnknownValueError:
        print("음성을 인식할 수 없습니다.")
    except sr.RequestError as e:
        print("Google Cloud Speech-to-Text API 서비스에 접근할 수 없습니다. 오류:", e)

# 음성 파일을 텍스트로 변환하는 함수 호출
convert_audio_to_text("c.m4a")

