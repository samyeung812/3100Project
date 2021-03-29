// Reset Password Form
const resetPasswordWrapper = document.getElementById("reset-password-wrapper");
const resetPasswordBox = document.getElementById("reset-password-box");

resetPasswordWrapper.style.display = "block";

function updateResetPasswordError(errorCode) {
    // error code: 1 for invalid username, 2 for invalid password, 4 for invalid email,
    //             8 for sql connection error, 16 for duplicated username, 32 for duplicated email
    //             64 for incorrect password, 128 for non-existing username, 256 for unmatch confirm password
    if(errorCode & 2) {
        document.getElementById("reset-password-error").innerText = "Invalid password format!";
    } else {
        document.getElementById("reset-new-password-error").innerText = "";
    }

    if (errorCode & 256) {
        document.getElementById("reset-confirm-password-error").innerText = "The password does not match!";
    } else {
        document.getElementById("reset-confirm-password-error").innerText = "";
    }
}

(() => {
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
})();

const resetPassword = (socket) => {
    // get user input
    var token = new URLSearchParams(window.location.search).get("token");
    var newPassword = resetPasswordBox.querySelector("input[name='newPassword']").value;
    var confirmPassword = resetPasswordBox.querySelector("input[name='confirmPassword']").value;

    socket.emit("reset-password", JSON.stringify({ token: token, forget: 1, newPassword: newPassword , confirmPassword: confirmPassword}));
};