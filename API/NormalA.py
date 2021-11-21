import numpy as np
from datetime import datetime
from bs4 import BeautifulSoup
import bs4.element
from tqdm.notebook import tqdm
import warnings
import requests
import json
import time
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

def get_news_info(url, s,eachcount) : 
    global j
    default_img = "https://search.naver.com/search.naver?where=image&sm=tab_jum&query=naver#"
    current_page = 1     
    news_info_list = []
    today = str(datetime.now().strftime("%Y%m%d"))
    flag = 0

    for i in range (eachcount) : 
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

            if imsiurl=="" or imsiurl==default_img :
                continue

            imsititle = li.img.attrs.get("alt") if li.img else li.a.text.replace("\n", "").replace("\t","").replace("\r","").replace("\\","").replace("\"","")
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

                if(len(news_info_list)>99):                
                    break
                

            except Exception as e : 
                eachcount = eachcount +1
                continue
            
        current_page += 1 

    return news_info_list

def Main_Function(param,IDParam):
    global j
    sid = []
    imsilist = []
    splitinterest = str(param["Interest"]).split(",")

    for i in range(len(splitinterest)):
        sid.append(splitinterest[i])

    default_url = "https://news.naver.com/main/list.nhn?mode=LSD&mid=sec&sid1="

    categorylen = len(splitinterest)
    eachcount = 0

    if categorylen==1:
        eachcount = 10
    elif categorylen==2:
        eachcount = 5       
    elif categorylen==3:
        eachcount = 4   
    elif categorylen==4:
        eachcount = 3  
    elif categorylen==5:
        eachcount = 2  
    elif categorylen==6:
        eachcount = 2  

    for s in tqdm(sid) :     
        news = get_news_info(default_url, s,eachcount)
        imsilist.append(news)
        j = 0

    senddata = {
        IDParam: {
            "Data" : imsilist,
            "Update" : str(datetime.today().year) + "-" + str(datetime.today().month) + "-" + str(datetime.today().day)
        }
    }

    jobject = json.dumps(senddata)
    jobject = jobject.replace("[[","[")
    jobject = jobject.replace("]]","]")

    if categorylen>1:
        jobject = jobject.replace("], [",",")

    rtnvlue = False
    
    try:
        r2 = requests.patch("https://hciuxteam3-default-rtdb.firebaseio.com/NewsData.json", data =jobject)
        if r2.status_code==200:
            rtnvlue = True
    except:
        time.sleep(2)
        r2 = requests.patch("https://hciuxteam3-default-rtdb.firebaseio.com/NewsData.json", data =jobject)
        if r2.status_code==200:
            rtnvlue = True

    return rtnvlue
