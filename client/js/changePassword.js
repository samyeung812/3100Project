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

socket.on("change-password-result", (errorCode) => {
    if (errorCode == 0) {
        closeChangePassword();
    }
    updateChangePasswordError(errorCode);
});

changePasswordBox.onsubmit = () => {
    changePassword(socket);
    return false;
};

const changePassword = (socket) => {
    // get user input
    var password = changePasswordBox.querySelector("input[name='originalPassword']").value;
    var newPassword = changePasswordBox.querySelector("input[name='newPassword']").value;
    var confirmPassword = changePasswordBox.querySelector("input[name='confirmPassword']").value;

    socket.emit("change-password", JSON.stringify({ password: password, newPassword: newPassword , confirmPassword: confirmPassword}));
};