// Reset Password Form
const resetPasswordWrapper = document.getElementById("reset-password-wrapper");
const resetPasswordBox = document.getElementById("reset-password-box");
const resetPasswordError = document.getElementById("reset-password-error");
const resetConfirmPasswordError = document.getElementById("reset-confirm-password-error");

resetPasswordWrapper.style.display = "block";

function updateResetPasswordError(errorCode) {
    // error code: 1 for invalid username, 2 for invalid password, 4 for invalid email,
    //             8 for sql connection error, 16 for duplicated username, 32 for incorrect password,
    //             64 for non-existing username, 128 for unmatch confirm password
    if(errorCode & 2) {
        resetPasswordError.innerText = "Invalid password format!";
    } else {
        resetPasswordError.innerText = "";
    }

    if (errorCode & 128) {
        resetConfirmPasswordError.innerText = "The password does not match!";
    } else {
        resetConfirmPasswordError.innerText = "";
    }
}

    const socket = io();

    socket.on("reset-password-result", (errorCode) => {
        if (errorCode == 0) {
            window.location.replace("http://localhost");
        }
        updateResetPasswordError(errorCode);
    });

    resetPasswordBox.onsubmit = () => {
        resetPassword(socket);
        return false;
    };

const resetPassword = (socket) => {
    // get user input
    var token = new URLSearchParams(window.location.search).get("token");
    var newPassword = resetPasswordBox.querySelector("input[name='newPassword']").value;
    var confirmPassword = resetPasswordBox.querySelector("input[name='confirmPassword']").value;
    
    socket.emit("reset-password", JSON.stringify({ token: token, newPassword: newPassword , confirmPassword: confirmPassword}));
};