module.exports = (io) => {
    io.on("connection", (socket) => {
        socket.on("token-login", (token) => {
            if(usersInfo.has(socket.id)) return;

            // authenticate user JWT
            authenticateJWT(token, (res) => {
                if (!res) {
                    socket.emit("auth-error", "Incorrect Access Token");
                    return;
                }

                // send login message to user
                var user = res.user;
                
                var queryString = "SELECT userid FROM accounts WHERE userid=?;";
                // get userid
                SQLQuery(queryString, [user.id], (result, error) => {
                    if(!result || !result[0]) return;
                    // update user online information
                    updateUserConnection(user, socket.id, () => {
                        // check whether user disconnected from game and reconenct it
                        socket.emit("login", JSON.stringify(usersInfo.get(socket.id)));
                        var roomId = room.getRoomId(user);
                        if (roomId) {
                            socket.emit("room-state", JSON.stringify(room.getRoomState(roomId)));
                            socket.join(roomId);
                            console.log(user.name + " reconnected to the game");
                        }
                    });
                    console.log(user.name, "login");
                });
            });
        });
        
        socket.on("get-token", async (data) => {
            if (usersInfo.has(socket.id)) return;

            var input = getData(data);
            var { username, password } = input;

            // error code: 1 for invalid username, 2 for invalid password, 4 for invalid email,
            //             8 for sql connection error, 16 for duplicated username, 32 for incorrect password,
            //             64 for non-existing username, 128 for unmatch confirm password
            var errorCode = 0;

            // get user account information
            var queryString = "SELECT userid, password FROM accounts WHERE username=?";
            SQLQuery(queryString, [username], async (result, error) => {
                if(!result) {
                    errorCode |= 8;
                    socket.emit("login-result", errorCode);
                    return;
                }

                // get query result password
                var hashedPassword = "";
                if (result[0]) hashedPassword = result[0].password;
                else errorCode |= 64;

                // compare the encrypted password with user input
                if (await bcrypt.compare(password, hashedPassword)) {
                    // send JWT to user if correct
                    var user = {
                        id: result[0].userid,
                        name: username
                    }
                    var token = createJWT({ user: user }, { expiresIn: '7d' });
                    socket.emit("access-token", token);
                } else {
                    errorCode |= 32;
                }
                socket.emit("login-result", errorCode);
            });
        });
    });
}

const { usersInfo, updateUserConnection} = require("../connection.js");
const { authenticateJWT, createJWT} = require("../auth.js");
const { SQLQuery } = require("../database.js");
const room = require("../room.js");
const bcrypt = require("bcrypt");