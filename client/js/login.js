function updateLoginError(errorCode) {
    // error code: 1 for invalid username, 2 for invalid password, 4 for invalid email,
    //             8 for sql connection error, 16 for duplicated username, 32 for incorrect password,
    //             64 for non-existing username, 128 for unmatch confirm password
    if(errorCode & 64) {
        loginUsernameError.innerText = "Username does not exist!";
    } else {
        loginUsernameError.innerText = "";
    }

    if(errorCode & 32) {
        loginPasswordError.innerText = "Incorrect password!";
    } else {
        loginPasswordError.innerText = "";
    }
}

socket.on("connect", () => {
    var cookieToken = getCookie("access-token");
    if (cookieToken) {
        sessionStorage.setItem("access-token", cookieToken);
    }

    sessionToken = sessionStorage.getItem("access-token");
    if (sessionToken) {
        socket.emit("token-login", sessionToken);
    }
    else
    {
        loginPage.style.display = "block";
    }
});

socket.on("auth-error", (msg) => {
    showPopUpMessageBox("Error Message", ["Invalid Access Token!", "Please Login Again!"]);
    logout();
});

socket.on("login-result", (errorCode) => {
    updateLoginError(errorCode);
});

socket.on("access-token", (token) => {
    // save JWT to session
    sessionStorage.setItem("access-token", token);
    sessionToken = token;

    var remember = loginBox.querySelector("input[name='remember']").checked;
    if (remember) {
        // save JTW to cookie for 7 days
        var days = 7;
        var d = new Date();
        d.setTime(d.getTime() + (days*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = "access-token=" + token + ";" + expires;
    }

    socket.emit("token-login", token);
});

socket.on("login", (data) => {
    var user = JSON.parse(data);
    // update home page
    showMenu();
    this.user = user;
    usernameBox.innerText = user.name;

    // switch page
    var loginPage = document.getElementById("login-page");
    if(loginPage) document.getElementsByTagName("body")[0].removeChild(document.getElementById("login-page"));
    homePage.style.display = "block";
    socket.emit("get-friends");
});

loginBox.onsubmit = () => { 
    login(socket);
    return false;
};

const login = (socket) => {
    // get user input
    var username = loginBox.querySelector("input[name='username']").value;
    var password = loginBox.querySelector("input[name='password']").value;

    socket.emit("get-token", JSON.stringify({ username: username, password: password }));
};