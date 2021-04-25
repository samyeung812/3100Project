// Show Registration Form
createBtn.addEventListener("click", showRegistration);
function showRegistration () {
    updateLoginError(0);
    registrationWrapper.style.display = "block";
}

// Close Registration Form
closeCreateBtn.addEventListener("click", closeRegistration);
function closeRegistration () {
    updateRegistrationError(0);
    registrationWrapper.style.display = "none";
    registrationBox.reset();
}

function updateRegistrationError(errorCode) {
    // error code: 1 for invalid username, 2 for invalid password, 4 for invalid email,
    //             8 for sql connection error, 16 for duplicated username, 32 for incorrect password,
    //             64 for non-existing username, 128 for unmatch confirm password
    if (errorCode & 1 || errorCode & 16) {
        if(errorCode & 1) {
            registerUsernameError.innerText = "Invalid username format!";
        } else {
            registerUsernameError.innerText = "The username has already registered!";
        }
    } else {
        registerUsernameError.innerText = "";
    }
    
    if (errorCode & 2) {
        registerPasswordError.innerText = "Invalid password format!";
    } else {
        registerPasswordError.innerText = "";
    }

    if (errorCode & 4) {
        registerEmailError.innerText = "Invalid email format!";
    } else {
        registerEmailError.innerText = "";
    }

    if (errorCode & 128) {
        registerConfirmPasswordError.innerText = "The password does not match!";
    } else {
        registerConfirmPasswordError.innerText = "";
    }
}

socket.on("register-result", (errorCode) => {
    if (errorCode == 0) {
        closeRegistration();
    }
    updateRegistrationError(errorCode);
    console.log(errorCode);
});

registrationBox.onsubmit = () => {
    register(socket);
    return false;
};

const register = (socket) => {
    // get user input
    var username = registrationBox.querySelector("input[name='username']").value;
    var email = registrationBox.querySelector("input[name='email']").value.toLowerCase();
    var password = registrationBox.querySelector("input[name='password']").value;
    var confirmPassword = registrationBox.querySelector("input[name='confirmPassword']").value;

    socket.emit("register", JSON.stringify({ username: username, password: password, confirmPassword: confirmPassword, email: email }));
};