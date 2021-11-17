$(window).on('load',function() {
    $('#loading').hide();
});

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

    var getid = document.getElementById("txt_id").value;    //합칠때 수정 필요

    if(getid=="")
    {
        alert("아이디를 입력해 주세요!")
    }
    else
    {
        n =IDList.indexOf(getid) 
        if(n>-1)
        {
            try{
                $.ajax({
                    type: "GET",
                    url: "https://hciuxteam3-default-rtdb.firebaseio.com/NewsData/" + getid + ".json",
                    dataType: 'json',
                    success: function (result) {
                        if(result==null)
                        {
                            UpdateNews(getid)
                        }
                      //작업이 성공적으로 발생했을 경우
                      CheckUpdate(JSON.parse(result.responseText), getid)
                    },
                    error: function () {
                      //에러가 났을 경우 실행시킬 코드
                      UpdateNews(getid)
                    }
                  })
                  location.href="Main/Index.html?" + id;
            }
            catch{

            }            
        }
        else
        {
            alert("존재하지 않는 ID 입니다.")
        }
    }

}

function CheckUpdate(Data, ID)
{
    Server = Date.parse(Data["Update"])
    let today = new Date();  
    if(Server<today)
    {
        UpdateNews(ID)
    }
}

function UpdateNews(ID)
{
    var senddata = {
        "ID":ID
      };
    
    $.ajax({
        type: "POST",
        url: "",
        data: JSON.stringify(senddata),
        dataType: 'json',
        success: function (result) {
          //작업이 성공적으로 발생했을 경우
            a = JSON.parse(result.responseText)
            if(a["success"]!=true)
            {
                alert("데이터 갱신 실패 문의 바람")
            }
        },
        error: function () {
          //에러가 났을 경우 실행시킬 코드
          alert("실패")
        }
      })
}