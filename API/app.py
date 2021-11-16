import os
import json
from flask import Flask, request
import requests
import NormalA

app = Flask(__name__)

# @app.route("/RecommandA", methods = ["POST"])
# def Call_News(): 
#     Json_Param = request.get_json()    

#     json_data = r.json()

#     data = {
#         Json_Param["ID"] : json_data["items"]
#     }

#     jobject = json.dumps(data)

#     rtnvlue = False

#     if r.status_code==200:
#         r2 = requests.patch("https://hciuxteam3-default-rtdb.firebaseio.com/NewsData.json", data =jobject)
#         if r2.status_code==200:
#             rtnvlue = True
    
#     rtn_data = {
#         "success" : rtnvlue
#     }

    # return json.dumps(rtn_data)


@app.route("/NormalA", methods = ["POST"])
def Call_News(): 
    Json_Param = request.get_json()    

    response = requests.get("https://hciuxteam3-default-rtdb.firebaseio.com/Users/" + Json_Param["ID"] + ".json")
    json_data = response.json()

    rtnvlue = NormalA.Main_Function(json_data,Json_Param["ID"])

    rtn_data = {
        "success" : rtnvlue
    }

    return json.dumps(rtn_data)



if __name__ == "__main__":
    app.run(debug=True,host="0.0.0.0",port=int(os.environ.get("PORT", 8080)))
