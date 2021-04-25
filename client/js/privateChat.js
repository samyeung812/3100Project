closePrivateChatBtn.addEventListener("click", closePrivateChat);
function closePrivateChat() {
    privateChatContent.innerHTML = "";
    privateChatBox.setAttribute("targetid", "");
    privateChatWrapper.style.display = "none";
    privateChatBox.reset();
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

privateChatBox.onsubmit = () => {
    sendPrivateMessage(socket);
    return false;
}

const sendPrivateMessage = (socket) => {
    var content = privateChatBox.querySelector("input[name='message']").value;
    var targetId = parseInt(privateChatBox.getAttribute("targetid"));
    privateChatBox.reset();
    socket.emit("send-private-message", JSON.stringify({targetId: targetId, content: content}));
};