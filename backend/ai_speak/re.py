import json
import requests
import time

def transcribe_audio(auth_token, audio_file, use_disfluency_filter=False):
    config = {
        "use_multi_channel": False,
        "use_itn": False,
        "use_disfluency_filter": use_disfluency_filter,
        "use_profanity_filter": False,
        "use_paragraph_splitter": True,
        "paragraph_splitter": {
            "max": 50
        }
    }

    resp = requests.post(
        'https://openapi.vito.ai/v1/transcribe',
        headers={'Authorization': f'bearer {auth_token}'},
        data={'config': json.dumps(config)},
        files={'file': open(audio_file, 'rb')}
    )
    resp.raise_for_status()
    task_id = resp.json()['id']
    print(f"작업 ID: {task_id}")

    while True:
        resp = requests.get(
            f'https://openapi.vito.ai/v1/transcribe/{task_id}',
            headers={'Authorization': f'bearer {auth_token}'}
        )
        resp.raise_for_status()
        status = resp.json()['status']
        if status == 'completed':
            return resp.json()['results']
        time.sleep(5)

def get_transcription_results(audio_file):
    # 인증 토큰 받기
    resp = requests.post(
        'https://openapi.vito.ai/v1/authenticate',
        data={'client_id': 'pY5fW2sMvQ9qwj5jCHSK',
              'client_secret': '0N05lmQf_kA9oSteVr4X8G6qcv3QaNju7V8x6-zk'}
    )
    resp.raise_for_status()
    auth_token = resp.json()['access_token']

    # 음성 파일 전송 및 트랜스크립션 결과 받기
    results_without_filter = transcribe_audio(auth_token, audio_file, use_disfluency_filter=False)
    results_with_filter = transcribe_audio(auth_token, audio_file, use_disfluency_filter=True)

    return {
        "results_without_filter": results_without_filter,
        "results_with_filter": results_with_filter
    }

# 사용자가 선택한 음성 파일 경로
audio_file = 'b.wav'

# 트랜스크립션 결과 받기
transcription_results = get_transcription_results(audio_file)

def save_transcription_results(transcription_results):
    with open("transcription_results.json", "w") as f:
        json.dump(transcription_results, f, indent=4, ensure_ascii=False)
