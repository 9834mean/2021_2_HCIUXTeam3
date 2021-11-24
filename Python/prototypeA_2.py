################################ import #################################
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import random
import os
import time
import re
import re
from pandas.io import json
import requests
import datetime
from datetime import datetime
from bs4 import BeautifulSoup
import bs4.element
from tqdm.notebook import tqdm
from konlpy.tag import Komoran

from sklearn.manifold import TSNE
from gensim.test.utils import common_texts
from gensim.models.doc2vec import Doc2Vec, TaggedDocument
from gensim.models.word2vec import Word2Vec
from sklearn.metrics.pairwise import cosine_similarity
from konlpy.tag import Okt
import warnings
warnings.filterwarnings(action='ignore', category=UserWarning, module='gensim')



################################ def #################################
def get_preprocessing_data(data) : 
    data['title_contents'] = data['title'] + " " + data['contents']
    data.drop(['date','contents'], axis = 1, inplace = True)
    # 결측치 처리 
    data = data.fillna(" ")
    
    return data 

def make_doc2vec_data(data, column, t_document=False):
    data_doc = []
    for tag, doc in zip(data.index, data[column]):
        doc = doc.split(" ")
        data_doc.append(([tag], doc))
    if t_document:
        data = [TaggedDocument(words=text, tags=tag) for tag, text in data_doc]
        return data
    else:
        return data_doc
    
def make_doc2vec_models(tagged_data, tok, vector_size=128, window = 3, epochs = 40, min_count = 0, workers = 4):
    model = Doc2Vec(tagged_data, vector_size=vector_size, window=window, epochs=epochs, min_count=min_count, workers=workers)
    model.save(f'./{tok}_news_model.doc2vec')

'''    
def make_word2vec_models() :
    model = Word2Vec(tokenized_data,  # 리스트 형태의 데이터
                 sg=1,                # 0: CBOW, 1: Skip-gram
                 vector_size=100,     # 벡터 크기
                 window=3,     # 고려할 앞뒤 폭(앞뒤 3단어)
                 min_count=3,  # 사용할 단어의 최소 빈도(3회 이하 단어 무시)
                 workers=4)    # 동시에 처리할 작업 수(코어 수와 비슷하게 설정)
'''   
    
def make_user_embedding(index_list, data_doc, model):
    model.dv = model.__dict__['docvecs']
    user = []
    user_embedding = []
    for i in index_list: 
        user.append(data_doc[i][0][0])
    for i in user:
        user_embedding.append(model.dv[i])
    user_embedding = np.array(user_embedding)
    user = np.mean(user_embedding, axis = 0)
    return user

def get_recommened_contents(user, data_doc, model):
    scores = []

    for tags, text in data_doc:
        trained_doc_vec = model.docvecs[tags[0]]
        scores.append(cosine_similarity(user.reshape(-1, 128), trained_doc_vec.reshape(-1, 128)))

    scores = np.array(scores).reshape(-1)
    scores = np.argsort(-scores)[:100]
    
    return input_data.iloc[scores, :]

def view_user_history(data):
    return data[['title_contents', 'category']]

def get_soup_obj(url):
    headers = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" }
    res = requests.get(url, headers = headers)
    soup = BeautifulSoup(res.text,'lxml')
    
    return soup

def get_news_contents(url):
    soup = get_soup_obj(url)
    body = soup.find('div', class_="_article_body_contents")

    news_contents = ''
    for content in body:
        if type(content) is bs4.element.NavigableString and len(content) > 50:
            news_contents += content.strip() + ' '

    return news_contents

j = 0

def get_news_info(url, s) : 
    global j
    default_img = "https://search.naver.com/search.naver?where=image&sm=tab_jum&query=naver#"
    current_page = 1     
    news_info_list = []
    flag = 0

    for i in range (10) : 
        sec_url = url + s + "&date=" + today + "&page=" + str(current_page)
        soup = get_soup_obj(sec_url)
        lis = soup.find('ul', class_='type06_headline').find_all("li", limit=15)

        for li in lis : 
            try :
                imsigisa = li.a.attrs.get("href")
                if imsigisa!="":
                    soup2 = get_soup_obj(imsigisa)
                    lis2 = soup2.find("span", class_="end_photo_org").find_all("img", limit=15)
                    imsiurl = ""
                    for li2 in lis2 :
                        imsiurl = li2.attrs.get("src")
                else:
                    imsiurl = li.img.attrs.get("src") if li.img else default_img
            except Exception as e:
                imsiurl = li.img.attrs.get("src") if li.img else default_img

            if imsiurl=="" or imsiurl==default_img :
                continue

            imsititle = li.img.attrs.get("alt") if li.img else li.a.text.replace("\n", "")
            imsititle = imsititle.replace("\t","")
            imsititle = imsititle.replace("\r","")
            imsititle = imsititle.replace("\\","")
            imsititle = imsititle.replace('"',"'")
            imsititle = imsititle.replace("[","-")
            imsititle = imsititle.replace("]","-")
            imsititle = imsititle.replace("“","'")
            imsititle = imsititle.replace("”","'")
            imsititle = imsititle.replace("`","'")
            imsititle = imsititle.replace('"','')
            imsititle = imsititle.replace('\\','')
            imsititle = re.sub('[=+,#/\?:^$.@*\"※~&%ㆍ!』\\‘|\(\)\[\]\<\>`\'…》]', '', imsititle)
            imsidata = li.find(class_="date").text.replace("\t","")
            imsinewsurl = li.a.attrs.get("href")

            news_info = {
            "ID" : "T" + str(s) + "N" + str(j),
            "title" :  imsititle, 
            "date" : imsidata,
            "news_url" : imsinewsurl,
            "image_url" :  imsiurl,
            "category" : s,
            "Click" : 0}

            try :
                news_contents = get_news_contents(news_info["news_url"])
                news_info["contents"] = news_contents

                for i in range(len(news_info_list)):
                    if(imsinewsurl==news_info_list[i]["news_url"]):
                        flag = 1
                        break
                
                if(flag==1):
                    flag=0
                    continue

                news_info_list.append(news_info)
                j = j+1
               
            except Exception as e : 
                continue
        
        current_page += 1 
    
    print(s + " 분야 크롤링 완료")    
    return news_info_list

def CallTypea2():
    ################################ Crawling #################################
    global today
    global j
    date = str(datetime.now())
    date = date[:date.rfind(':')].replace(' ', '_')
    date = date.replace(':','시') + '분'
    today = str(datetime.now().strftime('%Y%m%d'))
    print(today)

    sid = ['100', '101', '102', '103', '104', '105']
    default_url = "https://news.naver.com/main/list.nhn?mode=LSD&mid=sec&sid1="
    df = pd.DataFrame()

    for s in sid : 
        news = get_news_info(default_url, s)
        df = df.append(news)
        j = 0


################################ Modeling #################################
    global input_data
    input_data = get_preprocessing_data(df)

    data_doc_contents = make_doc2vec_data(input_data, 'title_contents')
    data_doc_contents_tag = make_doc2vec_data(input_data, 'title_contents', t_document=True)

    make_doc2vec_models(data_doc_contents_tag, tok=False)

    model_contents = Doc2Vec.load('False_news_model.doc2vec')

    print(input_data['category'].value_counts())    

################################ Recommand #################################

    response4 = requests.get("https://hciuxteam3-default-rtdb.firebaseio.com/Users.json")
    json_data2 = response4.json()
    idlist = json_data2.keys()
    idlist = list(idlist)

    for i in range(len(idlist)):

        if json_data2[idlist[i]]["Type"] == "B":
            continue

        response = requests.get("https://hciuxteam3-default-rtdb.firebaseio.com/Users/" + idlist[i] + "/UserHistory.json")
        json_data = response.json()

        user_category = pd.DataFrame.from_dict(json_data, orient='index')
        user_category = user_category.transpose()
        print(user_category)

        key_list = user_category.columns
        value_list = user_category.iloc[:1,:]
        user_history = pd.DataFrame()
        temp_df = pd.DataFrame()

        for li in key_list : 
            num = user_category[li].iloc[0]
            temp_df = input_data.loc[input_data['category']==li].sample(n=10*num,  random_state=1004)
            user_history = user_history.append(temp_df, ignore_index=True)

        user = make_user_embedding(user_history.index.values.tolist(), data_doc_contents, model_contents)
        result = get_recommened_contents(user, data_doc_contents, model_contents)

        result.drop(['title_contents'], axis = 1, inplace = True)

        imsilist = result.to_json(orient = 'records',force_ascii=False)
        imsilist = imsilist.replace("\\","")

        senddata = {
            idlist[i]: {
                "Data" : imsilist,
                "Update" : str(datetime.today().year) + "-" + str(datetime.today().month) + "-" + str(datetime.today().day)
            }
        }

        jobject = json.dumps(senddata,ensure_ascii=False)
        jobject = jobject.replace('"[',"[")
        jobject = jobject.replace(']"',"]")
        jobject = jobject.replace("\\","")
        jobject = jobject.encode('utf8')

        try:
            r2 = requests.patch("https://hciuxteam3-default-rtdb.firebaseio.com/NewsData.json", data =jobject)
            if r2.status_code!=200:
                print(r2.status_code)
        except:
            time.sleep(2)
            r2 = requests.patch("https://hciuxteam3-default-rtdb.firebaseio.com/NewsData.json", data =jobject)
            if r2.status_code!=200:
                print(r2.status_code)

CallTypea2()