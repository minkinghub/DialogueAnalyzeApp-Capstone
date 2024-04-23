import os
import json
import csv
import pandas as pd

from glob import glob
from tqdm import tqdm
from utils import remove_words_with_pattern, clean

with open('data.json', 'r', encoding='utf8') as json_file:
    json_data = json.load(json_file)

docs = json_data["document"]

original = []
corrected = []
for doc in tqdm(docs):
    for sess in doc["utterance"]:
        original.append(sess["original_form"])
        corrected.append(sess["corrected_form"])

data = pd.DataFrame({"original": original, "corrected": corrected})

# 특수문자 제거 (쉼표) .(마침표) 제거
data["original"] = data["original"].map(lambda x: x.replace(".", ""))
data["corrected"] = data["corrected"].map(lambda x: x.replace(".", ""))
data["original"] = data["original"].map(lambda x: x.replace(",", ""))
data["corrected"] = data["corrected"].map(lambda x: x.replace(",", ""))

# name tag 제거
data["original"] = data["original"].map(
    lambda x: remove_words_with_pattern(x, r"\S*&name\d+&\S*")
)
data["corrected"] = data["corrected"].map(
    lambda x: remove_words_with_pattern(x, r"\S*name\d+\S*")
)

# null 값 제거
data["null_check"] = data["corrected"].map(lambda x: 1 if x == "" else 0)
data = data[data["null_check"] == 0]

# 짧은 문장 제거
data["cleaned"] = data["original"].map(clean)
data["length"] = data["cleaned"].map(len)
data = data[data["length"] >= 2]

# export
data = data[["original", "corrected"]]
data = data.reset_index(drop=True)
data.to_csv("./data/typos_datasets.csv", escapechar='\\', quoting=csv.QUOTE_NONE)
