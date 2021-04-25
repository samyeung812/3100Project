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

function updateJoinError(errorCode) {
    joinError.innerText = "";
    if (errorCode & 1) {
        joinError.innerText += "Invalid Room ID";
    } else if (errorCode & 2) {
        joinError.innerText += "The Room Is Fulled";
    }
}

socket.on("join-room-result", (errorCode) => {
    if(errorCode == 0)
    {
        closeJoinRoomWrapper();
    }
    updateJoinError(errorCode); 
});

joinBox.onsubmit = () => {
    joinRoom(socket);
    return false;
};

const joinRoom = (socket) => {
    var roomId = joinBox.querySelector("input[name='roomId']").value;
    socket.emit("join-room", roomId);
};