import requests
import pandas as pd
import json

def request_food_data():
    
    # API 요청 URL 구성
    api_url = 'http://openapi.foodsafetykorea.go.kr/api/fe08271a51d04822823c/COOKRCP01/json/1001/2000'
    
    # API 요청
    response = requests.get(api_url)

    try:
        # JSON 데이터로 변환
        json_data = json.loads(response.text)

        # JSON 데이터에서 필요한 부분 추출
        recipes_data = json_data.get('COOKRCP01', {}).get('row', [])

        # JSON 데이터를 DataFrame으로 변환
        df = pd.json_normalize(recipes_data)

        # 필요한 열만 선택
        selected_columns = ['RCP_SEQ', 'RCP_NM', 'RCP_WAY2', 'RCP_PAT2', 'INFO_WGT', 'INFO_ENG', 'INFO_CAR', 'INFO_PRO', 'INFO_FAT', 'INFO_NA', 'HASH_TAG', 'ATT_FILE_NO_MAIN', 'ATT_FILE_NO_MK', 'RCP_PARTS_DTLS', 'MANUAL01', 'MANUAL_IMG01', 'MANUAL02', 'MANUAL_IMG02', 'MANUAL03', 'MANUAL_IMG03', 'MANUAL04', 'MANUAL_IMG04', 'MANUAL05', 'MANUAL_IMG05', 'MANUAL06', 'MANUAL_IMG06', 'MANUAL07', 'MANUAL_IMG07', 'MANUAL08', 'MANUAL_IMG08', 'MANUAL09', 'MANUAL_IMG09', 'MANUAL10', 'MANUAL_IMG10', 'MANUAL11', 'MANUAL_IMG11', 'MANUAL12', 'MANUAL_IMG12', 'MANUAL13', 'MANUAL_IMG13', 'MANUAL14', 'MANUAL_IMG14', 'MANUAL15', 'MANUAL_IMG15', 'MANUAL16', 'MANUAL_IMG16', 'MANUAL17', 'MANUAL_IMG17', 'MANUAL18', 'MANUAL_IMG18', 'MANUAL19', 'MANUAL_IMG19', 'MANUAL20', 'MANUAL_IMG20']
        df = df[selected_columns]

        # DataFrame을 CSV 파일로 저장
        df.to_csv('recipes2.csv', index=False)

        print("CSV 파일로 저장되었습니다.")
    except json.JSONDecodeError as e:
        print(f"JSON 디코딩 오류: {e}")


# API 요청 및 데이터 저장
request_food_data()