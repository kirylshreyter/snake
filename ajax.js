function CreateRequest() {
    var Request = false;
    if (window.XMLHttpRequest) {
        Request = new XMLHttpRequest();
    }
    else if (window.ActiveXObject) {
        try {
            Request = new ActiveXObject("Microsoft.XMLHTTP");
        }
        catch (CatchException) {
            Request = new ActiveXObject("Msxml2.XMLHTTP");
        }
    }
    if (!Request) {
        alert("Could not create XMLHttpRequest");
    }
    return Request;
}

/*
Функция посылки запроса к файлу на сервере
r_method  - тип запроса: GET или POST
r_path    - путь к файлу
r_args    - аргументы вида a=1&b=2&c=3...
r_handler - функция-обработчик ответа от сервера
*/
function SendRequest(r_method, r_path, r_args, r_handler) {
    var Request = CreateRequest();
    if (!Request) {
        return;
    }

    //Назначаем пользовательский обработчик
    Request.onreadystatechange = function () {
        //Если обмен данными завершен
        if (Request.readyState == 4) {
            if (Request.status == 200) {
                r_handler(Request);
            }
            else {
                alert("Something go wrong, try again.");
            }
        }
        else {
            //Оповещаем пользователя о загрузке
        }

    };

    //Проверяем, если требуется сделать GET-запрос
    if (r_method.toLowerCase() == "get" && r_args.length > 0)
        r_path += "?" + r_args;
    Request.open(r_method, r_path, true);

    if (r_method.toLowerCase() == "post") {
        Request.setRequestHeader("Content-Type", "application/json");
        Request.send(r_args);
    }
    else {
        Request.send(null);
    }
}

function GetScores(scoresUrl, container) {
    var Handler = function (Request) {
        var usersArray = JSON.parse(Request.responseText);
        for (var arrayIterator = 0; arrayIterator < usersArray.length; arrayIterator++) {
            document.getElementById(container).innerHTML = document.getElementById(container).innerHTML + usersArray[arrayIterator].name;
        }
    };
    SendRequest("GET", scoresUrl, "", Handler);
}

function getCurrentDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd
    }

    if (mm < 10) {
        mm = '0' + mm
    }

    today = yyyy + '-' + mm + '-' + dd;
    return today;
}

function SaveScore(scoresUrl) {
    var name = document.getElementById('name');
    var score = document.getElementById('score').innerText;
    var today = getCurrentDate();
    var score = {name: name, score: score, date: today};
    var Handler = function (Request) {
        var usersArray = JSON.parse(Request.responseText);
        for (var arrayIterator = 0; arrayIterator < usersArray.length; arrayIterator++) {
            document.getElementById(container).innerHTML = document.getElementById(container).innerHTML + usersArray[arrayIterator].name;
        }
    };
    SendRequest("POST", scoresUrl, score, Handler);
}