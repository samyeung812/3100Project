// 3-20 characters that not start or end with space
const usernameFormat = /(?=.{3,20}$)^\S.*[^\s]$/;
// 8-30 characters with minimal 1 upper-case, 1 lower-case, 1 number, 1 special character
const passwordFormat = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,30}$/;
// 6-200 chacaters that satisfies RFC 5322 format
// https://stackoverflow.com/questions/201323/how-to-validate-an-email-address-using-a-regular-expression
const emailFormat = /(?=.{6,200}$)(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

// Check Username Format
function validUsername(username) {
    var usernameMatch = usernameFormat.exec(username);
    return usernameMatch && usernameMatch[0] == username;
}

// Check Password Format
function validPassword(password) {
    var passwordMatch = passwordFormat.exec(password);
    return passwordMatch && passwordMatch[0] == password;
}

// Check Email Format
function validEmail(email) {
    var emailMatch = emailFormat.exec(email);
    return emailMatch && emailMatch[0] == email;
}

module.exports = {
    validUsername,
    validPassword,
    validEmail
}