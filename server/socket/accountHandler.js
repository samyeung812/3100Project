module.exports = (io) => {
    io.on("connection", (socket) => {
        // Register account
        socket.on("register", async (data) => {
            if (usersInfo.has(socket.id)) return;

            var input = getData(data);
            var { username, password, confirmPassword, email } = input;
            
            // error code: 1 for invalid username, 2 for invalid password, 4 for invalid email,
            //             8 for sql connection error, 16 for duplicated username, 32 for incorrect password,
            //             64 for non-existing username, 128 for unmatch confirm password
            var errorCode = 0;

            // check user input format
            if(!validUsername(username)) errorCode |= 1;
            if(!validPassword(password)) errorCode |= 2;
            if(!validEmail(email)) errorCode |= 4;
            if(password != confirmPassword) errorCode |= 128;
            
            // sql query string
            var queryString1 = "SELECT COUNT(*) AS count FROM accounts WHERE username=?;";
            var queryString2 = "SELECT COUNT(*) AS count FROM accounts;";
            var queryString3 = "INSERT INTO accounts (userid, username, email, password) VALUES (?, ?, ?, ?);";
            var queryString4 = "INSERT INTO leaderboard (userid, ranking) VALUES (?, 0);";
            
            // get number of user with username
            SQLQuery(queryString1, [username], validateAndCreate);

            async function validateAndCreate(result, error) {
                if(!result) {
                    errorCode |= 8;
                    socket.emit("register-result", errorCode);
                    return;
                }

                // update error code if username duplicated
                if(result[0].count > 0) {
                    errorCode |= 16;
                }

                if(errorCode == 0) {
                    // encrypt user password
                    const hashedPassword = await bcrypt.hash(password, 10);
                    
                    // get number of user
                    SQLQuery(queryString2, [], (result, error) => {
                        if(!result || !result[0]) {
                            errorCode |= 8;
                            socket.emit("register-result", errorCode);
                            return;
                        }

                        var userid = result[0].count + 1;

                        // insert new account information
                        SQLQuery(queryString3, [userid, username, email, hashedPassword], (result, error) => {
                            if(!result) {
                                errorCode |= 8;
                                socket.emit("register-result", errorCode);
                                return;
                            }
                            // insert new ranking information
                            SQLQuery(queryString4, [userid], (result, error) => {
                                if(!result) {
                                    errorCode |= 8;
                                }
                                socket.emit("register-result", errorCode);
                                return;
                            })
                        });
                    });
                } else {
                    socket.emit("register-result", errorCode);
                }
            }
        });

        // Change user password
        socket.on("change-password", async (data) => {
            if(!usersInfo.has(socket.id)) return;

            var input = getData(data);
            var user = usersInfo.get(socket.id);
            var { password, newPassword, confirmPassword } = input;

            // error code: 1 for invalid username, 2 for invalid password, 4 for invalid email,
            //             8 for sql connection error, 16 for duplicated username, 32 for incorrect password,
            //             64 for non-existing username, 128 for unmatch confirm password
            var errorCode = 0;

            if(!validPassword(newPassword)) errorCode |= 2;
            if (newPassword != confirmPassword) errorCode |= 128;

            // sql query string
            var queryString1 = "SELECT password FROM accounts WHERE userid=?";
            var queryString2 = "UPDATE accounts SET password=? WHERE userid=?;";

            // get user password
            SQLQuery(queryString1, [user.id], compareAndUpdatePassword);
            
            async function compareAndUpdatePassword (result, error) {
                if(!result) {
                    errorCode |= 8;
                    socket.emit("change-password-result", errorCode);
                    return;
                }

                // get query result password
                var hashedPassword = "";
                if (result[0]) hashedPassword = result[0].password;

                // compare the encrypted password with user input
                if (await bcrypt.compare(password, hashedPassword)) {
                    if(errorCode == 0) {
                        // encrypt the new password
                        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

                        // update user password
                        SQLQuery(queryString2, [hashedNewPassword, user.id], (result, error) => {
                            if(!result) {
                                errorCode |= 8;
                            }
                        });
                    }
                } else {
                    errorCode |= 32;
                }

                socket.emit("change-password-result", errorCode);
            }
        });
        
        // Change user email
        socket.on("change-email", async (data) => {
            if(!usersInfo.has(socket.id)) return;

            var input = getData(data);
            var user = usersInfo.get(socket.id);

            var { password, email } = input;
            
            // error code: 1 for invalid username, 2 for invalid password, 4 for invalid email,
            //             8 for sql connection error, 16 for duplicated username, 32 for incorrect password,
            //             64 for non-existing username, 128 for unmatch confirm password
            var errorCode = 0;

            if (!validEmail(email)) errorCode |= 4;

            // sql query string
            var queryString1 = "SELECT password FROM accounts WHERE userid=?";
            var queryString2 = "UPDATE accounts SET email=? WHERE userid=?;";

            // send query to sql database
            SQLQuery(queryString1, [user.id], compareAndUpdateEmail);
            
            async function compareAndUpdateEmail (result, error) {
                if(!result) {
                    errorCode |= 8;
                    socket.emit("change-email-result", errorCode);
                    return;
                }

                // get query result password
                var hashedPassword = "";
                if (result[0]) hashedPassword = result[0].password;

                // compare the encrypted password with user input
                if (await bcrypt.compare(password, hashedPassword)) {
                    if(errorCode == 0) {
                        // send query to sql database
                        SQLQuery(queryString2, [email, user.id], (result, error) => {
                            if(!result) {
                                errorCode |= 8;
                            }
                            socket.emit("change-email-result", errorCode);
                        });
                        return;
                    }
                } else {
                    errorCode |= 32;
                }
                socket.emit("change-email-result", errorCode);
            }
        });

        // Forget password page
        socket.on("reset-password", (data) => {
            var input = getData(data);
            authenticateJWT(input.token , async (res) => {
                if(!res || !res.forget) return;

                var user = res.user;
                var { newPassword, confirmPassword } = input;

                // error code: 1 for invalid username, 2 for invalid password, 4 for invalid email,
                //             8 for sql connection error, 16 for duplicated username, 32 for incorrect password,
                //             64 for non-existing username, 128 for unmatch confirm password
                var errorCode = 0;

                if(!validPassword(newPassword)) errorCode |= 2;
                if (newPassword != confirmPassword) errorCode |= 128;

                // sql query string
                var queryString = "UPDATE accounts SET password=? WHERE userid=?;";

                if(errorCode == 0) {
                    // encrypt the new password
                    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

                    // update user password
                    SQLQuery(queryString, [hashedNewPassword, user.id], (result, error) => {
                        if(!result) {
                            errorCode |= 8;
                        }
                    });
                }

                socket.emit("reset-password-result", errorCode);
            });
        });
    });
}

const bcrypt = require("bcrypt");
const { usersInfo } = require("../connection.js");
const { SQLQuery } = require("../database.js");
const { authenticateJWT } = require("../auth.js");
const { validUsername, validPassword, validEmail } = require("../formatChecker.js");