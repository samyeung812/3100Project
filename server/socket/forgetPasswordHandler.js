module.exports = (io) => {
    io.on("connection", (socket) => {
        // Send email to user
        socket.on("forget-password", (data) => {
            var input = getData(data);
            var username = input.username;

            // find the email of the user
            var queryString = "SELECT userid, email FROM accounts WHERE username=?;";
            SQLQuery(queryString, [username], (result, error) => {
                if (!result || !result[0]) {
                    // forget password result equal 1 implies invalid username
                    socket.emit("forget-password-result", 64);
                    return;
                }

                // the reset password link in the email will be expired in 5 minutes
                var user = {
                    id: result[0].userid,
                    name: username
                };
                var token = createJWT({ forget: true, user: user }, { expiresIn: '5min' });

                // append the token to the link and send it to the email of the user
                mail.sendEmail(result[0].email, token);
                
                // forget password result equal 0 implies no error
                socket.emit("forget-password-result", 0);
            });
        });
    });
}

const mail = require("../mail.js");
const { SQLQuery } = require("../database.js");
const { createJWT } = require("../auth.js");