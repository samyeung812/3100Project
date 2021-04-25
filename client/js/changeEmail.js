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

socket.on("change-email-result", (errorCode) => {
    if (errorCode == 0) {
        closeChangeEmail();
    }
    updateChangeEmailError(errorCode);
});

changeEmailBox.onsubmit = () => {
    changeEmail(socket);
    return false;
};

const changeEmail = (socket) => {
    // get user input
    var password = changeEmailBox.querySelector("input[name='password']").value;
    var email = changeEmailBox.querySelector("input[name='email']").value.toLowerCase();

    socket.emit("change-email", JSON.stringify({ password: password, email: email }));
};