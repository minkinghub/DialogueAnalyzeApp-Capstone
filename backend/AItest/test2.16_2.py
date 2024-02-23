import pandas as pd

# CSV 파일을 읽어옵니다. 파일 경로는 실제 파일 경로로 변경해야 합니다.
file_path = 'recipe_2.15(new).csv'
df = pd.read_csv(file_path)

# RCP_PARTS_DTLS 열에서 모든 "("와 ")"를 제거합니다.
df['RCP_PARTS_DTLS'] = df['RCP_PARTS_DTLS'].str.replace('(', ' ').str.replace(')', '')

# 수정된 DataFrame을 새로운 CSV 파일로 저장합니다.
output_file_path_modified = 'recipe_2.15_(newnew).csv'
df.to_csv(output_file_path_modified, index=False)