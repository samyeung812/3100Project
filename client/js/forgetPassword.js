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

function updateForgetError(errorCode) {
    if(errorCode > 0) {
        forgetUsernameError.innerText = "Invalid username";
    } else {
        forgetUsernameError.innerText = "";
    }
}

socket.on("forget-password-result", (errorCode) => {
    if(errorCode == 0)
    {
        closeForget();
    }
    updateForgetError(errorCode);
});

forgetBox.onsubmit = () => {
    forget(socket);
    return false;
};

const forget = (socket) => {
    // get user input
    var username = forgetBox.querySelector("input[name='username']").value;

    socket.emit("forget-password", JSON.stringify({username: username}));
};