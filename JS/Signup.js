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
    var ids = Object.keys(data)
    
    for(var i = 0; i<ids.length; i++)
    {
        IDList.push(ids[i])
    }

    console.log(IDList.length)
}

document.getElementById("txt_id").onkeyup = function(e){
    var v = this.value;
    this.value = v.replace(/[^a-z0-9]/gi, '');
}

function SignUpClick()
{
    var id="";

    id = document.getElementById("txt_id").value;    //합칠때 수정 필요

    if(id=="")
    {
        alert("아이디를 입력해 주세요!")
    }
    else
    {
        if(IDList.indexOf(id)!=-1)
        {
            alert("이미 존재하는 아이디 입니다.");
        }
        else
        {
            location.href="SelectInterest.html?" + id;
        }
    }

}