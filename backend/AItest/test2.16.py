import pandas as pd

# CSV 파일을 읽어옵니다. 파일 경로는 실제 파일 경로로 변경해야 합니다.
file_path = 'recipe.csv'
df = pd.read_csv(file_path)

# 정규식 패턴에 맞는 부분을 찾습니다.
pattern = r'\((?![^)]*g)([^)]*)\)'
matches = df['RCP_PARTS_DTLS'].str.extract(pattern)

# 자른 부분을 외부 파일로 저장합니다.
output_file_path_extracted = 'extracted_part_2.15.csv'
matches.to_csv(output_file_path_extracted, header=False)

# 원본 DataFrame에서 해당 부분을 제거합니다.
df['RCP_PARTS_DTLS'] = df['RCP_PARTS_DTLS'].replace(pattern, '', regex=True)

# 수정된 DataFrame을 새로운 CSV 파일로 저장합니다.
output_file_path_modified = 'recipe_2.15(new).csv'
df.to_csv(output_file_path_modified, index=False)