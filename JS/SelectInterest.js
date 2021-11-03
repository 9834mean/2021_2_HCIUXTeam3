temp = location.href.split("?");
param=temp[1].split("/");

CheckData = [];

function CompeleteClick()
{
    if(CheckData.length>0)
    {
        var data = {
            ID: param[0],
            PW: param[1],
            Interest: "",
            ShowType:"A"
        };
        
        

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