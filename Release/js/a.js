temp = location.href.split("?");
param = temp[1];
ShuffleData = "";
UserData = "";
OriginData = []
BackID = "";
CallUserReadCount();
callData();

function CallUserReadCount() {
  $.ajax({
    type: "get",
    url: "https://hciuxteam3-default-rtdb.firebaseio.com/Users/" + param + ".json",
    dataType: 'json',
    success: function (result) {
      //작업이 성공적으로 발생했을 경우
      $("#Read").text("현재까지 총 " + result["ReadCount"] + "개의 기사를 읽었습니다.");
      $("#UserType").text("현재 " + result["Type"] + "타입을 적용하고 있습니다.");
      UserData = result
      return;
    },
    error: function () {
      //에러가 났을 경우 실행시킬 코드
      alert("CallUserReadCounta 오류로 초기페이지로 돌아갑니다.")
      location.href = "Index.html";
    }
  })
}

function callData() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://hciuxteam3-default-rtdb.firebaseio.com/NewsData/' + param + '.json');
  xhr.setRequestHeader('Content-type', 'application/json');

  xhr.onreadystatechange = function (e) {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        TryData(JSON.parse(xhr.responseText));
      } else {
        console.log('callData 오류로 초기페이지로 돌아갑니다.');
        location.href = "Index.html";
      }
    }
  };

  xhr.send();
}

function TryData(data) {
  setelement(data)
}

function setelement(NewsData) {
  OriginData = NewsData["Data"].slice()
  NewsData["Data"] = shuffle(NewsData["Data"])
  ShuffleData = NewsData
  var html = '';
  for (i = 0; i < NewsData["Data"].length; i++) {

    if (NewsData["Data"][i]["Click"] == "1") {
      continue
    }

    html += '<article id="' + NewsData["Data"][i]["ID"] + '" class="col-lg-3 col-md-3 col-sm-3 col-xs-6 col-xxs-12 animate-box" onclick=newsclick(this)>';
    html += '<figure style="width:100%;height:100%;height:200px;object-fit:cover;overflow:hidden;box-shadow:3px 3px 5px black ;">';
    html += '<img src="' + NewsData["Data"][i]["image_url"] + ' style="height:200px;" class="img-responsive">';
    html += '</figure>';
    html += '<h2 class="jm-font" style="text-algin:center;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">' + NewsData["Data"][i]["title"] + '</a></h2>';
    html += '</article>';
  }
  $("#parent").append(html);
}

function shuffle(sourceArray) {
  for (var i = 0; i < sourceArray.length - 1; i++) {
    var j = i + Math.floor(Math.random() * (sourceArray.length - i));

    var temp = sourceArray[j];
    sourceArray[j] = sourceArray[i];
    sourceArray[i] = temp;
  }
  return sourceArray;
}

test = false

function newsclick(getdata) {

  if (test == false) {
    test = true
  }
  else {
    return
  }

  for (i = 0; i < ShuffleData["Data"].length; i++) {
    if (ShuffleData["Data"][i]["ID"] == getdata.id) {
      if (ShuffleData["Data"][i]["Click"] == 1) {
        GotoLink(ShuffleData["Data"][i]["news_url"])
        break;
      }
      else {
        Update(i)
      }
    }

  }
}

function Update(i) {
  Clickcategory = Number(UserData["UserHistory"][ShuffleData["Data"][i]["category"]])
  Clickcategory = Clickcategory + 0.1
  Clickcategory = Clickcategory.toFixed(1)
  Clickcategory = Number(Clickcategory)
  var senddata = {
    [ShuffleData["Data"][i]["category"]]: Clickcategory
  };

  senddata = JSON.stringify(senddata)

  $.ajax({
    type: "patch",
    url: "https://hciuxteam3-default-rtdb.firebaseio.com/Users/" + param + "/UserHistory.json",
    data: senddata,
    dataType: 'json',
    success: function (result) {
      //작업이 성공적으로 발생했을 경우
      UpdateOriginData(i)
    },
    error: function (result) {
      //에러가 났을 경우 실행시킬 코드
      alert("Update 실패로 초기페이지로 돌아갑니다.")
      location.href = "Index.html";
    }
  })
}

function UpdateOriginData(i) {
  var senddata = {
    Click: 1
  };

  Num = OriginData.findIndex(obj => obj.ID == ShuffleData["Data"][i]["ID"]);

  BackID = ShuffleData["Data"][i]["ID"]

  $.ajax({
    type: "patch",
    url: "https://hciuxteam3-default-rtdb.firebaseio.com/NewsData/" + param + '/Data/' + Num + ".json",
    data: JSON.stringify(senddata),
    dataType: 'json',
    success: function (result) {
      //작업이 성공적으로 발생했을 경우
      UpdateReadCount(i)
    },
    error: function () {
      RollBackUserHistory(i)
    }
  })
}

function UpdateReadCount(i) {

  resultparam = Number(UserData["ReadCount"])
  resultparam = resultparam + 1

  var senddata = {
    ReadCount: resultparam
  };

  $.ajax({
    type: "patch",
    url: "https://hciuxteam3-default-rtdb.firebaseio.com/Users/" + param + ".json",
    data: JSON.stringify(senddata),
    dataType: 'json',
    success: function (result) {
      //작업이 성공적으로 발생했을 경우
      GotoLink(ShuffleData["Data"][i]["news_url"])
    },
    error: function () {
      RollBackUserHistory(i)
    }
  })
}

function GotoLink(link) {
  window.open(link);
  window.location.reload()
}

function RollBackUserHistory(i) {
  Clickcategory = Number(UserData["UserHistory"][ShuffleData["Data"][i]["category"]])

  var senddata = {
    [ShuffleData["Data"][i]["category"]]: Clickcategory
  };

  senddata = JSON.stringify(senddata)

  $.ajax({
    type: "patch",
    url: "https://hciuxteam3-default-rtdb.firebaseio.com/Users/" + param + "/UserHistory.json",
    data: senddata,
    dataType: 'json',
    success: function () {
      if(BackID=!"")
      {
        RollBackClick(i)
      }
      else
      {
        alert("오류로 초기페이지로 돌아갑니다.")
        location.href = "Index.html";
      }
    },
    error: function (result) {
      //에러가 났을 경우 실행시킬 코드
      alert("백업실패. 관리자에게 문의 바랍니다.\nUserHistory 원본\n" + ShuffleData["Data"][i]["category"] + ":" + Clickcategory)
    }
  })
}

function RollBackClick(i){

  var senddata = {
    Click: 0
  };

  Num = OriginData.findIndex(obj => obj.ID == ShuffleData["Data"][i]["ID"]);

  $.ajax({
    type: "patch",
    url: "https://hciuxteam3-default-rtdb.firebaseio.com/NewsData/" + param + '/Data/' + Num + ".json",
    data: JSON.stringify(senddata),
    dataType: 'json',
    success: function () {
      alert("클릭 갱신중 오류로 초기페이지로 돌아갑니다.")
      location.href = "Index.html";
    },
    error: function () {
      alert("백업실패. 관리자에게 문의 바랍니다.\nClick ID 원본:" + BackID)
    }
  })
}