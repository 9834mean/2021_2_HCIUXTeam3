temp = location.href.split("?");
param = temp[1];
MainData = "";

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

function TryData(data) {
  MainData = data
  setelement(data)
}

function setelement(NewsData) {
  NewsData["Data"] = shuffle(NewsData["Data"])
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
  for (i = 0; i < MainData["Data"].length; i++) {
    if (MainData["Data"][i]["ID"] == getdata.id) {

      $.ajax({
        type: "get",
        url: "https://hciuxteam3-default-rtdb.firebaseio.com/NewsData/" + param + "/Data.json",
        dataType: 'json',
        success: function (result) {
          //작업이 성공적으로 발생했을 경우
          for (j = 0; j < result.length; j++) {
            if (result[j]["ID"] == MainData["Data"][j]["ID"]) {
              if (result["Click"] == "1") {
                GotoLink(result[i]["news_url"])
                break;
              }
              else {
                UpdateClick(result, j)
              }
            }
            else {
              continue;
            }
          }
        },
        error: function () {
          //에러가 났을 경우 실행시킬 코드
          alert("실패")
        }
      })
      break;
    }
  }
}

function UpdateClick(data, i) {

  $.ajax({
    type: "get",
    url: "https://hciuxteam3-default-rtdb.firebaseio.com/Users/" + param + "/UserHistory.json",
    dataType: 'json',
    success: function (result) {
      //작업이 성공적으로 발생했을 경우
      Clickcategory = result[data[i]["category"]]
      UpdateHistory(data,i,Clickcategory)
    },
    error: function () {
      //에러가 났을 경우 실행시킬 코드
      alert("실패")
    }
  })
}

function UpdateHistory(data,i,Clickcategory)
{
  Clickcategory = Number(Clickcategory)
  Clickcategory++
  var senddata = {
    [data[i]["category"]]: Clickcategory
  };
  $.ajax({
    type: "patch",
    url: "https://hciuxteam3-default-rtdb.firebaseio.com/Users/" + param + "/UserHistory.json",
    data: JSON.stringify(senddata),
    dataType: 'json',
    success: function (result) {
      //작업이 성공적으로 발생했을 경우
      UpdateNewsClick(param,i)
    },
    error: function () {
      //에러가 났을 경우 실행시킬 코드
      alert("실패")
    }
  })
}

function UpdateNewsClick(i)
{
  var senddata = {
    Click: 1
  };

  $.ajax({
    type: "patch",
    url: "https://hciuxteam3-default-rtdb.firebaseio.com/NewsData/" + param + '/Data/' + i + ".json",
    data: JSON.stringify(senddata),
    dataType: 'json',
    success: function (result) {
      //작업이 성공적으로 발생했을 경우
      GotoLink(MainData[i]["news_url"])
    },
    error: function () {
      //에러가 났을 경우 실행시킬 코드
      alert("실패")
    }
  })
}

function GotoLink(link) {
  window.open(link);
}