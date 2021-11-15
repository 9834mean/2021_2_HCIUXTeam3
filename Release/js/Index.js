IDList = [];
CallUsers();

function CallUsers()
{
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
}

function CallNewsData(id)
{
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://hciuxteam3-default-rtdb.firebaseio.com/NewsData/' + id + '.json');
    xhr.setRequestHeader('Content-type', 'application/json');
    
    xhr.onreadystatechange = function (e) {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                GetDate(JSON.parse(xhr.responseText));                
            } else {
                console.log('Error!');
            }
        }
    };

    xhr.send();
}

function GetDate(data)
{
    alert(data[0]["title"])
}




function TryData(data){
    var ids = Object.keys(data)
    
    for(var i = 0; i<ids.length; i++)
    {
        IDList.push(ids[i])
    }

    console.log(IDList.length)
}

function LoginClick(){

    var id = document.getElementById("txt_id").value;    //합칠때 수정 필요

    if(id=="")
    {
        alert("아이디를 입력해 주세요!")
    }
    else
    {
        n =IDList.indexOf(id) 
        if(n>-1)
        {
            CallNewsData(id);

        }
        else
        {
            alert("존재하지 않는 ID 입니다.")
        }
    }

}