import requests
import NormalA

response = requests.get("https://hciuxteam3-default-rtdb.firebaseio.com/Users.json")
json_data = response.json()
idlist = json_data.keys()
idlist = list(idlist)
for i in range(len(idlist)):
    NormalA.Main_Function(json_data[idlist[i]],idlist[i])