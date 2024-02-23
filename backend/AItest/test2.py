import csv

def process_csv(input_filename, output_filename):
    with open(input_filename, 'r', newline='', encoding='utf-8') as input_file, \
            open(output_filename, 'w', newline='', encoding='utf-8') as output_file:
        reader = csv.reader(input_file)
        writer = csv.writer(output_file)

        data = list(reader)

        # 비어 있는 열을 찾아서 제거
        non_empty_columns = [col_idx for col_idx in range(len(data[0])) if any(row[col_idx].strip() for row in data)]
        cleaned_data = [[row[col_idx] for col_idx in non_empty_columns] for row in data if any(cell.strip() for cell in row)]

        # 최종 결과를 쓰기
        for row in cleaned_data:
            writer.writerow(row)

if __name__ == "__main__":
    input_filename = "Deleted_Data3.csv"  # 원본 CSV 파일 이름
    output_filename = "No_Space_Deleted_Data3.csv"  # 결과 CSV 파일 이름

    process_csv(input_filename, output_filename)