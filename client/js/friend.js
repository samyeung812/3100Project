closeFriendBtn.addEventListener("click", closeFriend);
function closeFriend() {
    friendWrapper.style.display = "none";
    requestList.innerHTML = "";
    pendingList.innerHTML = "";
    friendList.innerHTML = "";
    blockList.innerHTML = "";
    friendBox.reset();
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
        btn.innerText = "🚫";
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

friendBox.onsubmit = () => {
    addFriend(socket);
    return false;
};

friendBtn.addEventListener("click", () => {
    showFriend(socket);
});

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