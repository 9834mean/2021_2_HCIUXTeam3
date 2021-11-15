IDList = [];
Gender = "";

WhenStart();

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

document.getElementById("txt_age").onkeyup = function(e){
    var v = this.value;
    this.value = v.replace(/[^0-9]/gi, '');
}

function OnCheckClick(data)
{
    Gender = data.value;

    a = document.getElementById("chkMan");
    b = document.getElementById("chkWoman")

    if(Gender == a.value)
    {
        a.checked = true;
        b.checked  = false;
    }
    else if(Gender == b.value)
    {
        a.checked  = false;
        b.checked = true;
    }
}

function WhenStart()
{
    a = document.getElementById("chkMan");
    b = document.getElementById("chkWoman")

    if(a.checked)
    {
        Gender = a.value;
    }
    else
    {
        Gender = b.value;
    }
}

function SignUpClick()
{
    var id="";
    var age="";

    id = document.getElementById("txt_id").value;    //합칠때 수정 필요
    age = document.getElementById("txt_age").value;    //합칠때 수정 필요

    if(id=="")
    {
        alert("아이디를 입력해 주세요!")
    }
    else if(age=="")
    {
        alert("나이를 입력해 주세요!")
    }
    else if(age<18)
    {
        alert("정확한 나이를 입력해 주세요!")
    }
    else if(Gender=="")
    {
        alert("성별을 선택해 주세요!")
    }
    else
    {
        if(IDList.indexOf(id)!=-1)
        {
            alert("이미 존재하는 아이디 입니다.");
        }
        else
        {
            location.href="SelectInterest.html?" + id + ";" + age + ";" + Gender;
        }
    }

}