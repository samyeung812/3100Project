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

// Get Cookie by Name
function getCookie (name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
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
    document.getElementsByTagName("body")[0].appendChild(wrapper);
}

socket.on("disconnect", () => {
    showPopUpMessageBox("Error Message", ["Disconnected From Server!", "Please Reload the Page!"]);
});

socket.on("popup-message", (data) => {
    var {title, messages} = JSON.parse(data);
    showPopUpMessageBox(title, messages);
});

socket.on("update-user-ranking", (rankchange) => {
    rankingChange = rankchange;
});