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
          GotoLink(MainData["Data"][i]["news_url"])
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

function GotoLink(link) {
  window.open(link);
}