IDList = [];

var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://hciuxteam3-default-rtdb.firebaseio.com/Users.json');
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

function TryData(data){
    for(var i in data)
    {
        IDList.push(i)
    }

    console.log(IDList.length)
}

