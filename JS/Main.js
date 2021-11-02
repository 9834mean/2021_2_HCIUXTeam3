IDList = [];
var UserData;
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
        IDList.push(data[0]["ID"]);
    }
    UserData = data;
    console.log(IDList.length)
}

function LoginClick(){

    var id = document.getElementById("txt_id").value;
    var ps = document.getElementById("txt_ps").value;

    if(id=="")
    {
        alert("아이디를 입력해 주세요!")
    }
    else if(ps=="")
    {
        alert("비밀번호를 입력해 주세요!")
    }
    else
    {
        n =IDList.indexOf(id) 
        if(n>-1)
        {
            var shapw = CryptoJS.SHA256(ps).toString(); 
            if(shapw==UserData[n]["PW"])
            {
                
            }
            else
            {
                alert("아이디/비밀번호를 확인해 주세요.")
            }
        }
        else
        {
            alert("존재하지 않는 ID 입니다.")
        }
    }

}