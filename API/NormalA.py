import numpy as np
import random
import datetime
from datetime import datetime
from bs4 import BeautifulSoup
import bs4.element
from tqdm.notebook import tqdm
import warnings
import requests
import json
warnings.filterwarnings(action="ignore", category=UserWarning, module="gensim")
    
def make_user_embedding(index_list, data_doc, model):
    user = []
    user_embedding = []
    for i in index_list:
        user.append(data_doc[i][0][0])
    for i in user:
        user_embedding.append(model.dv[i])
    user_embedding = np.array(user_embedding)
    user = np.mean(user_embedding, axis = 0)
    return user


def get_soup_obj(url):
    headers = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" }
    res = requests.get(url, headers = headers)
    soup = BeautifulSoup(res.text,"lxml")
    
    return soup

def get_news_contents(url):
    soup = get_soup_obj(url)
    body = soup.find("div", class_="_article_body_contents")

    news_contents = ""
    for content in body:
        if type(content) is bs4.element.NavigableString and len(content) > 50:
            news_contents += content.strip() + " "

    return news_contents

j = 0

def get_news_info(url, s) : 
    global j
    default_img = "https://search.naver.com/search.naver?where=image&sm=tab_jum&query=naver#"
    current_page = 1     
    news_info_list = []
    today = str(datetime.now().strftime("%Y%m%d"))

    for i in range (10) : 
        sec_url = url + s + "&date=" + today + "&page=" + str(current_page)
        soup = get_soup_obj(sec_url)
        lis = soup.find("ul", class_="type06_headline").find_all("li", limit=15)

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

            imsititle = li.img.attrs.get("alt") if li.img else li.a.text.replace("\n", "").replace("\t","").replace("\r","").replace("\\","")
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
                news_info_list.append(news_info)
                j = j+1
            except Exception as e : 
                continue
            
        current_page += 1 

    return news_info_list

def Main_Function(param, param2):
    global j
    sid = []
    imsilist = []
    splitinterest = str(param["Interest"]).split(",")

    for i in range(len(splitinterest)):
        sid.append(splitinterest[i])

    default_url = "https://news.naver.com/main/list.nhn?mode=LSD&mid=sec&sid1="

    for s in tqdm(sid) : 
        news = get_news_info(default_url, s)
        imsilist.append(news)
        j = 0

  

    senddata = {
        param2["ID"] : {
            "Data" : imsilist,
            "Update" : str(datetime.today().year) + "-" + str(datetime.today().month) + "-" + str(datetime.today().day)
        }
    }

    jobject = json.dumps(senddata)
    jobject = jobject.replace("[[","[")
    jobject = jobject.replace("]]","]")
    rtnvlue = False


    r2 = requests.patch("https://hciuxteam3-default-rtdb.firebaseio.com/NewsData.json", data =jobject)
    if r2.status_code==200:
        rtnvlue = True

    return rtnvlue
