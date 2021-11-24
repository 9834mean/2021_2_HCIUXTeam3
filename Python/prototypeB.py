########################################### import #######################################
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import random
import os

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



########################################### import ########################################
def get_preprocessing_data(data) : 
    data['title_contents'] = data['title'] + " " + data['contents']
    data.drop(['date','image_url','title', 'contents'], axis = 1, inplace = True)
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
    scores = np.argsort(-scores)[:50]
    
    return input_data.iloc[scores, :]

def view_user_history(data):
    return data[['title_contents', 'category']]



########################################### model and EDA ########################################
input_data = get_preprocessing_data(df)

data_doc_contents = make_doc2vec_data(input_data, 'title_contents')
data_doc_contents_tag = make_doc2vec_data(input_data, 'title_contents', t_document=True)

make_doc2vec_models(data_doc_contents_tag, tok=False)

model_contents = Doc2Vec.load('./False_news_model.doc2vec')

print(input_data['category'].value_counts())



########################################### Recommand ########################################
id = "9834min"
response = requests.get("https://hciuxteam3-default-rtdb.firebaseio.com/Users/" + id + "/UserHistory.json")
json_data = response.json()

user_category = pd.DataFrame.from_dict(json_data, orient='index')
user_category = user_category.transpose()
#print(user_category)

key_list = user_category.columns
value_list = user_category.iloc[:1,:]
user_history = pd.DataFrame()
temp_df = pd.DataFrame()

for li in key_list : 
    num = user_category[li].iloc[0]
    temp_df = input_data.loc[input_data['category']==li].sample(n=10*num,  random_state=1004)
    user_history = user_history.append(temp_df, ignore_index=True)

user = make_user_embedding(user_history.index.values.tolist(), data_doc_contents, model_contents)
result1 = get_recommened_contents(user, data_doc_contents, model_contents)
#pd.DataFrame(result1.loc[:, ['category', 'title_contents']])
#result1['category'].value_counts()

result2 = pd.DataFrame()
category = ['100','101','102','103','104','105']

for i in range (0,50,6) : 
    for ca in category : 
        temp_df = input_data.loc[input_data['category']==ca].sample(n=1,  random_state=32)
        result2 = result2.append(temp_df, ignore_index=True)

#result2
result = pd.concat([result1, result2]) ## finish!