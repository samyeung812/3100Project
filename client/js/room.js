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

function updateRoomState(state) {
    roomstate = state;
    playersInfo.innerHTML = "";
    spectatorsInfo.innerHTML = "";
    if(!state) {
        showMenu();
        roomWrapper.style.display = "none";
        roomChatContent.innerHTML = "";
        statsUpdate.innerHTML = "";
        return;
    }

    if(state.start) {
        roomWrapper.style.display = "none";
        showGameBoard();
        gamestate = state.gamestate;
        updateGameBoard(state.gamestate);
        return;
    } else {
        showMenu();
        statsUpdate.innerHTML = "";
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

roomChatBox.onsubmit = () => {
    roomChat(socket);
    return false;
};

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