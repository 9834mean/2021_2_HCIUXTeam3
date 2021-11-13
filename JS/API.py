import os
import json
from flask import Flask, request
import requests

app = Flask(__name__)

@app.route('/NewsAPI', methods = ['POST'])
def Call_News(): 
    Json_Param = request.get_json()
    
    client_id = "cByyPKiwDvI4YNRsAA4g"
    client_secret = "9v0xRpUYvj"  

    search_word = Json_Param["Type"]
    encode_type = 'json' 
    max_display = int(Json_Param["Count"])
    sort = 'sim'  
    start = 1

    url = f"https://openapi.naver.com/v1/search/news.{encode_type}?query={search_word}&display={str(int(max_display))}&start={str(int(start))}&sort={sort}"

    headers = {'X-Naver-Client-Id': client_id,
            'X-Naver-Client-Secret': client_secret
            }
        
    r = requests.get(url, headers=headers)

    json_data = r.json()

    data = {
        Json_Param["ID"] : json_data["items"]
    }

    jobject = json.dumps(data)

    rtnvlue = False

    if r.status_code==200:
        r2 = requests.patch('https://hciuxteam3-default-rtdb.firebaseio.com/NewsData.json', data =jobject)
        if r2.status_code==200:
            rtnvlue = True
    
    rtn_data = {
        "success" : rtnvlue
    }

    return json.dumps(rtn_data)

if __name__ == "__main__":
    app.run(debug=True,host='0.0.0.0',port=int(os.environ.get('PORT', 8080)))

