// =================  Components in Login Page  ================= //
const loginPage = document.getElementById("login-page");

// Login Form
const loginWrapper = document.getElementById("login-wrapper");
const loginBox = document.getElementById("login-box");
const loginUsernameError = document.getElementById("login-username-error");
const loginPasswordError = document.getElementById("login-password-error")
const createBtn = document.getElementById("create-button");
const forgetBtn = document.getElementById("forget-button");

// Registration Form
const registrationWrapper = document.getElementById("registration-wrapper");
const registrationBox = document.getElementById("registration-box");
const registerUsernameError = document.getElementById("register-username-error");
const registerPasswordError = document.getElementById("register-password-error");
const registerEmailError = document.getElementById("register-email-error");
const registerConfirmPasswordError = document.getElementById("register-confirm-password-error");

const closeCreateBtn = document.getElementById("close-create-button");

// Forget Form
const forgetWrapper = document.getElementById("forget-wrapper");
const forgetBox = document.getElementById("forget-box");
const forgetUsernameError = document.getElementById("forget-username-error");
const closeForgetBtn = document.getElementById("close-forget-button");

// =================  Components in Home Page  ================= //
const homePage = document.getElementById("home-page");

// Main Menu
const menuWrapper = document.getElementById("menu-wrapper");
const rankingBtn = document.getElementById("ranking-button");
const openRoomBtn = document.getElementById("open-button");
const joinBtn = document.getElementById("join-button");
const leaderboardBtn = document.getElementById("leaderboard-button");
const battlelogBtn = document.getElementById("battlelog-button");
const friendBtn = document.getElementById("friend-button");
const friendNotification = document.getElementById("friend-notification");
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
const changeNewPasswordError = document.getElementById("change-new-password-error");
const changePasswordError = document.getElementById("change-password-error");
const changeConfirmPasswordError = document.getElementById("change-confirm-password-error")
const closeChangePasswordBtn = document.getElementById("close-change-password-button");

// Change Email Form
const changeEmailWrapper = document.getElementById("change-email-wrapper");
const changeEmailBox = document.getElementById("change-email-box");
const changeEmailError = document.getElementById("change-email-error");
const changeEmailPasswordError = document.getElementById("change-email-password-error");
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
const joinError = document.getElementById("join-error");
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

// Battlelog
const battlelogWrapper = document.getElementById("battlelog-wrapper");
const battlelogBox = document.getElementById("battlelog-box");
const battlelog = document.getElementById("battlelog");
const closeBattlelogBtn = document.getElementById("close-battlelog-button");

// Friend
const friendWrapper = document.getElementById("friend-wrapper");
const friendBox = document.getElementById("friend-box");
const pendingList = document.getElementById("pending-list");
const requestList = document.getElementById("request-list");
const friendList = document.getElementById("friend-list");
const blockList = document.getElementById("block-list");
const closeFriendBtn = document.getElementById("close-friend-button");

// Private Chat
const privateChatWrapper = document.getElementById("private-chat-wrapper");
const privateChatBox = document.getElementById("private-chat-box");
const privateChatName = document.getElementById("private-chat-name");
const closePrivateChatBtn = document.getElementById("close-private-chat-button");
const privateChatContent = document.getElementById("private-chat-content");

// Ranking Mode
const rankingWrapper = document.getElementById("ranking-wrapper");
const closeRankingModeBtn = document.getElementById("close-ranking-mode-button");

// Game Board
const gameBoard = document.getElementById("game-board");

// ==================================================================== //

// Session Storage of JTW
var sessionToken;
var user;
var unreadRoomChatCnt = 0;
var friendNotificationCnt = 0;

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
    joinError.innerText = "";
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

closePrivateChatBtn.addEventListener("click", closePrivateChat);
function closePrivateChat() {
    privateChatContent.innerHTML = "";
    privateChatBox.setAttribute("targetid", "");
    privateChatWrapper.style.display = "none";
    privateChatBox.reset();
}

closeLeaderboardBtn.addEventListener("click", closeLeaderboard);
function closeLeaderboard() {
    leaderboardWrapper.style.display = "none";
    leaderboard.innerHTML = "";
    leaderboardBox.reset();
}

closeBattlelogBtn.addEventListener("click", closeBattlelog);
function closeBattlelog() {
    battlelogWrapper.style.display = "none";
    battlelog.innerHTML = "";
    battlelogBox.reset();
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
    gameBoard.style.display = "none";
}

// Show Game Board and Hide Main Menu
function showGameBoard() {
    menuWrapper.style.display = "none";
    gameBoard.style.display = "block";
}

// Get Cookie by Name
function getCookie (name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

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

function updateRegistrationError(errorCode) {
    // error code: 1 for invalid username, 2 for invalid password, 4 for invalid email,
    //             8 for sql connection error, 16 for duplicated username, 32 for incorrect password,
    //             64 for non-existing username, 128 for unmatch confirm password
    if (errorCode & 1 || errorCode & 16) {
        if(errorCode & 1) {
            registerUsernameError.innerText = "Invalid username format!";
        } else {
            registerUsernameError.innerText = "The username has already registered!";
        }
    } else {
        registerUsernameError.innerText = "";
    }
    
    if (errorCode & 2) {
        registerPasswordError.innerText = "Invalid password format!";
    } else {
        registerPasswordError.innerText = "";
    }

    if (errorCode & 4) {
        registerEmailError.innerText = "Invalid email format!";
    } else {
        registerEmailError.innerText = "";
    }

    if (errorCode & 128) {
        registerConfirmPasswordError.innerText = "The password does not match!";
    } else {
        registerConfirmPasswordError.innerText = "";
    }
}

function updateForgetError(errorCode) {
    if(errorCode > 0) {
        ForgetUsernameError.innerText = "Invalid username";
    } else {
        forgetUsernameError.innerText = "";
    }
}

function updateChangePasswordError(errorCode) {
    // error code: 1 for invalid username, 2 for invalid password, 4 for invalid email,
    //             8 for sql connection error, 16 for duplicated username, 32 for incorrect password,
    //             64 for non-existing username, 128 for unmatch confirm password
    if(errorCode & 2) {
        changeNewPasswordError.innerText = "Invalid password format!";
    } else {
        changeNewPasswordError.innerText = "";
    }
    
    if(errorCode & 32) {
        changePasswordError.innerText = "Incorrect password!";
    } else {
        changePasswordError.innerText = "";
    }

    if (errorCode & 128) {
        changeConfirmPasswordError.innerText = "The password does not match!";
    } else {
        changeConfirmPasswordError.innerText = "";
    }
}

function updateChangeEmailError(errorCode) {
    // error code: 1 for invalid username, 2 for invalid password, 4 for invalid email,
    //             8 for sql connection error, 16 for duplicated username, 32 for incorrect password,
    //             64 for non-existing username, 128 for unmatch confirm password
    if(errorCode & 4) {
        changeEmailError.innerText = "Invalid email format!";
    } else {
        changeEmailError.innerText = "";
    }

    if(errorCode & 32) {
        changeEmailPasswordError.innerText = "Incorrect password!";
    } else {
        changeEmailPasswordError.innerText = "";
    }
}

function updateJoinError(errorCode) {
    joinError.innerText = "";
    if (errorCode & 1) {
        joinError.innerText += "Invalid Room ID";
    } else if (errorCode & 2) {
        joinError.innerText += "The Room Is Fulled";
    }
}

function updateRoomState(state) {
    console.log(state);
    playersInfo.innerHTML = "";
    spectatorsInfo.innerHTML = "";
    if(!state) {
        showMenu();
        roomWrapper.style.display = "none";
        roomChatContent.innerHTML = "";
        return;
    }

    if(state.start) {
        roomWrapper.style.display = "none";
        showGameBoard();
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
    leaderboard.innerHTML = "<div class='grid-container'><div>Username</div><div>Ranking</div></div>";

    players.forEach(player => {
        var outterDiv = document.createElement("div");
        outterDiv.className = "grid-container";
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

function updateBattlelog(results) {
    battlelog.innerHTML = "<div class='grid-container'><div>You</div><div>Opponent</div><div>Ranked</div><div>Result</div><div>Rank Changed</div></div>";
    results.forEach(result => {
        var outterDiv = document.createElement("div");
        outterDiv.className = "grid-container";
        var div = document.createElement("div");
        div.className = "username";
        div.innerText = result.you;
        outterDiv.appendChild(div);

        div = document.createElement("div");
        div.innerText = result.opponent;
        outterDiv.appendChild(div);
        
        div = document.createElement("div");
        div.innerText = result.ranked > 0 ? "✔" : "✖";
        outterDiv.appendChild(div);
        
        div = document.createElement("div");
        div.innerText = result.win > 0 ? "👑" : "💀";
        outterDiv.appendChild(div);
        
        div = document.createElement("div");
        div.innerText = result.ranked > 0 ? (result.rankchange) : "---";
        outterDiv.appendChild(div);
        
        battlelog.appendChild(outterDiv);
    });
}

function updateFriend(players) {
    friendNotificationCnt = 0;
    var pending = [], request = [], friend = [], block = [];
    players.forEach(player => {
        friendNotificationCnt += player.unread;
        var smaller = user.id < player.userid;
        if(player.status == 0) {
            friend.push(player);
        } else if (player.status == 1) {
            if(smaller) {
                pending.push(player);
            } else {
                request.push(player);
            }
        } else if(player.status == 2) {
            if(smaller) {
                request.push(player);
            } else {
                pending.push(player);
            }
        } else if((player.status == 3 && smaller) || (player.status == 4 && !smaller)) {
            block.push(player);
        } else if(player.status == 5) {
            block.push(player);
        }
    });
    friendNotificationCnt += request.length;
    updatePendingList(pending);
    updateRequestList(request);
    updateFriendList(friend);
    updateBlockList(block);
    friendNotification.innerText = friendNotificationCnt > 0 ? friendNotificationCnt : "";
}

function updatePendingList(players) {
    pendingList.innerHTML = "";
    if(players.length > 0) {
        var span = document.createElement("span");
        span.innerText = "Pending List";
        pendingList.appendChild(span);
    }
    players.forEach(player => {
        var outterDiv = document.createElement("div");
        outterDiv.className = "grid-container pending-content";
        var div = document.createElement("div");
        var span = document.createElement("span");
        span.className = "state " + getStateName(player.state);
        div.appendChild(span);
        div.appendChild(document.createTextNode(player.username));
        outterDiv.appendChild(div);

        div = document.createElement("div");
        div.className = "optionBox";
        var btn = document.createElement("span");
        // btn.type = "button";
        btn.innerText = "✖";
        btn.className = "option deny";
        btn.onclick = () => {
            socket.emit("cancel-friend-request", JSON.stringify(player.userid));
        };
        div.appendChild(btn);

        outterDiv.appendChild(div);
        pendingList.appendChild(outterDiv);
    });
}

function updateRequestList(players) {
    requestList.innerHTML = "";
    if(players.length > 0) {
        var span = document.createElement("span");
        span.innerText = "Request List";
        requestList.appendChild(span);
    }
    players.forEach(player => {
        var outterDiv = document.createElement("div");
        outterDiv.className = "grid-container request-content";
        var div = document.createElement("div");
        var span = document.createElement("span");
        span.className = "state " + getStateName(player.state);
        div.appendChild(span);
        div.appendChild(document.createTextNode(player.username));
        outterDiv.appendChild(div);

        div = document.createElement("div");
        div.className = "optionBox";
        
        var btn = document.createElement("span");
        // btn.type = "button";
        btn.innerText = "✔";
        btn.className = "option accept";
        btn.onclick = () => {
            socket.emit("accept-friend-request", JSON.stringify(player.userid));
        };
        div.appendChild(btn);
        
        btn = document.createElement("span");
        // btn.type = "button";
        btn.innerText = "✖";
        btn.className = "option deny";
        btn.onclick = () => {
            socket.emit("deny-friend-request", JSON.stringify(player.userid));
        };
        div.appendChild(btn);
        
        outterDiv.appendChild(div);
        requestList.appendChild(outterDiv);
    });
}

function updateFriendList(players) {
    friendList.innerHTML = "";
    if(players.length > 0) {
        var span = document.createElement("span");
        span.innerText = "Friend List";
        friendList.appendChild(span);
    }
    players.forEach(player => {
        var outterDiv = document.createElement("div");
        outterDiv.className = "grid-container pending-content";

        var div = document.createElement("div");
        var span = document.createElement("span");
        span.className = "state " + getStateName(player.state);
        div.appendChild(span);
        div.appendChild(document.createTextNode(player.username));
        div.innerHTML += ` <span>(${player.ranking})</span>`;
        outterDiv.appendChild(div);

        div = document.createElement("div");
        div.className = "optionBox";
        
        var btn = document.createElement("span");
        if(player.state == 2 || player.state == 4) {
            btn.innerText = "👁";
            btn.className = "option chat";
            btn.onclick = () => {
                socket.emit("spectate-friend", player.userid);
            };
            div.append(btn);
            btn = document.createElement("span");
        }
        // btn.type = "button";
        btn.innerText = "🗨";
        btn.className = "option chat";
        var notificationDiv = document.createElement("span");
        notificationDiv.className = "message-count";
        notificationDiv.innerText = (player.unread > 0 ? player.unread : "");
        btn.appendChild(notificationDiv);
        btn.onclick = () => {
            friendNotificationCnt -= parseInt(notificationDiv.innerText || 0);
            friendNotification.innerText = friendNotificationCnt > 0 ? friendNotificationCnt : "";
            notificationDiv.innerText = "";
            socket.emit("get-private-message", JSON.stringify(player.userid));
            privateChatBox.setAttribute("targetid", player.userid);
            privateChatName.innerText = player.username;
        };
        div.appendChild(btn);

        btn = document.createElement("span");
        // btn.type = "button";
        btn.innerText = "✖";
        btn.className = "option cross";
        btn.onclick = () => {
            socket.emit("unfriend-user", JSON.stringify(player.userid));
        };
        div.appendChild(btn);

        btn = document.createElement("span");
        // btn.type = "button";
        btn.innerText = "🛇"
        btn.className = "option block";
        btn.onclick = () => {
            socket.emit("block-user", JSON.stringify(player.userid));
        };
        div.appendChild(btn);

        outterDiv.appendChild(div);
        friendList.appendChild(outterDiv);
    });
}

function updateBlockList(players) {
    blockList.innerHTML = "";
    if(players.length > 0) {
        var span = document.createElement("span");
        span.innerText = "Block List";
        blockList.appendChild(span);
    }
    players.forEach(player => {
        var outterDiv = document.createElement("div");
        outterDiv.className = "grid-container pending-content";
        var div = document.createElement("div");
        var span = document.createElement("span");
        span.className = "state " + getStateName(player.state);
        div.appendChild(span);
        div.appendChild(document.createTextNode(player.username));
        outterDiv.appendChild(div);

        div = document.createElement("div");
        div.className = "optionBox";
        var btn = document.createElement("span");
        // btn.type = "button";
        btn.innerText = "✖";
        btn.className = "option deny";
        btn.onclick = () => {
            socket.emit("unblock-user", JSON.stringify(player.userid));
        };
        div.appendChild(btn);

        outterDiv.appendChild(div);
        blockList.appendChild(outterDiv);
    });
}

function getStateName(state) {
    switch(state) {
        case 0:
            return "offline";
        case 1:
            return "online";
        case 2:
            return "inRoom";
        case 3:
            return "queue";
        case 4:
            return "playing";
        default:
            return "offline";
    }
}

function updatePrivateMessage(messages) {
    privateChatContent.innerHTML = "";
    messages.forEach(msg => {
        var div = document.createElement("div");
        div.innerText = msg.content;
        if(msg.fromid == user.id) div.className += "right";
        else div.className = "left";
        privateChatContent.appendChild(div);
    });
    privateChatWrapper.style.display = "block";
}

function showPopUpMessageBox(title, messages) {
    var wrapper = document.createElement("div");
    wrapper.className = "wrapper popup";
    wrapper.onclick = (e) => {
        if(e.target == wrapper) {
            wrapper.remove();
        }
    };
    var box = document.createElement("div");
    box.className = "box";
    var titleBox = document.createElement("div");
    titleBox.className = "title";
    titleBox.innerText = title;
    box.appendChild(titleBox);
    var msgBox = document.createElement("div");
    messages.forEach(message => {
        var div = document.createElement("div");
        div.innerText = message;
        msgBox.appendChild(div);
    });
    box.appendChild(msgBox);
    var btn = document.createElement("button");
    btn.innerText = "Close";
    btn.onclick = () => {
        wrapper.remove();
    };
    box.appendChild(btn);
    wrapper.appendChild(box);
    wrapper.style.display = "block";
    homePage.appendChild(wrapper);
}

function showRankingMode() {
    rankingWrapper.style.display = "block";
}

function closeRankingMode() {
    rankingWrapper.style.display = "none";
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
    showPopUpMessageBox("Error Message", ["Disconnected From Server!","Please Reload the Page!"]);
});

socket.on("popup-message", (data) => {
    var {title, messages} = JSON.parse(data);
    showPopUpMessageBox(title, messages);
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
    var loginPage = document.getElementById("login-page");
    if(loginPage) document.getElementsByTagName("body")[0].removeChild(document.getElementById("login-page"));
    homePage.style.display = "block";
    socket.emit("get-friends");
});

socket.on("room-state", (data) => {
    var state = JSON.parse(data);
    updateRoomState(state);
});

socket.on("room-started", () => {
    roomWrapper.style.display = "none";
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

socket.on("battlelog-result", (result) => {
    var battlelogResult = JSON.parse(result);
    updateBattlelog(battlelogResult);
});

socket.on("friend-request-result", (resultCode) => {
    // result code: 0 for request sent, 1 for sql connection error, 2 for invalid username, 4 for blocked user,
    //              8 for being blocked, 16 friend already, 32 for pending already, 64 for become friend
    var content = [];
    if(resultCode == 0) {
        content.push("Request sent!");
    }
    if(resultCode & 1) {
        content.push("Connection error!");
    }
    if(resultCode & 2) {
        content.push("Invalid username!");
    }
    if(resultCode & 4) {
        content.push("The user is blocked!");
    }
    if(resultCode & 8) {
        content.push("You are blocked by the user!");
    }
    if(resultCode & 16) {
        content.push("The user is your friend already!");
    }
    if(resultCode & 32) {
        content.push("You are pending already!");
    }
    if(resultCode & 64) {
        content.push("You guys are friend now!");
    }
    showPopUpMessageBox("Friend Request Result", content);
    socket.emit("get-friends");
});

socket.on("load-friends", (list) => {
    var players = JSON.parse(list);
    updateFriend(players);
});

socket.on("update-friends", () => {
    socket.emit("get-friends");
});

socket.on("update-private-chat", (data) => {
    var {fromid, toid} = JSON.parse(data);
    if(friendWrapper.style.display != "block") {
        friendNotificationCnt++;
        friendNotification.innerText = friendNotificationCnt > 0 ? friendNotificationCnt : "";
    } else {
        var targetId = parseInt(privateChatBox.getAttribute("targetid"));
        if(toid == targetId || fromid == targetId) {
            socket.emit("get-private-message", JSON.stringify(targetId));
        } else {
            socket.emit("get-friends");
        }
    }
});

socket.on("load-private-message", (data) => {
    var messages = JSON.parse(data);

    // check whether the client is at the bottom of the chat box
    var originalScroll = privateChatContent.scrollTop;
    var atBottom = privateChatContent.scrollTop == privateChatContent.scrollHeight - privateChatContent.clientHeight;

    // render the private chat box
    updatePrivateMessage(messages);
    
    // scroll to bottom after adding new message
    if(atBottom) privateChatContent.scrollTop = privateChatContent.scrollHeight - privateChatContent.clientHeight;
    else privateChatContent.scrollTop = originalScroll;
});

socket.on("ranking-match", (data) => {
    closeRankingMode();
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

battlelogBox.onsubmit = () => {
    searchBattlelog(socket);
    return false;
};

friendBox.onsubmit = () => {
    addFriend(socket);
    return false;
};

privateChatBox.onsubmit = () => {
    sendPrivateMessage(socket);
    return false;
}

rankingBtn.addEventListener("click", () => {
    ranking(socket);
});

closeRankingModeBtn.addEventListener("click", () => {
    closeRanking(socket);
});

openRoomBtn.addEventListener("click", () => {
    openRoom(socket);
});

leaveBtn.addEventListener("click", () => {
    leaveRoom(socket);
});

startBtn.addEventListener("click", () => {
    startRoom(socket);
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

battlelogBtn.addEventListener("click", () => {
    showBattlelog(socket);
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
    var email = registrationBox.querySelector("input[name='email']").value.toLowerCase();
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
    var email = changeEmailBox.querySelector("input[name='email']").value.toLowerCase();

    socket.emit("change-email", JSON.stringify({ password: password, email: email }));
};

const ranking = (socket) => {
    showRankingMode();
    socket.emit("ranking-mode");
};

const closeRanking = (socket) => {
    closeRankingMode();
    socket.emit("quit-ranking-mode");
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

const startRoom = (socket) => {
    socket.emit("start-room");
}

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

const showBattlelog = (socket) => {
    socket.emit("get-battlelog");
    battlelog.innerHTML = "";
    battlelogWrapper.style.display = "block";
};

const searchRanking = (socket) => {
    var username = leaderboardBox.querySelector("input[name='username']").value;
    socket.emit("search-ranking", username);
    leaderboardBox.reset();
};

const searchBattlelog = (socket) => {
    var username = battlelogBox.querySelector("input[name='username']").value;
    socket.emit("search-battlelog", username);
    battlelogBox.reset();
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

const sendPrivateMessage = (socket) => {
    var content = privateChatBox.querySelector("input[name='message']").value;
    var targetId = parseInt(privateChatBox.getAttribute("targetid"));
    privateChatBox.reset();
    socket.emit("send-private-message", JSON.stringify({targetId: targetId, content: content}));
};