/** Components in Login Page **/
const loginPage = document.getElementById("login-page");

// Login Form
const loginWrapper = document.getElementById("login-wrapper");
const loginBox = document.getElementById("login-box");
const createBtn = document.getElementById("create-button");

// Registration Form
const registrationWrapper = document.getElementById("registration-wrapper");
const registrationBox = document.getElementById("registration-box");
const closeCreateBtn = document.getElementById("close-create-button");


/** Components in Home Page **/
const homePage = document.getElementById("home-page");

// Main Menu
const menuWrapper = document.getElementById("menu-wrapper");
const battleBtn = document.getElementById("battle-button");
const settingBtn = document.getElementById("setting-button");

// Setting Menu
const settingWrapper = document.getElementById("setting-wrapper");
const usernameBox = document.getElementById("username-box");
const logoutBtn = document.getElementById("logout-button");
const changePasswordBtn = document.getElementById("change-password-button");
const closeSettingBox = document.getElementById("close-setting-button");

// Change Password Form
const changePasswordWrapper = document.getElementById("change-password-wrapper");
const changePasswordBox = document.getElementById("change-password-box");
const closeChangePasswordBtn = document.getElementById("close-change-password-button");

// Game Board
const gameBoard = document.getElementById("game-board");

//=============================================================================

// Session Storage of JTW
var sessionToken;

// Show Registration Form
createBtn.addEventListener("click", showRegistration);
function showRegistration () {
    registrationWrapper.style.display = "block";
}

// Close Registration Form
closeCreateBtn.addEventListener("click", closeRegistration);
function closeRegistration () {
    registrationWrapper.style.display = "none";
    registrationBox.reset();
}

// Logout and Clear Cookie and Session
logoutBtn.addEventListener("click", logout);
function logout () {
    // clear cookie and session
    var d = new Date();
    d.setTime(d.getTime());
    var expires = "expires="+ d.toUTCString();
    document.cookie = "access-token=;" + expires;
    sessionStorage.removeItem("access-token");

    // reload page
    location.reload();
}

// Show Setting Menu
settingBtn.addEventListener("click", showSetting);
function showSetting () {
    settingWrapper.style.display = "block";
}

// Close Setting Menu
closeSettingBox.addEventListener("click", closeSetting);
function closeSetting() {
    settingWrapper.style.display = "none";
}

// Show Change Password Form
changePasswordBtn.addEventListener("click", showChangePassword);
function showChangePassword() {
    changePasswordWrapper.style.display = "block";
}

// Close Chnage Password Form and Clear The Input
closeChangePasswordBtn.addEventListener("click", closeChangePassword);
function closeChangePassword() {
    changePasswordWrapper.style.display = "none";
    changePasswordBox.reset();
}

// Show Main Menu and Hide Game Board
function showMenu () {
    menuWrapper.style.display = "block";
    gameBoard.display = "none";
}

// Show Game Board and Hide Main Menu
function showGameBoard() {
    menuWrapper.style.display = "none";
    gameBoard.display = "block";
}

// Get Cookie by Name
function getCookie (name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Self Executing Function
(() => {
    const socket = io();

    socket.on("connect", () => {
        var cookieToken = getCookie("access-token");
        if (cookieToken) {
            sessionStorage.setItem("access-token", cookieToken);
        }

        sessionToken = sessionStorage.getItem("access-token");
        if (sessionToken) {
            socket.emit("token-login", sessionToken);
        }
    });

    socket.on("disconnect", () => {
        console.log("disconnected from server");
    });

    socket.on("register-result", (result) => {
        if (result == "success") {
            closeRegistration();
        }
        console.log("register result: " + result);
    });

    socket.on("error", (msg) => {
        console.log("error", msg);
    });

    socket.on("auth-error", (msg) => {
        console.log(msg);
    });

    socket.on("login-error", (result) => {
        console.log("login error: " + result);
    });

    socket.on("change-password-result", (result) => {
        console.log(result);
        if (result == "success") {
            closeChangePassword();
        }
    })

    socket.on("access-token", (token) => {
        // save JWT to session
        sessionStorage.setItem("access-token", token);
        sessionToken = token;

        var remember = loginBox.querySelector("input[name='remember']").checked;
        if (remember) {
            // save JTW to cookie for 7 days
            var d = new Date();
            d.setTime(d.getTime() + (7*24*60*60*1000));
            var expires = "expires="+ d.toUTCString();
            document.cookie = "access-token=" + token + ";" + expires;
        }

        socket.emit("token-login", token);
    });

    socket.on("access-token-update", (token) => {
        sessionStorage.setItem("access-token", token);
        sessionToken = token;

        var remember = loginBox.querySelector("input[name='remember']").checked;
        if (remember) {
            // save JTW to cookie for 7 days
            var d = new Date();
            d.setTime(d.getTime() + (7*24*60*60*1000));
            var expires = "expires="+ d.toUTCString();
            document.cookie = "access-token=" + token + ";" + expires;
        }
    });

    socket.on("login", (username) => {
        // update home page
        showMenu();
        usernameBox.innerText = username;

        // switch page
        loginPage.style.display = "none";
        homePage.style.display = "block";
    });

    loginBox.onsubmit = () => { 
        login(socket);
        return false;
    };

    registrationBox.onsubmit = () => {
        register(socket);
        return false;
    };

    changePasswordBox.onsubmit = () => {
        changePassword(socket);
        return false;
    };

    battleBtn.addEventListener("click", () => {
        openBattleRoom(socket);
    });
})();

const login = (socket) => {
    // get user input
    var username = loginBox.querySelector("input[name='username']").value;
    var password = loginBox.querySelector("input[name='password']").value;

    socket.emit("get-token", JSON.stringify({ username: username, password: password }));
};

const register = (socket) => {
    // get user input
    var username = registrationBox.querySelector("input[name='username']").value;
    var email = registrationBox.querySelector("input[name='email']").value;
    var password = registrationBox.querySelector("input[name='password']").value;
    var confirmPassword = registrationBox.querySelector("input[name='confirmPassword']").value;

    // validate user input
    if (password == confirmPassword) {
        socket.emit("register", JSON.stringify({ username: username, password: password, email: email }));
    } else {
        console.log("The passwords do not match, please try again.");
    }
};

const changePassword = (socket) => {
    // get user input
    var password = changePasswordBox.querySelector("input[name='originalPassword']").value;
    var newPassword = changePasswordBox.querySelector("input[name='newPassword']").value;
    var confirmPassword = changePasswordBox.querySelector("input[name='confirmPassword']").value;

    // validate user input
    if (newPassword == confirmPassword) {
        socket.emit("change-password", JSON.stringify({ token: sessionToken, password: password, newPassword: newPassword }));
    } else {
        console.log("The new passwords do not match, please try again.");
    }
};

const openBattleRoom = (socket) => {
    socket.emit("open-room", JSON.stringify({ token: sessionToken }));
}