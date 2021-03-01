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
const changeEmailBtn = document.getElementById("change-email-button");
const closeSettingBox = document.getElementById("close-setting-button");

// Change Password Form
const changePasswordWrapper = document.getElementById("change-password-wrapper");
const changePasswordBox = document.getElementById("change-password-box");
const closeChangePasswordBtn = document.getElementById("close-change-password-button");

//Change Email Form
const changeEmailWrapper = document.getElementById("change-email-wrapper");
const changeEmailBox = document.getElementById("change-email-box");
const closeChangeEmailBtn = document.getElementById("close-change-email-button");

// Game Board
const gameBoard = document.getElementById("game-board");

//=============================================================================

// Session Storage of JTW
var sessionToken;

// Show Registration Form
createBtn.addEventListener("click", showRegistration);
function showRegistration () {
    updateLoginError(0);
    registrationWrapper.style.display = "block";
}

// Close Registration Form
closeCreateBtn.addEventListener("click", closeRegistration);
function closeRegistration () {
    updateRegistrationError(0);
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

// Close Change Password Form and Clear The Input
closeChangePasswordBtn.addEventListener("click", closeChangePassword);
function closeChangePassword() {
    changePasswordWrapper.style.display = "none";
    changePasswordBox.reset();
    updateChangePasswordError(0);
}

// Show Change Email Form
changeEmailBtn.addEventListener("click", showChangeEmail);
function showChangeEmail() {
    changeEmailWrapper.style.display = "block";
}

// Close Change Email Form and Clear The Input
closeChangeEmailBtn.addEventListener("click", closeChangeEmail);
function closeChangeEmail() {
    changeEmailWrapper.style.display = "none";
    changeEmailBox.reset();
    updateChangeEmailError(0);
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

function updateLoginError(errorCode) {
    // error code: 1 for invalid username, 2 for invalid password, 4 for invalid email,
    //             8 for sql connection error, 16 for duplicated username, 32 for duplicated email
    //             64 for incorrect password, 128 for non-existing username, 256 for unmatch confirm password
    if(errorCode & 128) {
        document.getElementById("login-username-error").innerText = "Username does not exist!";
    } else {
        document.getElementById("login-username-error").innerText = "";
    }
    
    if(errorCode & 64) {
        document.getElementById("login-password-error").innerText = "Incorrect password!";
    } else {
        document.getElementById("login-password-error").innerText = "";
    }
}

function updateRegistrationError(errorCode) {
    // error code: 1 for invalid username, 2 for invalid password, 4 for invalid email,
    //             8 for sql connection error, 16 for duplicated username, 32 for duplicated email
    //             64 for incorrect password, 128 for non-existing username, 256 for unmatch confirm password
    if (errorCode & 1 || errorCode & 16) {
        if(errorCode & 1) {
            document.getElementById("register-username-error").innerText = "Invalid username format!";
        } else {
            document.getElementById("register-username-error").innerText = "The username has already registered!";
        }
    } else {
        document.getElementById("register-username-error").innerText = "";
    }
    
    if (errorCode & 2) {
        document.getElementById("register-password-error").innerText = "Invalid password format!";
    } else {
        document.getElementById("register-password-error").innerText = "";
    }

    if (errorCode & 4 || errorCode & 32) {
        if(errorCode & 4) {
            document.getElementById("register-email-error").innerText = "Invalid email format!";
        } else {
            document.getElementById("register-email-error").innerText = "The email has already registered!";
        }
    } else {
        document.getElementById("register-email-error").innerText = "";
    }

    if (errorCode & 256) {
        document.getElementById("register-comfirm-password-error").innerText = "The password does not match!";
    } else {
        document.getElementById("register-comfirm-password-error").innerText = "";
    }
}

function updateChangePasswordError(errorCode) {
    // error code: 1 for invalid username, 2 for invalid password, 4 for invalid email,
    //             8 for sql connection error, 16 for duplicated username, 32 for duplicated email
    //             64 for incorrect password, 128 for non-existing username, 256 for unmatch confirm password
    if(errorCode & 2) {
        document.getElementById("change-new-password-error").innerText = "Invalid password format!";
    } else {
        document.getElementById("change-new-password-error").innerText = "";
    }
    
    if(errorCode & 64) {
        document.getElementById("change-password-error").innerText = "Incorrect password!";
    } else {
        document.getElementById("change-password-error").innerText = "";
    }

    if (errorCode & 256) {
        document.getElementById("change-confirm-password-error").innerText = "The password does not match!";
    } else {
        document.getElementById("change-confirm-password-error").innerText = "";
    }
}

function updateChangeEmailError(errorCode) {
    // error code: 1 for invalid username, 2 for invalid password, 4 for invalid email,
    //             8 for sql connection error, 16 for duplicated username, 32 for duplicated email
    //             64 for incorrect password, 128 for non-existing username, 256 for unmatch confirm password
    if(errorCode & 4) {
        document.getElementById("change-email-error").innerText = "Invalid email format!";
    } else {
        document.getElementById("change-email-error").innerText = "";
    }

    if(errorCode & 64) {
        document.getElementById("change-email-password-error").innerText = "Incorrect password!";
    } else {
        document.getElementById("change-email-password-error").innerText = "";
    }
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
        else
        {
            loginPage.style.display = "block";
        }
    });

    socket.on("disconnect", () => {
        console.log("disconnected from server");
    });

    socket.on("error", (msg) => {
        console.log("error", msg);
    });

    socket.on("auth-error", (msg) => {
        logout();
    });

    socket.on("login-result", (errorCode) => {
        updateLoginError(errorCode);
    });

    socket.on("change-password-result", (errorCode) => {
        if (errorCode == 0) {
            closeChangePassword();
        }
        updateChangePasswordError(errorCode);
    });

    socket.on("change-email-result", (errorCode) => {
        if (errorCode == 0) {
            closeChangeEmail();
        }
        updateChangeEmailError(errorCode);
    });

    socket.on("register-result", (errorCode) => {
        if (errorCode == 0) {
            closeRegistration();
        }
        console.log("register-result", errorCode);
        updateRegistrationError(errorCode);
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

    socket.on("login", (username) => {
        // update home page
        showMenu();
        usernameBox.innerText = username;

        // switch page
        loginPage.style.display = "none";
        homePage.style.display = "block";
    });

    socket.on("room-id", (id) => {
        console.log(id);
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

    changeEmailBox.onsubmit = () => {
        changeEmail(socket);
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

    socket.emit("register", JSON.stringify({ username: username, password: password, confirmPassword: confirmPassword, email: email }));
};

const changePassword = (socket) => {
    // get user input
    var password = changePasswordBox.querySelector("input[name='originalPassword']").value;
    var newPassword = changePasswordBox.querySelector("input[name='newPassword']").value;
    var confirmPassword = changePasswordBox.querySelector("input[name='confirmPassword']").value;

    socket.emit("change-password", JSON.stringify({ password: password, newPassword: newPassword , confirmPassword: confirmPassword}));
};

const changeEmail = (socket) => {
    // get user input
    var password = changeEmailBox.querySelector("input[name='password']").value;
    var email = changeEmailBox.querySelector("input[name='email']").value;

    socket.emit("change-email", JSON.stringify({ password: password, email: email }));
};

const openBattleRoom = (socket) => {
    socket.emit("open-room");
}