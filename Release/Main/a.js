temp = location.href.split("?");
param = temp[1];

var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://hciuxteam3-default-rtdb.firebaseio.com/NewsData/' + '9834min' + '.json');
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
  setelement(data)
}

function setelement(NewsData) {
  var html = '';
  // html += '<div class="clearfix visible-xs-block"></div>';
  for (i = 0; i < NewsData["Data"].length; i++) {   
    html += '<article style="height:259.25px;width:459.45px;" class="col-lg-3 col-md-3 col-sm-3 col-xs-6 col-xxs-12 animate-box">';
    html += '<figure style="width:100%;height:100%;object-fit:cover;overflow:hidden;">';
    html += '<a href="' + NewsData["Data"][i]["news_url"] + '"><img src="' + NewsData["Data"][i]["image_url"] + ' style="width:100%;height:100%;" alt="Image" class="img-responsive">';
    html += '</figure>';
    html += '<a href="' + NewsData["Data"][i]["news_url"] + '"><h2 class="jm-font">' + NewsData["Data"][i]["title"] + '</a></h2>';
    html += '</article>';
  }
  // html += '<div class="clearfix visible-xs-block"></div>';
  $("#parent").append(html);
}
