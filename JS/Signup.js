IDList = [];

var id="";
var ps="";
var ps2="";

function SignUpClick()
{
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
        if(IDList.indexOf(id)!=-1)
        {
            alert("이미 존재하는 아이디 입니다.");
        }
        else
        {
            //선호 찾는 페이지로
        }
    }

}