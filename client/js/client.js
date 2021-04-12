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
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const crystalsImg = document.getElementById("images");
const images = crystalsImg.getElementsByTagName("img");

// ==================================================================== //

// Session Storage of JTW
var sessionToken;

// User Information
var user;
var unreadRoomChatCnt = 0;
var friendNotificationCnt = 0;

// Game Storage
var roomstate;
var gamestate;

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

function updateGameBoard(state) {
    var gameWidth = gameBoard.clientWidth;
    var gameHeight = gameBoard.clientHeight;
    blockSize = Math.min(gameWidth / 8, gameHeight * 0.7 / 8);
    canvas.width = 8 * blockSize;
    canvas.height = 8 * blockSize;
    gamestate = state;
    boardDisplay(gamestate.chess_board);
}

function updateRoomState(state) {
    roomstate = state;
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
        updateGameBoard(state.gamestate);
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

socket.on("clockwise", (data) =>　{
    var {x, y, seed} = JSON.parse(data);
    Math.seedrandom(seed);
    clockwise(gamestate, x, y);
    boardDisplay();
});

socket.on("anti-clockwise", (data) =>　{
    var {x, y, seed} = JSON.parse(data);
    Math.seedrandom(seed);
    anticlockwise(gamestate, x, y);
    boardDisplay();
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

var blockSize;

var mouseIsDown = false;
var clickPos = {
    x: 0,
    y: 0
};

function getSelected() {
    if(!mouseIsDown) return {x: -8, y: -8};
    var x = parseInt(clickPos.x / blockSize);
    var y = parseInt(clickPos.y / blockSize);
    return {x: x, y: y};
}

function boardDisplay(chess_board = gamestate.chess_board) {
    ctx.globalAlpha = 1;
    for(var i = 0; i < chess_board.length; i++) {
        for(var j = 0; j < chess_board[i].length; j++) {
            if((i&1)^(j&1)) ctx.fillStyle = "#392613";
            else ctx.fillStyle = "#604020";
            ctx.fillRect(j * blockSize, i * blockSize, blockSize, blockSize);
            drawCrystal(j, i, chess_board[i][j]);
        }
    }
    var {x, y} = getSelected();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#ff6666";
    ctx.strokeRect(x * blockSize + 1, y * blockSize + 1, 2 * blockSize - 2, 2 * blockSize - 2);
    ctx.strokeRect(x * blockSize - 1, y * blockSize - 1, 2 * blockSize + 2, 2 * blockSize + 2);
    ctx.strokeStyle = "#ff0000";
    ctx.strokeRect(x * blockSize, y * blockSize, 2 * blockSize, 2 * blockSize);
    ctx.globalAlpha = 0.75;
    ctx.drawImage(images[9], x * blockSize + 0.5 * blockSize, y * blockSize, 1.5 * blockSize, blockSize);
    ctx.drawImage(images[10], x * blockSize, y * blockSize + 0.5 * blockSize, blockSize, 1.5 * blockSize);
}

function drawCrystal(x, y, number) {
    ctx.drawImage(getCrystal(number), x * blockSize, y * blockSize, blockSize, blockSize);
}

function getCrystal(number) {
    if(number < 1 || number > 8) return images[0];
    return images[number];
}

canvas.addEventListener("mousedown", (e) => {
    if(roomstate.players[gamestate.now_player].id != user.id) return;
    if(mouseIsDown) return;
    clickPos.x = e.x - canvas.offsetLeft;
    clickPos.y = e.y - canvas.offsetTop;
    mouseIsDown = true;
    var {x, y} = getSelected();
    if(x == 7 || y == 7) {
        mouseIsDown = false;
        return;
    }
    boardDisplay();
});

canvas.addEventListener("mouseup", (e) => {
    if(!mouseIsDown) return;
    mouseIsDown = false;
    boardDisplay();
});

canvas.addEventListener("mousemove", (e) => {
    if(!mouseIsDown) return;
    var {x, y} = getSelected();
    var curX = e.x - canvas.offsetLeft;
    var curY = e.y - canvas.offsetTop;
    if(curX > clickPos.x + blockSize * 0.6) {
        mouseIsDown = false;
        socket.emit("clockwise", JSON.stringify({x: x, y: y}));
        boardDisplay();
    }
    else if(curY > clickPos.y + blockSize * 0.6) {
        mouseIsDown = false;
        socket.emit("anti-clockwise", JSON.stringify({x: x, y: y}));
        boardDisplay();
    }
});

canvas.addEventListener("touchstart", (e) => {
    if(roomstate.players[gamestate.now_player].id != user.id) return;
    if(mouseIsDown) return;
    clickPos.x = e.touches[0].clientX - canvas.offsetLeft;
    clickPos.y = e.touches[0].clientY - canvas.offsetTop;
    mouseIsDown = true;
    boardDisplay();
});

canvas.addEventListener("touchend", (e) => {
    if(!mouseIsDown) return;
    mouseIsDown = false;
    boardDisplay();
});

canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    if(!mouseIsDown) return;
    var {x, y} = getSelected();
    var curX = e.touches[0].clientX - canvas.offsetLeft;
    var curY = e.touches[0].clientY - canvas.offsetTop;
    if(curX > clickPos.x + blockSize * 0.6) {
        mouseIsDown = false;
        socket.emit("clockwise", JSON.stringify({x: x, y: y}));
        boardDisplay();
    }
    else if(curY > clickPos.y + blockSize * 0.6) {
        mouseIsDown = false;
        socket.emit("anti-clockwise", JSON.stringify({x: x, y: y}));
        boardDisplay();
    }
});

function initDissolveValue() {
    var dissolve_value =
    {
        attack_increase : 0,
        defence_increase : 0,
        HP_increase : 0,
        attack_times : 0.0,
    };
    return dissolve_value;
}

function boardGenerate()
{
    var chess_board = [];
    for (var i = 0; i < 8; i++) 
    {
        chess_board.push([]);
        for (var j = 0; j < 8; j++)
        {
            chess_board[i][j] = crystalGenerate();
        }
    }
    check_dissolve(chess_board);
    return chess_board;
}

function crystalGenerate()
{	
	var testis = Math.trunc(Math.random() * 1000)+1;
	//document.write(testis + " ");
	if (1 <= testis && testis  <= 25)
		return 1;
	else if (26 <= testis && testis  <= 50)
		return 2;
	else if (51 <= testis && testis  <= 70)
		return 3;
	else if (71 <= testis && testis  <= 100)
		return 4;
	else if (101 <= testis && testis  <= 325)
		return 5;
	else if (326 <= testis && testis  <= 550)
		return 6;
	else if (551 <= testis && testis  <= 730)
		return 7;
	else if (731 <= testis && testis  <= 1000)
		return 8;
}

function check_dissolve(chess_board, dissolve_value) //new
{
    var dissolve_value = initDissolveValue();
	// var not_dissolve = true;
	// boardDisplay(chess_board);
	var comboround;
	var dissolved=0;
	
	do
	{
		comboround = dissolved;
		dissolved = dissolve(chess_board, dissolved, dissolve_value);
		comboround -= dissolved;
		if (comboround != 0)
		{
			// not_dissolve = false; //mew!
			// document.write("Dissolved! <br><br>");
			// boardDisplay(chess_board);
			fall(chess_board);
			fill(chess_board);
			// document.write("<br>Fall and Fill!!<br><br>");
			// boardDisplay(chess_board);
			// document.write("now combo: " + dissolved + "<br>");
		}
	} while (comboround != 0);
	Math.round(dissolve_value.attack_increase *= 1 + (dissolved -1 ) * 0.2);
	Math.round(dissolve_value.defence_increase *= 1 + (dissolved -1 ) * 0.2);
	Math.round(dissolve_value.HP_increase *= 1 + (dissolved -1 ) * 0.2);
	//document.write(dissolve_value.attack_increase + "<br>" + dissolve_value.defence_increase + "<br>", dissolve_value.HP_increase + "<br>" + dissolve_value.attack_times + "<br><br>");
	// return {unchanged: not_dissolve, dissolve_value: dissolve_value}; // meow!
    return dissolve_value;
}

function dissolve(chess_board, combo, dissolve_value) {
    var A = Array(10).fill().map(() => Array(10).fill(0));
    var B = Array(10).fill().map(() => Array(10).fill(0));
    var C = Array(10).fill().map(() => Array(10).fill(0));
    var D = Array(10).fill().map(() => Array(10).fill(0));
    var E = Array(10).fill().map(() => Array(10).fill(0));

    for (var i=0;i<8;i++) {
        for (var j=0;j<8;j++) {
            var tmp = Math.trunc((chess_board[i][j] - 1) / 4) * ((chess_board[i][j] - 1) % 4 + 1);
            if (tmp==0) A[i][j] = 1;
            if (tmp==1) B[i][j] = 1;
            if (tmp==2) C[i][j] = 1;
            if (tmp==3) D[i][j] = 1;
            if (tmp==4) E[i][j] = 1;
        }
    }
    
    for (var i=0;i<8;i++)
     {
         for (var j=0;j<8;j++)
         {
             if (Math.abs(A[i][j])==1 && Math.abs(A[i][j+1])==1 && Math.abs(A[i][j+2])==1)
             {
                 A[i][j]=-1;
                 A[i][j+1]=-1;
                 A[i][j+2]=-1;
             }
            if (Math.abs(B[i][j])==1 && Math.abs(B[i][j+1])==1 && Math.abs(B[i][j+2])==1)
             {
                 B[i][j]=-1;
                 B[i][j+1]=-1;
                 B[i][j+2]=-1;
             }
             if (Math.abs(C[i][j])==1 && Math.abs(C[i][j+1])==1 && Math.abs(C[i][j+2])==1)
             {
                 C[i][j]=-1;
                 C[i][j+1]=-1;
                 C[i][j+2]=-1;
             }
             if (Math.abs(D[i][j])==1 && Math.abs(D[i][j+1])==1 && Math.abs(D[i][j+2])==1)
             {
                 D[i][j]=-1;
                 D[i][j+1]=-1;
                 D[i][j+2]=-1;
             }
             if (Math.abs(E[i][j])==1 && Math.abs(E[i][j+1])==1 && Math.abs(E[i][j+2])==1)
             {
                 E[i][j]=-1;
                 E[i][j+1]=-1;
                 E[i][j+2]=-1;
             }
         }
     }
     for (var j=0;j<8;j++)
     {
         for (var i=0;i<8;i++)
         {
             if (Math.abs(A[i][j])==1 && Math.abs(A[i+1][j])==1 && Math.abs(A[i+2][j])==1)
             {
                 A[i][j]=-1;
                 A[i+1][j]=-1;
                 A[i+2][j]=-1;
             }
            if (Math.abs(B[i][j])==1 && Math.abs(B[i+1][j])==1 && Math.abs(B[i+2][j])==1)
             {
                 B[i][j]=-1;
                 B[i+1][j]=-1;
                 B[i+2][j]=-1;
             }
             if (Math.abs(C[i][j])==1 && Math.abs(C[i+1][j])==1 && Math.abs(C[i+2][j])==1)
             {
                 C[i][j]=-1;
                 C[i+1][j]=-1;
                 C[i+2][j]=-1;
             }
             if (Math.abs(D[i][j])==1 && Math.abs(D[i+1][j])==1 && Math.abs(D[i+2][j])==1)
             {
                 D[i][j]=-1;
                 D[i+1][j]=-1;
                 D[i+2][j]=-1;
             }
             if (Math.abs(E[i][j])==1 && Math.abs(E[i+1][j])==1 && Math.abs(E[i+2][j])==1)
             {
                 E[i][j]=-1;
                 E[i+1][j]=-1;
                 E[i+2][j]=-1;
             }
         }
     }
    for (var i=0;i<8;i++) {
        for (var j=0;j<8;j++) {
            if (A[i][j]!=-1) A[i][j] = 0;
            if (B[i][j]!=-1) B[i][j] = 0;
            if (C[i][j]!=-1) C[i][j] = 0;
            if (D[i][j]!=-1) D[i][j] = 0;
            if (E[i][j]!=-1) E[i][j] = 0;
        }
    }
    
    /*
    for (var i = 0; i < 10; i++)
    {
        for (var j = 0; j < 10; j++)
            document.write(A[i][j] + "   ");
        document.write("<br>");
    }
    document.write("<br>");
    for (var i = 0; i < 10; i++)
    {
        for (var j = 0; j < 10; j++)
            document.write(B[i][j] + "   ");
        document.write("<br>");
    }
    document.write("<br>");
    for (var i = 0; i < 10; i++)
    {
        for (var j = 0; j < 10; j++)
            document.write(C[i][j] + "   ");
        document.write("<br>");
    }
    document.write("<br>");
    for (var i = 0; i < 10; i++)
    {
        for (var j = 0; j < 10; j++)
            document.write(D[i][j] + "   ");
        document.write("<br>");
    }
    document.write("<br>");
    for (var i = 0; i < 10; i++)
    {
        for (var j = 0; j < 10; j++)
            document.write(E[i][j] + "   ");
        document.write("<br>");
    }
    */
    //sunny
    var total_com = 0;
    total_com = each_type_combo(A, chess_board, total_com, dissolve_value);
    total_com = each_type_combo(B, chess_board, total_com, dissolve_value);
    total_com = each_type_combo(C, chess_board, total_com, dissolve_value);
    total_com = each_type_combo(D, chess_board, total_com, dissolve_value);
    total_com = each_type_combo(E, chess_board, total_com, dissolve_value);
    return total_com + combo;
}

function each_type_combo(A, chess_board, total_com, dissolve_value)
{
	var combo = 0;
	for (var i = 0; i <= 7; i++)
		for (var j = 0; j <= 7; j++)
		{
			if (A[i][j] == -1)
			{
				var crystal_in_combo = [0, 0, 0, 0, 0]; // [0]: no. of crystal [1]: attack type [2]: def type [3]: HP type [4]: attack times, note that enchanted one will be double counted in [1-4]
				A[i][j] = ++combo;
				crystal_in_combo[(chess_board[i][j]-1) % 4 + 1] += 1 + -1 * (Math.trunc((chess_board[i][j]-1) / 4) - 1); // detect the type in array (no. of crystals), enchanted bonus will also be counted in 1-4
				chess_board[i][j] = -1;		//dissolved in board
				crystal_in_combo[0] = 1; //ACTUAL number of crystals, note that NO enchanted bonus is counted
				each_type_combo_recursion(A, chess_board, combo, crystal_in_combo, i, j);	//detect the neighbours can be dissolved or not
				// document.write("Crystal in combo = " + crystal_in_combo[0] + "   Attack crystal = " + crystal_in_combo[1] + "   Defence crystal = " + crystal_in_combo[2] + "   HP crystal = " + crystal_in_combo[3] + "   Attack times crystal = " + crystal_in_combo[4] + "<br>");
				dissolve_value.attack_increase += (0.25 + crystal_in_combo[0] * 0.25)  * crystal_in_combo[1] * 5; //bonus for dissolve 4 or above in a row * base number
				dissolve_value.defence_increase += (0.25 + crystal_in_combo[0] * 0.25) * crystal_in_combo[2] * 5;
				dissolve_value.HP_increase += (0.25 + crystal_in_combo[0] * 0.25) * crystal_in_combo[3] * 100;
				dissolve_value.attack_times += (0.25 + crystal_in_combo[0] * 0.25) * crystal_in_combo[4] * 0.33333334;
			}
			
		}
	return combo + total_com;
}

function each_type_combo_recursion(A,chess_board,this_com, crystal_in_combo,i, j)
{
    //document.write("br");
	if (i-1 >= 0 && A[i-1][j] == -1)
	{
		
		A[i-1][j] = this_com;
		crystal_in_combo[(chess_board[i-1][j]-1) % 4 + 1] += 1 + -1 * (Math.trunc((chess_board[i-1][j]-1) / 4) - 1);
		chess_board[i-1][j] = -1;
		crystal_in_combo[0]++;
		each_type_combo_recursion(A, chess_board, this_com, crystal_in_combo, i-1, j);
	}
	
	if (j-1 >= 0 && A[i][j-1] == -1)
	{
		A[i][j-1] = this_com;
		crystal_in_combo[(chess_board[i][j-1]-1) % 4 + 1] += 1 + -1 * (Math.trunc((chess_board[i][j-1]-1) / 4) - 1);
		chess_board[i][j-1] = -1;
		crystal_in_combo[0]++;
		each_type_combo_recursion(A, chess_board, this_com, crystal_in_combo, i, j-1);
	}
	
	if (i+1 <= 7 && A[i+1][j] == -1)
	{
		A[i+1][j] = this_com;
		crystal_in_combo[(chess_board[i+1][j]-1) % 4 + 1] += 1 + -1 * (Math.trunc((chess_board[i+1][j]-1) / 4) - 1);
		chess_board[i+1][j] = -1;
		crystal_in_combo[0]++;
		each_type_combo_recursion(A, chess_board, this_com, crystal_in_combo, i+1, j);
	}
	
	if (j+1 <= 7 && A[i][j+1] == -1)
	{
		A[i][j+1] = this_com;
		crystal_in_combo[(chess_board[i][j+1]-1) % 4 + 1] += 1 + -1 * (Math.trunc((chess_board[i][j+1]-1) / 4) - 1);
		chess_board[i][j+1] = -1;
		crystal_in_combo[0]++;
		each_type_combo_recursion(A, chess_board, this_com, crystal_in_combo, i, j+1);
	}
	
}

function fill(chess_board)
{
	for (var i = 7; i >= 0; i--)
		for (var j = 7; j >= 0; j--)
		{
			if (chess_board[i][j] == -1)
				chess_board[i][j] = crystalGenerate();
		}
}

function fall(chess_board)
{
	for (var i = 6; i >= 0; i--)
		for (var j = 7; j >= 0; j--)
		{
			var placex = j;
			var placey = i;
			while ((placey+1 <= 7) && (chess_board[placey+1][placex] == -1))
			{
			    var temp = chess_board[placey][placex];
				chess_board[placey][placex] = chess_board[placey+1][placex];
				chess_board[placey+1][placex] = temp;
				placey++;
			}
		}		
}

function clockwise(gamestate, pointx, pointy)
{
    if(pointx < 0 || pointx > 7) return false;
    if(pointy < 0 || pointy > 7) return false;
    var chess_board = gamestate.chess_board;
	var moveO =  chess_board[pointy+1][pointx], moveR = chess_board[pointy][pointx], moveD = chess_board[pointy+1][pointx+1], moveRD = chess_board[pointy][pointx+1];
	chess_board[pointy][pointx] = moveO;
	chess_board[pointy+1][pointx] = moveD;
	chess_board[pointy][pointx+1] = moveR;
	chess_board[pointy+1][pointx+1] = moveRD;
    var dissolve_value = check_dissolve(chess_board);
    attack_exec(gamestate, dissolve_value);
    gamestate.now_player ^= 1;
}

function anticlockwise(gamestate, pointx, pointy)
{
    if(pointx < 0 || pointx > 7) return false;
    if(pointy < 0 || pointy > 7) return false;
    var chess_board = gamestate.chess_board;
	var moveO = chess_board[pointy][pointx+1], moveR = chess_board[pointy+1][pointx+1], moveD = chess_board[pointy][pointx], moveRD = chess_board[pointy+1][pointx];
	chess_board[pointy][pointx] = moveO;
	chess_board[pointy+1][pointx] = moveD;
	chess_board[pointy][pointx+1] = moveR;
	chess_board[pointy+1][pointx+1] = moveRD;
    var dissolve_value = check_dissolve(chess_board);
    attack_exec(gamestate, dissolve_value);
    gamestate.now_player ^= 1;
}

function attack_exec(gamestate, dissolve_value) {
    var player = gamestate.player;
    var now_player = gamestate.now_player;
	dissolve_value.HP_increase = Math.min(dissolve_value.HP_increase, player[now_player].HP_limit - player[now_player].HP); //new bz of HP limit
	//cout << "Attack increase: " << dissolve_value.attack_increase << "\tDefence increase: "<< dissolve_value.defence_increase << "\tHP_increase: " << dissolve_value.HP_increase << "\tTotal Damage: " << round(1000.0 / (player[(now_player-1)*-1].defence + 1000.0 ) * player[now_player].attack * dissolve_value.attack_times) << endl << endl; //new!
	player[now_player].attack = Math.trunc(player[now_player].attack + dissolve_value.attack_increase);
	player[now_player].defence = Math.trunc(player[now_player].defence + dissolve_value.defence_increase);
	player[now_player].HP = Math.trunc(player[now_player].HP + dissolve_value.HP_increase);
	player[(now_player-1)*-1].HP = Math.trunc(player[(now_player-1)*-1].HP - 1000.0 / (player[(now_player-1)*-1].defence + 1000.0 ) * player[now_player].attack * dissolve_value.attack_times);
}