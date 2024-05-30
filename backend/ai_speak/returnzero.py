import json
import requests
import time
import threading

def transcribe_audio(auth_token, audio_file, use_disfluency_filter, results, index):
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
    print(f"작업 ID {index}: {task_id}")

    while True:
        resp = requests.get(
            f'https://openapi.vito.ai/v1/transcribe/{task_id}',
            headers={'Authorization': f'bearer {auth_token}'}
        )
        resp.raise_for_status()
        status = resp.json()['status']
        if status == 'completed':
            results[index] = resp.json()['results']
            break
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

    # 트랜스크립션 결과를 저장할 리스트
    results = [None, None]

    # 두 개의 트랜스크립션 작업을 병렬로 시작
    threads = [
        threading.Thread(target=transcribe_audio, args=(auth_token, audio_file, False, results, 0)),
        threading.Thread(target=transcribe_audio, args=(auth_token, audio_file, True, results, 1))
    ]

    for thread in threads:
        thread.start()

    for thread in threads:
        thread.join()

    return {
        "results_without_filter": results[0],
        "results_with_filter": results[1]
    }

def save_transcription_results(transcription_results):
    # 불필요한 필드를 제거한 결과 생성
    def simplify_results(results):
        return {
            "utterances": [
                {
                    "spk": utterance["spk"],
                    "msg": utterance["msg"]
                }
                for utterance in results["utterances"]
            ]
        }

    simplified_results = {
        "results_without_filter": simplify_results(transcription_results["results_without_filter"]),
        "results_with_filter": simplify_results(transcription_results["results_with_filter"])
    }

    # JSON 파일로 저장 (UTF-8 인코딩 명시)
    with open("transcription_results.json", "w", encoding='utf-8') as f:
        json.dump(simplified_results, f, indent=4, ensure_ascii=False)

# 사용자가 선택한 음성 파일 경로
audio_file = 'b.wav'

# 트랜스크립션 결과 받기
transcription_results = get_transcription_results(audio_file)

# 트랜스크립션 결과 저장하기
save_transcription_results(transcription_results)
