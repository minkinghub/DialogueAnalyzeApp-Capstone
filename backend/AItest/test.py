# import csv

# def process_csv(input_filename, output_filename, deleted_filename):
#     with open(input_filename, 'r', newline='', encoding='utf-8') as input_file, \
#             open(output_filename, 'w', newline='', encoding='utf-8') as output_file, \
#             open(deleted_filename, 'w', newline='', encoding='utf-8') as deleted_file:
#         reader = csv.reader(input_file)
#         writer = csv.writer(output_file)
#         deleted_writer = csv.writer(deleted_file)

#         for row in reader:
#             processed_row, deleted_data = remove_between_colon_and_dot(row)
#             writer.writerow(processed_row)
#             deleted_writer.writerow(deleted_data)

# def remove_between_colon_and_dot(row):
#     processed_row = []
#     deleted_data = []

#     for cell in row:
#         start_idx = cell.find('●')
#         end_idx = cell.find(':')

#         if start_idx != -1 and end_idx != -1 and start_idx < end_idx:
#             deleted_part = cell[start_idx:end_idx + 1]
#             deleted_data.append(deleted_part)
#             cell = cell.replace(deleted_part, '')
#         else:
#             deleted_data.append('')

#         processed_row.append(cell)

#     return processed_row, deleted_data

# if __name__ == "__main__":
#     input_filename = "Deleted_Recipe2.csv"  # 원본 CSV 파일 이름
#     output_filename = "Deleted_Recipe3.csv"  # 결과 CSV 파일 이름
#     deleted_filename = "Deleted_Data3.csv"  # 삭제된 부분을 저장할 외부 파일 이름

#     process_csv(input_filename, output_filename, deleted_filename)

import csv

def process_csv(input_filename, output_filename):
    with open(input_filename, 'r', newline='', encoding='utf-8') as input_file, \
            open(output_filename, 'w', newline='', encoding='utf-8') as output_file:
        reader = csv.reader(input_file)
        writer = csv.writer(output_file)

        for row in reader:
            processed_row = [cell.replace('\n', '') for cell in row]
            writer.writerow(processed_row)

if __name__ == "__main__":
    input_filename = "recipe_2.15.csv"  # 원본 CSV 파일 이름
    output_filename = "cleaned_output_file.csv"  # 결과 CSV 파일 이름

    process_csv(input_filename, output_filename)
