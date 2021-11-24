import requests
import prototypeA_2

response = requests.get("https://hciuxteam3-default-rtdb.firebaseio.com/Users.json")
json_data = response.json()
idlist = json_data.keys()
idlist = list(idlist)
for i in range(len(idlist)):
    prototypeA_2.CallTypea2(json_data[idlist[i]],idlist[i])