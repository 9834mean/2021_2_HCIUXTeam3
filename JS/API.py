import requests
import re
import pandas as pd
import json

client_id = "cByyPKiwDvI4YNRsAA4g"  # 1.에서 취득한 아이디 넣기
client_secret = "9v0xRpUYvj"  # 1. 에서 취득한 키 넣기

search_word = '경제'  # 검색어
encode_type = 'json'  # 출력 방식 json 또는 xml
max_display = 100  # 출력 뉴스 수
sort = 'date'  # 결과값의 정렬기준 시간순 date, 관련도 순 sim
start = 1  # 출력 위치

url = f"https://openapi.naver.com/v1/search/news.{encode_type}?query={search_word}&display={str(int(max_display))}&start={str(int(start))}&sort={sort}"

#헤더에 아이디와 키 정보 넣기
headers = {'X-Naver-Client-Id': client_id,
           'X-Naver-Client-Secret': client_secret
           }

#HTTP요청 보내기
r = requests.get(url, headers=headers)
#요청 결과 보기 200 이면 정상적으로 요청 완료
print(r)

print(r.json())

#r.json()

# df = pd.DataFrame(r.json()['items'])

# def clean_html(x):
#   x = re.sub("\&\w*\;","",x)
#   x = re.sub("<.*?>","",x)
#   return x

# df['title'] = df['title'].apply(lambda x: clean_html(x))
# df['description'] = df['description'].apply(lambda x: clean_html(x))

# df.to_csv(f'news_search_result_{search_word}.csv')