$(window).on('load', function () {
    $('#loading').hide();
});


IDList = [];
CallUsers();

function CallUsers() {
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

function CallNewsData(id) {
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

function GetDate(data) {
    alert(data[0]["title"])
}

function TryData(data) {
    var ids = Object.keys(data)

    for (var i = 0; i < ids.length; i++) {
        IDList.push(ids[i])
    }

    console.log(IDList.length)
}


function LoginClick() {
    document.getElementById('LoginBtn').setAttribute('disabled', 'true')
    var getid = document.getElementById("txt_id").value;    //합칠때 수정 필요

    getid = getid.replace(/(\s*)/g, "")

    if (getid == "") {
        alert("아이디를 입력해 주세요!")
        document.getElementById('LoginBtn').setAttribute('disabled', 'false')
    }
    else {
        n = IDList.indexOf(getid)
        if (n > -1) {
            try {
                $.ajax({
                    type: "GET",
                    url: "https://hciuxteam3-default-rtdb.firebaseio.com/NewsData/" + getid + ".json",
                    dataType: 'json',
                    success: function (result) {
                        //작업이 성공적으로 발생했을 경우
                        CheckUpdate(result, getid)
                    },
                    error: function () {
                        //에러가 났을 경우 실행시킬 코드
                        alert("업데이트 실패. 담당자에게 문의 바랍니다.")
                        document.getElementById('LoginBtn').setAttribute('disabled', 'false')
                    }
                })
            }
            catch {

            }
        }
        else {
            alert("존재하지 않는 ID 입니다.")
            document.getElementById('LoginBtn').setAttribute('disabled', 'false')
        }
    }

}

function CheckUpdate(Data, id) {
    try {
        ServerTime = new Date(Data["Update"])
        let today = new Date();
        if (today.getFullYear() == ServerTime.getFullYear() && today.getMonth() == ServerTime.getMonth() && today.getDay() == ServerTime.getDay()) {
            location.href = "Main.html?" + id;
        }
        else {
            alert("날짜 갱신이 필요합니다. 담당자에게 문의 바랍니다.")
        }
    }
    catch {
        alert("서버가 닫혀있습니다.")
    }
}
