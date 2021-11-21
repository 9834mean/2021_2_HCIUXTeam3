temp = location.href.split("?");
param = temp[1];
ShuffleData = "";
callData();

function callData() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://hciuxteam3-default-rtdb.firebaseio.com/NewsData/' + param + '.json');
  xhr.setRequestHeader('Content-type', 'application/json');

  xhr.onreadystatechange = function (e) {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        TryData(JSON.parse(xhr.responseText));
      } else {
        console.log('Error!');
      }
    }
  };

  xhr.send();
}

function TryData(data) {
  setelement(data)
}

function setelement(NewsData) {
  NewsData["Data"] = shuffle(NewsData["Data"])
  ShuffleData = NewsData
  var html = '';
  for (i = 0; i < NewsData["Data"].length; i++) {
    html += '<article id="' + NewsData["Data"][i]["ID"] + '" class="col-lg-3 col-md-3 col-sm-3 col-xs-6 col-xxs-12 animate-box" onclick=newsclick(this)>';
    html += '<figure style="width:100%;height:100%;max-height:200px;min-height:200px;object-fit:cover;overflow:hidden;">';
    html += '<img src="' + NewsData["Data"][i]["image_url"] + ' alt="Image" class="img-responsive">';
    html += '</figure>';
    html += '<h2 class="jm-font">' + NewsData["Data"][i]["title"] + '</a></h2>';
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

function newsclick(getdata) {
  for (i = 0; i < ShuffleData["Data"].length; i++) {
    if (ShuffleData["Data"][i]["ID"] == getdata.id) {
      if (ShuffleData["Data"][i]["Click"] == 1) {
        GotoLink(ShuffleData["Data"][i]["news_url"])
        break;
      }
      else {
        UpdateClick(i)
      }
    }

  }
}

function UpdateClick(i) {
  $.ajax({
    type: "get",
    url: "https://hciuxteam3-default-rtdb.firebaseio.com/Users/" + param + "/UserHistory.json",
    dataType: 'json',
    success: function (result) {
      //작업이 성공적으로 발생했을 경우
      UpdateHistory(result, i)
    },
    error: function () {
      //에러가 났을 경우 실행시킬 코드
      alert("실패")
    }
  })
}

function UpdateHistory(getparam, i) {
  Clickcategory = Number(getparam[ShuffleData["Data"][i]["category"]])
  Clickcategory++
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
      UpdateNewsClick(i)
    },
    error: function (result) {
      //에러가 났을 경우 실행시킬 코드
      alert("실패")
    }
  })
}

function UpdateNewsClick(i) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://hciuxteam3-default-rtdb.firebaseio.com/NewsData/' + param + '.json');
  xhr.setRequestHeader('Content-type', 'application/json');

  xhr.onreadystatechange = function (e) {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        OriginData(JSON.parse(xhr.responseText), i);
      } else {
        console.log('Error!');
      }
    }
  };

  xhr.send();
}

function OriginData(data, i) {
  var senddata = {
    Click: 1
  };

  Num = "a"

  for (k = 0; k < data["Data"].length; k++) {
    if (ShuffleData["Data"][i]["ID"] == data["Data"][k]["ID"]) {
      Num = k
      break;
    }
  }

  $.ajax({
    type: "patch",
    url: "https://hciuxteam3-default-rtdb.firebaseio.com/NewsData/" + param + '/Data/' + Num + ".json",
    data: JSON.stringify(senddata),
    dataType: 'json',
    success: function (result) {
      //작업이 성공적으로 발생했을 경우
      GotoLink(ShuffleData["Data"][i]["news_url"])
    },
    error: function () {
      //에러가 났을 경우 실행시킬 코드
      alert("실패")
    }
  })
}

function GotoLink(link) {
  window.open(link);
  window.location.reload()
}