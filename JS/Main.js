var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://hciuxteam3-default-rtdb.firebaseio.com/Users.json');
xhr.setRequestHeader('Content-type', 'application/json');
xhr.send();

xhr.onreadystatechange = function (e) {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      // status는 response 상태 코드를 반환 : 200 => 정상
      if(xhr.status === 200) {
        console.log(xhr.responseText);
      } else {
        console.log('Error!');
      }
    }
  };
  