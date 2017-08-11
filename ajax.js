var url = 'services/';

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

function SendRequest(r_method, r_path, r_args, r_handler) {
    var Request = CreateRequest();
    if (!Request) {
        return;
    }
    Request.onreadystatechange = function () {
        if (Request.readyState == 4) {
            if (Request.status == 200) {
                r_handler(Request);
            }
            else {
                alert("Something go wrong, try again.");
            }
        }
    };
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

function loadScores() {
    var Handler = function (Request) {
        var usersArray = JSON.parse(Request.responseText);
        for (var arrayIterator = 0; arrayIterator < usersArray.length; arrayIterator++) {
            addUserToScoreTable(usersArray[arrayIterator]);
        }
    };
    SendRequest("GET", url, "", Handler);
}

function getCurrentDate() {
    var today = new Date();
    var day = today.getDate();
    var month = today.getMonth() + 1;
    var year = today.getFullYear();
    if (day < 10) {
        day = '0' + day;
    }
    if (month < 10) {
        month = '0' + month;
    }
    today = year + '-' + month + '-' + day;
    return today;
}

function saveScore() {
    var user_score = document.getElementById('score').innerText;
    var today = '"' + getCurrentDate() + '"';
    var userScore = '{"name":"' + userName + '","score":' + user_score + ', "date":' + today + '}';
    var Handler = function (Request) {
        var user = JSON.parse(Request.responseText);
        addUserToScoreTable(user);
    };
    SendRequest("POST", url, userScore, Handler);
}

function addUserToScoreTable(user) {
    var table = document.getElementById('score_table');
    var rowCount = table.getElementsByTagName("tr").length;
    var row = table.insertRow(rowCount);
    var cell_1 = row.insertCell(0);
    cell_1.innerText = user.name;
    var cell_2 = row.insertCell(1);
    cell_2.innerText = user.score;
    var cell_3 = row.insertCell(2);
    var newDate = new Date(user.date);
    cell_3.innerText = newDate.toDateString();
}