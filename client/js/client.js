// =================  Components in Login Page  ================= //
const loginPage = document.getElementById("login-page");

// Login Form
const loginWrapper = document.getElementById("login-wrapper");
const loginBox = document.getElementById("login-box");
const createBtn = document.getElementById("create-button");
const forgetBtn = document.getElementById("forget-button");

// Registration Form
const registrationWrapper = document.getElementById("registration-wrapper");
const registrationBox = document.getElementById("registration-box");
const closeCreateBtn = document.getElementById("close-create-button");

// Forget Form
const forgetWrapper = document.getElementById("forget-wrapper");
const forgetBox = document.getElementById("forget-box");
const closeForgetBtn = document.getElementById("close-forget-button");

// =================  Components in Home Page  ================= //
const homePage = document.getElementById("home-page");

// Main Menu
const menuWrapper = document.getElementById("menu-wrapper");
const battleBtn = document.getElementById("battle-button");
const openRoomBtn = document.getElementById("open-button");
const joinBtn = document.getElementById("join-button");
const leaderboardBtn = document.getElementById("leaderboard-button");
const friendBtn = document.getElementById("friend-button");
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

// Change Email Form
const changeEmailWrapper = document.getElementById("change-email-wrapper");
const changeEmailBox = document.getElementById("change-email-box");
const closeChangeEmailBtn = document.getElementById("close-change-email-button");

// Room
const roomWrapper = document.getElementById("room-wrapper");
const roomBox = document.getElementById("room-box");
const roomInfo = document.getElementById("room-information");
const roomIdInfo = document.getElementById("room-id");
const playersInfo = document.getElementById("players");
const spectatorsInfo = document.getElementById("spectators");
const startBtn = document.getElementById("start-button");
const spectateBtn = document.getElementById("spectate-button");
const playBtn = document.getElementById("play-button");
const leaveBtn = document.getElementById("leave-button");
const roomChatBtn = document.getElementById("room-chat-button");
const unreadRoomChat = document.getElementById("unread-room-chat");

// Join Room Form
const joinWrapper = document.getElementById("join-wrapper");
const joinBox = document.getElementById("join-box");
const joinRoomBtn = document.getElementById("join-room-button");
const closejoinBtn = document.getElementById("close-join-button");

// Room Chat Form
const roomChatWrapper = document.getElementById("room-chat-wrapper");
const roomChatBox = document.getElementById("room-chat-box");
const closeRoomChatBtn = document.getElementById("close-room-chat-button");
const roomChatContent = document.getElementById("room-chat-content");

// Leaderboard
const leaderboardWrapper = document.getElementById("leaderboard-wrapper");
const leaderboardBox = document.getElementById("leaderboard-box");
const leaderboard = document.getElementById("leaderboard");
const closeLeaderboardBtn = document.getElementById("close-leaderboard-button");

// Friend
const friendWrapper = document.getElementById("friend-wrapper");
const friendBox = document.getElementById("friend-box");
const pendingList = document.getElementById("pending-list");
const requestList = document.getElementById("request-list");
const friendList = document.getElementById("friend-list");
const blockList = document.getElementById("block-list");
const closeFriendBtn = document.getElementById("close-friend-button");


// Game Board
const gameBoard = document.getElementById("game-board");

// ==================================================================== //

// Session Storage of JTW
var sessionToken;
var user;
var unreadRoomChatCnt = 0;

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

forgetBtn.addEventListener("click", showForget);
function showForget () {
    updateForgetError(0);
    forgetWrapper.style.display = "block";
}

closeForgetBtn.addEventListener("click", closeForget);
function closeForget () {
    updateForgetError(0);
    forgetWrapper.style.display = "none";
    forgetBox.reset();
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

joinBtn.addEventListener("click", showJoinRoomWrapper);
function showJoinRoomWrapper() {
    joinWrapper.style.display = "block";
}

closejoinBtn.addEventListener("click", closeJoinRoomWrapper);
function closeJoinRoomWrapper() {
    joinWrapper.style.display = "none";
    joinBox.reset();
}

roomChatBtn.addEventListener("click", showRoomChat);
function showRoomChat() {
    unreadRoomChatCnt = 0;
    unreadRoomChat.innerText = "";
    roomChatWrapper.style.display = "block";
}

closeRoomChatBtn.addEventListener("click", closeRoomChat);
function closeRoomChat() {
    roomChatWrapper.style.display = "none";
    roomChatBox.reset();
}

closeLeaderboardBtn.addEventListener("click", closeLeaderboard);
function closeLeaderboard() {
    leaderboardWrapper.style.display = "none";
    leaderboard.innerHTML = "";
    leaderboardBox.reset();
}

closeFriendBtn.addEventListener("click", closeFriend);
function closeFriend() {
    friendWrapper.style.display = "none";
    requestList.innerHTML = "";
    pendingList.innerHTML = "";
    friendList.innerHTML = "";
    blockList.innerHTML = "";
    friendBox.reset();
}

// Show Main Menu and Hide Game Board
function showMenu() {
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

function updateForgetError(errorCode) {
    if(errorCode > 0) {
        document.getElementById("forget-username-error").innerText = "Invalid username";
    } else {
        document.getElementById("forget-username-error").innerText = "";
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

function updateJoinError(errorCode) {
    document.getElementById("join-error").innerText = "";
    if (errorCode & 1) {
        document.getElementById("join-error").innerText += "Invalid Room ID";
    } else if (errorCode & 2) {
        document.getElementById("join-error").innerText += "The Room Is Fulled";
    }
}

function updateRoomState(state) {
    playersInfo.innerHTML = "";
    spectatorsInfo.innerHTML = "";
    if(!state) {
        roomWrapper.style.display = "none";
        roomChatContent.innerHTML = "";
        return;
    }
    
    roomIdInfo.innerText = state.roomId;

    // host
    var div = document.createElement("div");
    div.className = "username";
    div.innerText = state.players[0].name;
    var span = document.createElement("span");
    span.innerHTML = ` (${state.players[0].ranking}) `;
    div.appendChild(span);
    span = document.createElement("span");
    span.innerText = " (host)";
    div.appendChild(span);
    playersInfo.appendChild(div);

    // other player
    div = document.createElement("div");
    div.className = "username";
    if(state.players[1]) {
        div.innerText = state.players[1].name;
        span = document.createElement("span");
        span.innerHTML = ` (${state.players[1].ranking}) `;
        div.appendChild(span);
    } else {
        span = document.createElement("span");
        span.innerText = "-----";
        div.appendChild(span);
    }
    playersInfo.appendChild(div);

    var spectating = false;
    if(state.spectators.length > 0) {
        spectatorsInfo.innerHTML += "<div>Spectators:&nbsp;</div>";
        var spectatorsDiv = document.createElement("div");
        spectatorsDiv.className = "vertical-container";
        state.spectators.forEach(spectator => {
            var div = document.createElement("div");
            div.className = "username";
            div.innerText = spectator.name;
            span = document.createElement("span");
            span.innerHTML = ` (${spectator.ranking}) `;
            div.appendChild(span);
            spectatorsDiv.appendChild(div);
            if(spectator.id == user.id) spectating = true;
        });
        spectatorsInfo.appendChild(spectatorsDiv);
    }
    
    if(state.players[0].id == user.id) {
        if(state.players.length == 2) startBtn.style.display = "block";
        else startBtn.style.display = "none";
        spectateBtn.style.display = "none";
        playBtn.style.display = "none";
    } else {
        startBtn.style.display = "none";
    }
    if(state.players[1] && state.players[1].id == user.id) {
        spectateBtn.style.display = "block";
        playBtn.style.display = "none";
    } else if(spectating) {
        spectateBtn.style.display = "none";
        if(!state.players.length < 2) playBtn.style.display = "block";
    }
    roomWrapper.style.display = "block";
}

// Convert the message into a div element
function toHTMLMessage(username, msg) {
    var contentDiv = document.createElement("div");
    contentDiv.className = "content horizontal-container"
    
    var div = document.createElement("div");
    div.className = "username";
    div.textContent = username + ":";
    div.innerHTML += "&nbsp;"
    contentDiv.appendChild(div);

    div = document.createElement("div");
    div.className = "msg";
    div.innerText = msg;
    contentDiv.appendChild(div);
    return contentDiv;
}

function updateLeaderboard(players) {
    leaderboard.innerHTML = "<div class='horizontal-container'><div>Username</div><div>Ranking</div></div>";

    players.forEach(player => {
        var outterDiv = document.createElement("div");
        outterDiv.className = "record horizontal-container";
        var div = document.createElement("div");
        div.className = "username";
        div.innerText = player.username;
        outterDiv.appendChild(div);
        
        div = document.createElement("div");
        div.innerText = player.ranking;
        outterDiv.appendChild(div);
        
        leaderboard.appendChild(outterDiv);
    });
}

function updateFriend(players) {
    console.log(players);
    return;
    friendList.innerHTML = "<div class='horizontal-container'><div>Username</div><div>Ranking</div></div>";
    players.forEach(player => {
        var outterDiv = document.createElement("div");
        outterDiv.className = "record horizontal-container";
        var div = document.createElement("div");
        div.className = "username";
        div.innerText = player.username;
        outterDiv.appendChild(div);
        
        div = document.createElement("div");
        div.innerText = player.ranking;
        outterDiv.appendChild(div);
        
        leaderboard.appendChild(outterDiv);
    });
}

// Self Executing Function
// (() => {
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
    updateRegistrationError(errorCode);
});

socket.on("forget-password-result", (errorCode) => {
    if(errorCode == 0)
    {
        closeForget();
    }
    updateForgetError(errorCode);
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
    loginPage.style.display = "none";
    homePage.style.display = "block";
});

socket.on("room-state", (data) => {
    var state = JSON.parse(data);
    updateRoomState(state);
});

socket.on("room-msg", (data) => {
    var {username, msg} = JSON.parse(data);

    // check whether the client is at the bottom of the chat box
    var atBottom = roomChatContent.scrollTop == roomChatContent.scrollHeight - roomChatContent.clientHeight;

    // add new message to the chat box
    roomChatContent.appendChild(toHTMLMessage(username, msg));

    if (roomChatWrapper.style.display != "block") {
        // update unread message
        unreadRoomChatCnt++;
        unreadRoomChat.innerText = unreadRoomChatCnt;
    } else if (atBottom) {
        // scroll to bottom after adding new message
        roomChatContent.scrollTop = roomChatContent.scrollHeight - roomChatContent.clientHeight;
    }
});

socket.on("join-room-result", (errorCode) => {
    if(errorCode == 0)
    {
        closeJoinRoomWrapper();
    }
    updateJoinError(errorCode); 
});

socket.on("leaderboard-result", (result) => {
    var players = JSON.parse(result);
    updateLeaderboard(players);
});

socket.on("friend-request-result", (resultCode) => {
    console.log(resultCode);
});

socket.on("load-friends", (list) => {
    var players = JSON.parse(list);
    updateFriend(players);
});

loginBox.onsubmit = () => { 
    login(socket);
    return false;
};

registrationBox.onsubmit = () => {
    register(socket);
    return false;
};

forgetBox.onsubmit = () => {
    forget(socket);
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

joinBox.onsubmit = () => {
    joinRoom(socket);
    return false;
};

roomChatBox.onsubmit = () => {
    roomChat(socket);
    return false;
};

leaderboardBox.onsubmit = () => {
    searchRanking(socket);
    return false;
};

friendBox.onsubmit = () => {
    addFriend(socket);
    return false;
};

openRoomBtn.addEventListener("click", () => {
    openRoom(socket);
});

leaveBtn.addEventListener("click", () => {
    leaveRoom(socket);
});

spectateBtn.addEventListener("click", () => {
    spectate(socket);
});

playBtn.addEventListener("click", () => {
    play(socket);
});

leaderboardBtn.addEventListener("click", () => {
    showLeaderboard(socket);
});

friendBtn.addEventListener("click", () => {
    showFriend(socket);
});
// })();

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

const forget = (socket) => {
    // get user input
    var username = forgetBox.querySelector("input[name='username']").value;

    socket.emit("forget-password", JSON.stringify({username: username}));
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

const joinRoom = (socket) => {
    var roomId = joinBox.querySelector("input[name='roomId']").value;
    socket.emit("join-room", roomId);
};

const openRoom = (socket) => {
    socket.emit("open-room");
};

const leaveRoom = (socket) => {
    roomWrapper.style.display = "none";
    socket.emit("leave-room");
    updateRoomState(null);
};

const spectate = (socket) => {
    socket.emit("spectate");
};

const play = (socket) => {
    socket.emit("play");
};

const roomChat = (socket) => {
    var msg = roomChatBox.querySelector("input[name='message']").value;
    roomChatBox.reset();
    socket.emit("room-chat", msg);
};

const showLeaderboard = (socket) => {
    socket.emit("get-leaderboard");
    leaderboard.innerHTML = "";
    leaderboardWrapper.style.display = "block";
};

const searchRanking = (socket) => {
    var username = leaderboardBox.querySelector("input[name='username']").value;
    socket.emit("search-ranking", username);
    leaderboardBox.reset();
};

const showFriend = (socket) => {
    socket.emit("get-friends");
    pendingList.innerHTML = "";
    requestList.innerHTML = "";
    friendList.innerHTML = "";
    blockList.innerHTML = "";
    friendWrapper.style.display = "block";
};

const addFriend = (socket) => {
    var username = friendBox.querySelector("input[name='username']").value;
    friendBox.reset();
    socket.emit("send-friend-request", JSON.stringify(username));
};