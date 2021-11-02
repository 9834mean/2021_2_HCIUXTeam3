IDList_S = [];

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
    for(var i = 0; i<data.length; i++)
    {
        IDList_S.push(data[i]["ID"]);
    }
    console.log(IDList_S.length)
}

function SignUpClick()
{
    var id="";
    var ps="";
    var ps2="";

    id = document.getElementById("txt_id").value;    //합칠때 수정 필요
    ps = document.getElementById("txt_ps").value;    //합칠때 수정 필요
    ps2 = document.getElementById("txt_ps2").value;  //합칠때 수정 필요

    if(id=="")
    {
        alert("아이디를 입력해 주세요!")
    }
    else if(ps=="")
    {
        alert("비밀번호를 입력해 주세요!")
    }
    else if(ps2=="")
    {
        alert("비밀번호를 입력해 주세요!")
    }
    else if(ps!=ps2)
    {
        alert("비밀번호를 확인해 주세요!.")
    }
    else
    {
        if(IDList_S.indexOf(id)!=-1)
        {
            alert("이미 존재하는 아이디 입니다.");
        }
        else
        {
            //선호 찾는 페이지로
            location.href="SelectInterest.html";
        }
    }

}