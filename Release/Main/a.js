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
    html += '<article style="height:400px;width:400px;border:1px solid black;" class="col-lg-3 col-md-3 col-sm-3 col-xs-6 col-xxs-12 animate-box">';
    html += '<figure style="width:100%;height:100%;object-fit:cover;">';
    html += '<a href="' + NewsData["Data"][i]["news_url"] + '"><img src="' + NewsData["Data"][i]["image_url"] + ' style="width:100%;height:100%;" alt="Image" class="img-responsive">';
    html += '</figure>';
    html += '<a href="' + NewsData["Data"][i]["news_url"] + '"><h2 class="jm-font">' + NewsData["Data"][i]["title"] + '</a></h2>';
    html += '</article>';
  }
  // html += '<div class="clearfix visible-xs-block"></div>';
  $("#parent").append(html);
}
  // document.write('<!DOCTYPE html>')
  // document.write('<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->')
  // document.write('<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->')
  // document.write('<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->')
  // document.write('<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->')
  // document.write('<head>')
  // document.write('<meta charset="utf-8">')
  // document.write('<meta http-equiv="X-UA-Compatible" content="IE=edge">')
  // document.write('<title>News recommendation system. &mdash; Free Fully Responsive HTML5 Bootstrap Template by FREEHTML5.co</title>')
  // document.write('<meta name="viewport" content="width=device-width, initial-scale=1">')
  // document.write('<meta name="description" content="Free HTML5 Template by FREEHTML5.CO" />')
  // document.write('<meta name="keywords" content="free html5, free template, free bootstrap, html5, css3, mobile first, responsive" />')
  // document.write('<meta name="author" content="FREEHTML5.CO" />')
  // document.write('<link rel="shortcut icon" href="favicon.ico">')
  // document.write('<link href="http://fonts.googleapis.com/css?family=Playfair+Display:400,700,400italic|Roboto:400,300,700" rel="stylesheet" type="text/css">')
  // document.write('<link rel="stylesheet" href="css/animate.css">')
  // document.write('<link rel="stylesheet" href="css/icomoon.css">')
  // document.write('<link rel="stylesheet" href="css/bootstrap.css">')
  // document.write('<link rel="stylesheet" href="css/style.css">')
  // document.write('<script src="js/modernizr-2.6.2.min.js"></script>')
  // document.write('<!-- FOR IE9 below -->')
  // document.write('<!--[if lt IE 9]>')
  // document.write('<script src="js/respond.min.js"></script>')
  // document.write('<![endif]-->')
  // document.write('</head>')
  // document.write('<body>')
  // document.write('<div id="fh5co-offcanvas">')
  // document.write('<a href="#" class="fh5co-close-offcanvas js-fh5co-close-offcanvas"><span><i class="icon-cross3"></i> <span>Close</span></span></a>')
  // document.write('<div class="fh5co-bio">')
  // document.write('<figure>')
  // document.write('<img src="images/1.png" alt="Free HTML5 Bootstrap Template" class="img-responsive">')
  // document.write('</figure>')
  // document.write('<h3 class="heading">주의사항</h3>')
  // document.write('<p>현재 A버전 사용</p>')
  // document.write('<p>최소 10개의 기사를 읽어주세요.</p>')
  // document.write('<P>기사를 읽는 시간대를 일정하게 유지해주세요.</P>')
  // document.write('<p>사용하며 느낀 점을 설문조사에 응답해주세요.</p>')
  // document.write('<p>사용하며 느낀 점을 유저다이어리에 기록해주세요.</p>')
  // document.write('<p>A버전 : 사용자의 취향이 50%가 반영 되는 버전</p>')
  // document.write('<p>B버전 : 사용자의 취향이 100%가 반영 되는 버전</p>')
  // document.write('</div>')
  // document.write('<div class="fh5co-menu">')
  // document.write('<div class="fh5co-box">')
  // document.write('</div>')
  // document.write('<div class="fh5co-box">')
  // document.write('</div>')
  // document.write('</div>')
  // document.write('<header id="fh5co-header">')
  // document.write('<div class="container-fluid">')
  // document.write('<div class="row">')
  // document.write('<a href="#" class="js-fh5co-nav-toggle fh5co-nav-toggle"><i></i></a>')
  // document.write('<div class="col-lg-12 col-md-12 text-center">')
  // document.write('<h1 id="fh5co-logo"><a href="index.html">News recommendation system<sup>TM</sup></a></h1>')
  // document.write('</div>')
  // document.write('</div>')
  // document.write('</div>')
  // document.write('</header>')
  // document.write('<div class="container-fluid">')
  // document.write('<div class="row fh5co-post-entry">')
  // document.write('<article class="col-lg-3 col-md-3 col-sm-3 col-xs-6 col-xxs-12 animate-box">')
  // document.write('<a href="' + NewsData["Data"][i]["news_url"] + '">')
  // document.write('<figure>')
  // document.write('<img width=380 height=380 src="' + NewsData["Data"][i]["image_url"] + '" alt="Image" class="img-responsive">')
  // document.write('</figure>')
  // document.write('<span class="fh5co-meta">' + NewsData["Data"][i]["category"] + '</a></span>')
  // document.write('<h2 class="fh5co-article-title">' + NewsData["Data"][i]["title"] + '</a></h2>')
  // document.write('<span class="fh5co-meta fh5co-date">' + NewsData["Update"] + '</span>')
  // document.write('</a>')
  // document.write('</article>')



  // document.write('<div class="clearfix visible-xs-block"></div>')
  // document.write('</div>')
  // document.write('</div>')
  // document.write('<footer id="fh5co-footer">')
  // document.write('<p><small>&copy; 2021. HCI News recommendation system. All Rights Reserverd. <br> Designed by <a href="http://freehtml5.co" target="_blank">FREEHTML5.co</a>  Demo Images: <a href="http://unsplash.com/" target="_blank">Unsplash</a></small></p>')
  // document.write('</footer>')
  // document.write('<script src="js/jquery.min.js"></script>')
  // document.write('<script src="js/jquery.easing.1.3.js"></script>')
  // document.write('<script src="js/bootstrap.min.js"></script>')
  // document.write('<script src="js/jquery.waypoints.min.js"></script>')
  // document.write('<script src="js/main.js"></script>')
  // document.write('<script src="a.js"></script>')
  // document.write('</body>')
  // document.write('</html>')
