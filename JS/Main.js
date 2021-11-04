IDList = [];
var UserData;
// var xhr = new XMLHttpRequest();
// xhr.open('GET', 'https://hciuxteam3-default-rtdb.firebaseio.com/Users.json');
// xhr.setRequestHeader('Content-type', 'application/json');

// xhr.onreadystatechange = function (e) {
//     if (xhr.readyState === XMLHttpRequest.DONE) {
//         if (xhr.status === 200) {
//             TryData(JSON.parse(xhr.responseText));
//         } else {
//             console.log('Error!');
//         }
//     }
// };

// xhr.send();

// function TryData(data){
//     for(var i = 0; i<data.length; i++)
//     {
//         IDList.push(data[i]["ID"]);
//     }
//     UserData = data;
//     console.log(IDList.length)
// }

function LoginClick(){

    var id = document.getElementById("txt_id").value;    //합칠때 수정 필요
    //var ps = document.getElementById("txt_ps").value;    //합칠때 수정 필요

    if(id=="")
    {
        alert("아이디를 입력해 주세요!")
    }
    // else if(ps=="")
    // {
    //     alert("비밀번호를 입력해 주세요!")
    // }
    else
    {
        n =IDList.indexOf(id) 
        if(n>-1)
        {
            // var shapw = CryptoJS.SHA256(ps).toString(); 
            // if(shapw==UserData[n]["PW"])
            // {
            //     //뉴스룸 페이지로
            // }
            // else
            // {
            //     alert("아이디/비밀번호를 확인해 주세요.")
            // }

            //여기에 firestore랑 통신
        }
        else
        {
            alert("존재하지 않는 ID 입니다.")
        }
    }

}