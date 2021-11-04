temp = location.href.split("?");
param=temp[1];

CheckData = [];

function CompeleteClick()
{
    if(CheckData.length>0)
    {
        var chdata = "";

        for(var i = 0; i<CheckData.length; i++)
        {
            if(i==CheckData.length-1)
            {
                chdata+=CheckData[i];
            }
            else
            {
                chdata+=CheckData[i] + ",";
            }
        }

        var senddata = {
        [param] : {
                Interest : chdata,
                ShowType : 'A'
            }
        };

        $.ajax({
            type: "patch",
            url : "https://hciuxteam3-default-rtdb.firebaseio.com/Users.json",
            data: JSON.stringify(senddata),
            dataType:'json', 
            success: function(result){
                //작업이 성공적으로 발생했을 경우
                alert("회원가입 성공")
                location.href="Main.html";
            },
            error:function(){  
                //에러가 났을 경우 실행시킬 코드
                alert("회원가입 실패")
            }
        })
    }
    else
    {
        alert("최소 하나의 분야를 선택해 주세요!")
    }
}

function OnCheckClick(data)
{
    if(CheckData.includes(data.value))
    {
        var index = CheckData.indexOf(data.value)
        if(index >-1)
        {
            CheckData.splice(index,1)
        }
    }
    else
    {
        CheckData.push(data.value)
    }
}