import pandas as pd

# CSV 파일 읽기
df = pd.read_csv('recipe_2.15_(new4).csv')

# RCP_PART_DTLS 열의 모든 "\n"을 ","로 치환
df['RCP_PARTS_DTLS'] = df['RCP_PARTS_DTLS'].str.replace(',,', ',')

# 처리된 데이터를 새로운 CSV 파일로 저장
df.to_csv('recipe_2.15_(new5).csv', index=False)