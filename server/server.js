// command for installing nodejs library:
// npm install express socket.io bcrypt mysql jsonwebtoken nodemon nodemailer

// commad for starting the server
// nodemon start
// node server.js

// SQL
// CREATE DATABASE nodeserverdb;
// CREATE TABLE accounts (userid int NOT NULL AUTO_INCREMENT, username varchar(20) NOT NULL, email varchar(200) NOT NULL, password varchar(100) NOT NULL, PRIMARY KEY (userid), CONSTRAINT valid_name UNIQUE (username));
// CREATE TABLE leaderboard (userid int NOT NULL AUTO_INCREMENT, ranking bigint, FOREIGN KEY (userid) REFERENCES accounts(userid), PRIMARY KEY (userid));
// CREATE TABLE friendship (id1 int NOT NULL, id2 int NOT NULL, status tinyint NOT NULL, FOREIGN KEY (id1) REFERENCES accounts(userid), FOREIGN KEY (id2) REFERENCES accounts(userid), PRIMARY KEY (id1, id2), CONSTRAINT valid CHECK (id1 < id2));
// friendship status 0 for friend, 1 for id1_pending_id2, 2 for id2_pending_id1, 3 for id1_blocked_id2, 4 for id2_blocked_id1, 5 for both_blocked

const express = require("express");
const app = express();
const path = require("path");

const server = require("http").Server(app);
const io = require("socket.io")(server);

const mail = require("./mail.js");
const room = require("./room.js");
// const game = require("./game.js");

// const login = require("./login.js")(io);
// const game = require("./game.js")(io);

// Set The Client File as Static Directory
app.use(express.static(path.join(__dirname, '../client')));

// Response for http://localhost/
app.get("/", (req, res) => {
    res.sendFile(path.resolve("login.html"));
});

// Response for forget password
app.get("/reset/", (req, res) => {
    authenticateJWT(req.query.token, (result) => {
        if(!result || !result.forget)
        {
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.write("404 - Page Not Found.");
            res.end();
            return;
        }
        res.sendFile(path.resolve("client/reset.html"));
    });
});

// Response for Other Get Access
app.get("*", (req, res) => {
    res.writeHead(404, {'Content-Type': 'text/html'});
    res.write("404 - Page Not Found.");
    res.end();
})

// Response for Post Access
app.post("*", (req, res) => {
    res.writeHead(404, {'Content-Type': 'text/html'});
    res.write("404 - Page Not Found.");
    res.end();
})

// Listen for HTTP Server Access Port 80
server.listen(80);

// Mysql Server Connection Details
const mysql = require("mysql");
var con = mysql.createConnection({
    host: "localhost",
    user: "admin",
    password: "admin",
    database: "nodeServerDB",
    port: "3306",
    insecureAuth : true,
    multipleStatements: true
}); 

// Mysql Server Connection
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to MySQL server!");
});

// Library for Bcrypt (use for password encryption and decryption for database)
const bcrypt = require("bcrypt");

// Library for JSON Web Token (use for generating JSON web token and authentication)
const jwt = require("jsonwebtoken");
const { userInfo } = require("os");
const { query } = require("express");

// Secret Key for JTW Encryption and Decryption
const JWT_SECRET_KEY = "2797822dc6bbfd45e3c23caa9307672770651c1618a1cdb29be33d7bb1eeef1840a274ee32a0d86aa9a550c9119fdaba";

// 5-20 characters that not start or end with space
const usernameFormat = /(?=.{3,20}$)^\S.*[^\s]$/;
// 8-30 characters with minimal 1 upper-case, 1 lower-case, 1 number, 1 special character
const passwordFormat = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,30}$/;
// 6-100 chacaters that satisfies Mail-RFC822-Address format
const emailFormat = /(?=.{6,200}$)(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

// Store User Online Information
var usersInfo = new Map();  // get user info by socket id
var socketIds = new Map();  //  get socket id by user id

// Authenticate JSON Web Token
function authenticateJWT (token, callback) {
    // check whether token input exist
    if (token == null) return callback(false);

    // verify token by secret key
    jwt.verify(token, JWT_SECRET_KEY, (err, res) => {
        if (err) return callback(false);
        return callback(res);
    });
}

function getData(data) {
    try {
        return JSON.parse(data);
    }
    catch {
        return "";
    }
}

// Update user online information
function updateUserConnection(user, socketId)
{
    // check whether user logged in somewhere else
    if (socketIds.has(user.id) && socketIds.get(user.id) != socketId) {
        // try to inform the user and disconnect
        var target = socketIds.get(user.id);
        io.to(target).emit("error", "Login Somewhere Else");
        io.sockets.sockets.get(target).disconnect();
        usersInfo.delete(target);
    }

    // check whether the socket logged in for other account
    if (usersInfo.has(socketId) && usersInfo.get(socketId).id != user.id) {
        // try to inform the user and disconnect
        var target = socketIds.get(usersInfo.get(socketId).id);
        io.to(target).emit("error", "Login Somewhere Else");
        io.sockets.sockets.get(target).disconnect();
        socketIds.delete(user.id);
    }

    // set user online information
    socketIds.set(user.id, socketId);

    var queryString = "SELECT ranking FROM leaderboard WHERE userid=?;";
    SQLQuery(queryString, [user.id], (result, error) => {
        if(!result) return;
        user.ranking = result[0].ranking;
        io.sockets.sockets.get(socketId).emit("login", JSON.stringify(user));
        usersInfo.set(socketId, user);
    });
}

// Detect whether user is disconnected from the game
function disconnectUser(user) {
    // check whether user logged in
    if (!socketIds.has(user.id) && room.getRoomId(user)) {
        // remove user from the game
        var roomId = room.getRoomId(user);
        room.leaveRoom(user);
        io.to(roomId).emit("room-state", JSON.stringify(room.getRoomState(roomId)));
        console.log(user.name + " disconnected from the room");
    }
}

function SQLQuery(queryString, args, callback)
{
    try {
        // send sql request
        con.query(queryString, args, (err, result) => {
            if (err) return callback(null, err.message);
            else return callback(result, null);
        });
    } catch (e) {
        return callback(null, e.message);
    }
}

// Server socket setting
io.on("connection", (socket) => {

    // Wait for user reconnection
    socket.on("disconnect", () => {
        // check if user is not logged in
        if (!usersInfo.has(socket.id)) return;

        // wait user to reconnect for 1 minutes
        var minutes = 1;
        if (room.getRoomId(usersInfo.get(socket.id).id)) setTimeout(disconnectUser, minutes * 60 * 1000, usersInfo.get(socket.id));

        // remove user online information
        console.log(usersInfo.get(socket.id).name, "logout");
        socketIds.delete(usersInfo.get(socket.id).id);
        usersInfo.delete(socket.id);
    });

    // Join room
    socket.on("join-room", (roomId) => {
        if(!usersInfo.has(socket.id)) return;

        var user = usersInfo.get(socket.id);
        if(room.getRoomId(user)) return;

        var errorCode = room.joinRoom(user, roomId);
        socket.emit("join-room-result", errorCode);
        if(errorCode == 0) {
            socket.join(roomId);
            io.to(roomId).emit("room-state", JSON.stringify(room.getRoomState(roomId)));
        }
    });

    // Open new room for the user
    socket.on("open-room", () => {
        if(!usersInfo.has(socket.id)) return;
        if(room.getRoomId(usersInfo.get(socket.id))) return;

        var roomId = room.openRoom(usersInfo.get(socket.id), false);
        socket.join(roomId);
        io.to(roomId).emit("room-state", JSON.stringify(room.getRoomState(roomId)));
    });

    // Leave room
    socket.on("leave-room", () => {
        if(!usersInfo.has(socket.id)) return;
        if(!room.getRoomId(usersInfo.get(socket.id))) return;

        var user = usersInfo.get(socket.id);
        var roomId = room.getRoomId(user);
        
        // check whether the room is still exist after leaving
        socket.leave(roomId);
        if(room.leaveRoom(user)) {
            io.to(roomId).emit("room-state", JSON.stringify(room.getRoomState(roomId)));
        }
    });

    socket.on("room-chat", (msg) => {
        if(!usersInfo.has(socket.id)) return;
        if(!room.getRoomId(usersInfo.get(socket.id))) return;
        if(typeof msg != "string" || msg.length == 0) return;

        var user = usersInfo.get(socket.id);
        var roomId = room.getRoomId(user);
        
        io.to(roomId).emit("room-msg", JSON.stringify({username: user.name, msg: msg}));
    });

    socket.on("spectate", () => {
        if(!usersInfo.has(socket.id)) return;
        if(!room.getRoomId(usersInfo.get(socket.id))) return;

        var user = usersInfo.get(socket.id);
        var roomId = room.getRoomId(user);

        if(!room.spectate(user)) return;
        io.to(roomId).emit("room-state", JSON.stringify(room.getRoomState(roomId)));
    });

    socket.on("get-leaderboard", () => {
        if(!usersInfo.has(socket.id)) return;

        var queryString = "SELECT accounts.username, leaderboard.ranking FROM leaderboard INNER JOIN accounts ON leaderboard.userid = accounts.userid ORDER BY ranking DESC LIMIT 100;";
        SQLQuery(queryString, [], (result, erorr) => {
            if(!result) return;
            socket.emit("leaderboard-result", JSON.stringify(result));
        });
    });

    socket.on("search-ranking", (username) => {
        if(typeof username != "string") return;
        if(!usersInfo.has(socket.id)) return;

        var queryString = "SELECT accounts.username, leaderboard.ranking FROM leaderboard INNER JOIN accounts ON leaderboard.userid = accounts.userid WHERE accounts.username=?;";
        SQLQuery(queryString, [username], (result, error) => {
            if(!result) return;
            socket.emit("leaderboard-result", JSON.stringify(result));
        });
    });

    socket.on("play", () => {
        if(!usersInfo.has(socket.id)) return;
        if(!room.getRoomId(usersInfo.get(socket.id))) return;

        var user = usersInfo.get(socket.id);
        var roomId = room.getRoomId(user);

        var res = room.play(user);
        if(!res) return;
        io.to(roomId).emit("room-state", JSON.stringify(room.getRoomState(roomId)));
    });

    // send friend request by usernmae
    socket.on("send-friend-request", (data) => {
        if(!usersInfo.has(socket.id)) return;

        var user = usersInfo.get(socket.id);
        var target = getData(data);

        // result code: 0 for request sent, 1 for sql connection error, 2 for invalid username, 4 for blocked user,
        //              8 for being blocked, 16 friend already, 32 for pending already, 64 for become friend
        var resultCode = 0;

        var queryString1 = "SELECT userid FROM accounts where username=?;";
        var queryString2 = "SELECT * FROM friendship where id1=? AND id2=?;";
        var queryString3 = "INSERT INTO friendship (id1, id2, status) VALUES (?,?,?);";
        var queryString4 = "UPDATE friendship SET status=0 WHERE id1=? AND id2=?;";

        SQLQuery(queryString1, [target], (result, error) => {
            if(!result) {
                resultCode |= 1;
                socket.emit("friend-request-result", resultCode);
                return;
            }
            else if(!result[0]) {
                resultCode |= 2;
                socket.emit("friend-request-result", resultCode);
                return;
            }

            var id1 = Math.min(user.id, result[0].userid);
            var id2 = Math.max(user.id, result[0].userid);
            var smaller = id1 == user.id;

            SQLQuery(queryString2, [id1, id2], (result, error) => {
                if(!result) {
                    resultCode |= 1;
                    socket.emit("friend-request-result", resultCode);
                    return;
                }
                
                // check whether there is relationship between users
                if(!result[0]) {
                    // insert a new relationship if no
                    SQLQuery(queryString3, [id1, id2, smaller?1:2], (result, error) => {
                        if(!result) resultCode |= 1;
                        socket.emit("friend-request-result", resultCode);
                    });
                    return;
                }
                var status = result[0].status;

                // update a new relationship
                if((status == 1 && !smaller) || (status == 2 && smaller)) {
                    SQLQuery(queryString4, [id1, id2], (result, error) => {
                        if(!result) {
                            resultCode |= 1;
                            socket.emit("friend-request-result", resultCode);
                            return;    
                        }
                        resultCode |= 64;
                        socket.emit("friend-request-result", resultCode);
                    });
                    return;
                }

                if(status == 0) resultCode |= 16;
                else if(status < 3) resultCode |= 32;
                else if(status == 3) {
                    if(smaller) resultCode |= 4;
                    else resultCode |= 8;
                }
                else if(status == 4) {
                    if(smaller) resultCode |= 8;
                    else resultCode |= 4;
                }
                else if(status == 5) resultCode |= 12;

                socket.emit("friend-request-result", resultCode);
            });
        });
    });

    // accept friend request by id
    socket.on("accept-friend-request", (data) => {
        if(!usersInfo.has(socket.id)) return;

        var user = usersInfo.get(socket.id);
        var targetId = getData(data);

        var queryString1 = "SELECT * FROM friendship where id1=? AND id2=?;";
        var queryString2 = "UPDATE friendship SET status=0 WHERE id1=? AND id2=?;";

        var id1 = Math.min(user.id, targetId);
        var id2 = Math.max(user.id, targetId);
        var smaller = id1 == user.id;

        SQLQuery(queryString1, [id1, id2], (result, error) => {
            if(!result || !result[0]) return;
            
            var status = result[0].status;
            if((smaller && status == 2) || (!smaller && status == 1)) {
                SQLQuery(queryString2, [id1, id2], (result, error) => {
                    if(!result) return;
                    socket.emit("update-friends");
                });
            }
        });
    });

    // accept friend request by id
    socket.on("deny-friend-request", (data) => {
        if(!usersInfo.has(socket.id)) return;

        var user = usersInfo.get(socket.id);
        var targetId = getData(data);

        var queryString1 = "SELECT * FROM friendship where id1=? AND id2=?;";
        var queryString2 = "DELETE FROM friendship WHERE id1=? AND id2=?;";

        var id1 = Math.min(user.id, targetId);
        var id2 = Math.max(user.id, targetId);
        var smaller = id1 == user.id;

        SQLQuery(queryString1, [id1, id2], (result, error) => {
            if(!result || !result[0]) return;
            
            var status = result[0].status;
            if((smaller && status == 2) || (!smaller && status == 1)) {
                SQLQuery(queryString2, [id1, id2], (result, error) => {
                    if(!result) return;
                    socket.emit("update-friends");
                });
            }
        });
    });

    // accept friend request by id
    socket.on("cancel-friend-request", (data) => {
        if(!usersInfo.has(socket.id)) return;

        var user = usersInfo.get(socket.id);
        var targetId = getData(data);

        var queryString1 = "SELECT * FROM friendship where id1=? AND id2=?;";
        var queryString2 = "DELETE FROM friendship WHERE id1=? AND id2=?;";

        var id1 = Math.min(user.id, targetId);
        var id2 = Math.max(user.id, targetId);
        var smaller = id1 == user.id;

        SQLQuery(queryString1, [id1, id2], (result, error) => {
            if(!result || !result[0]) return;
            
            var status = result[0].status;
            if((smaller && status == 1) || (!smaller && status == 2)) {
                SQLQuery(queryString2, [id1, id2], (result, error) => {
                    if(!result) return;
                    socket.emit("update-friends");
                });
            }
        });
    });

    // block user by id
    socket.on("block-user", (data) => {
        if(!usersInfo.has(socket.id)) return;

        var user = usersInfo.get(socket.id);
        var targetId = getData(data);
        
        var queryString1 = "SELECT * FROM friendship where id1=? AND id2=?;";
        var queryString2 = "INSERT INTO friendship (id1, id2, status) VALUES (?,?,?);";
        var queryString3 = "UPDATE friendship SET status=? WHERE id1=? AND id2=?;";

        var id1 = Math.min(user.id, targetId);
        var id2 = Math.max(user.id, targetId);
        var smaller = id1 == user.id;

        SQLQuery(queryString1, [id1, id2], (result, error) => {
            if(!result) return;
            
            // check whether there is relationship between users
            if(!result[0]) {
                // insert a new relationship if no
                SQLQuery(queryString2, [id1, id2, smaller?3:4], (result, error) => {
                    if(!result) return;
                    socket.emit("update-friends");
                });
                return;
            }

            var status = result[0].status;
            var newStatus = smaller ? 3 : 4;
            // update a new relationship
            if((status == 3 && !smaller) || (status == 4 && smaller)) {
                newStatus = 5;
            }
            
            SQLQuery(queryString3, [newStatus, id1, id2], (result, error) => {
                if(!result) return;
                socket.emit("update-friends");
            });
        });
    });
    
    // block user by username
    socket.on("block-user-name", (data) => {
        if(!usersInfo.has(socket.id)) return;

        var user = usersInfo.get(socket.id);
        var target = getData(data);
        
        var queryString1 = "SELECT userid FROM accounts where username=?;";
        var queryString2 = "SELECT * FROM friendship where id1=? AND id2=?;";
        var queryString3 = "INSERT INTO friendship (id1, id2, status) VALUES (?,?,?);";
        var queryString4 = "UPDATE friendship SET status=? WHERE id1=? AND id2=?;";

        SQLQuery(queryString1, [target], (result, error) => {
            if(!result || !result[0]) return;

            var id1 = Math.min(user.id, result[0].userid);
            var id2 = Math.max(user.id, result[0].userid);
            var smaller = id1 == user.id;

            SQLQuery(queryString2, [id1, id2], (result, error) => {
                if(!result) return;
                
                // check whether there is relationship between users
                if(!result[0]) {
                    // insert a new relationship if no
                    SQLQuery(queryString3, [id1, id2, smaller?3:4], (result, error) => {
                        if(!result) return;
                        socket.emit("update-friends");
                    });
                    return;
                }

                var status = result[0].status;
                var newStatus = smaller ? 3 : 4;
                // update a new relationship
                if((status == 3 && !smaller) || (status == 4 && smaller)) {
                    newStatus = 5;
                }
                
                SQLQuery(queryString4, [newStatus, id1, id2], (result, error) => {
                    if(!result) return;
                    socket.emit("update-friends");
                });
            });
        });
    });
    
    // unblock user by id
    socket.on("unblock-user", (data) => {
        if(!usersInfo.has(socket.id)) return;

        var user = usersInfo.get(socket.id);
        var targetId = getData(data);
        
        var queryString1 = "SELECT * FROM friendship where id1=? AND id2=?;";
        var queryString2 = "UPDATE friendship SET status=? WHERE id1=? AND id2=?;";
        var queryString3 = "DELETE from friendship WHERE id1=? AND id2=?;";

        var id1 = Math.min(user.id, targetId);
        var id2 = Math.max(user.id, targetId);
        var smaller = id1 == user.id;

        SQLQuery(queryString1, [id1, id2], (result, error) => {
            if(!result || !result[0]) return;

            var status = result[0].status;
            
            // update a new relationship
            if(status == 5) {
                SQLQuery(queryString2, [smaller?4:3, id1, id2], (result, error) => {
                    if(!result) return;
                    socket.emit("update-friends");
                });
            }
            else if((status == 3 && smaller) || (status == 4 && !smaller)) {
                SQLQuery(queryString3, [id1, id2], (result, error) => {
                    if(!result) return;
                    socket.emit("update-friends");
                });
            }
        });
    });
    
    socket.on("unfriend-user", (data) => {
        if(!usersInfo.has(socket.id)) return;

        var user = usersInfo.get(socket.id);
        var targetId = getData(data);

        var queryString1 = "SELECT * FROM friendship where id1=? AND id2=?;";
        var queryString2 = "DELETE from friendship WHERE id1=? AND id2=?;";
        

        var id1 = Math.min(user.id, targetId);
        var id2 = Math.max(user.id, targetId);

        SQLQuery(queryString1, [id1, id2], (result, error) => {
            if(!result || !result[0]) return;
            if(result[0].status != 0) return;
            SQLQuery(queryString2, [id1, id2], (result, error) => {
                if(!result) return;
                socket.emit("update-friends");
            });
        });
    });

    socket.on("get-friends", () => {
        if(!usersInfo.has(socket.id)) return;
        var user = usersInfo.get(socket.id);
        var queryString = "SELECT accounts.userid, accounts.username, friendship.status, leaderboard.ranking FROM friendship INNER JOIN accounts ON (friendship.id1 = accounts.userid OR friendship.id2 = accounts.userid) AND (accounts.userid != ?) INNER JOIN leaderboard ON (accounts.userid = leaderboard.userid) WHERE friendship.id1=? OR friendship.id2=?;";
        SQLQuery(queryString, [user.id, user.id, user.id], (result, erorr) => {
            if(!result) return;
            result.forEach(user => {
                // set user online state
                // 0 for offline, 1 for online, 2 for room, 3 for queue, 4 for playing
                if(socketIds.has(user.userid)) {
                    var roomId = room.getRoomIdByUserID(user.userid);
                    if(roomId) {
                        var roomState = room.getRoomState(roomId);
                        if(roomState.start) {
                            user.state = 4;
                        } else {
                            if(roomState.ranked) {
                                user.state = 3;
                            } else {
                                user.state = 2;
                            }
                        }
                    } else {   
                        user.state = 1;
                    }
                } else {
                    user.state = 0;
                }
            });
            socket.emit("load-friends", JSON.stringify(result));
        });
    });

    // Forget password page
    socket.on("reset-password", (data) => {
        var input = getData(data);
        authenticateJWT(input.token , async (res) => {
            if(!res || !res.forget) return;

            var user = res.user;
            var { newPassword, confirmPassword } = input;

            // error code: 1 for invalid username, 2 for invalid password, 4 for invalid email,
            //             8 for sql connection error, 16 for duplicated username, 32 for duplicated email
            //             64 for incorrect password, 128 for non-existing username, 256 for unmatch confirm password
            var errorCode = 0;

            var passwordMatch = passwordFormat.exec(newPassword);
            if(!passwordMatch || passwordMatch[0] != newPassword) {
                errorCode |= 2;
            }
            if (newPassword != confirmPassword) errorCode |= 256;

            // sql query string
            var queryString = "UPDATE accounts SET password=? WHERE userid=?;";

            if(errorCode == 0) {
                // encrypt the new password
                const hashedNewPassword = await bcrypt.hash(newPassword, 10);

                // send query to sql database
                SQLQuery(queryString, [hashedNewPassword, user.id], (result, error) => {
                    if(!result) {
                        errorCode |= 8;
                    }
                });
            }

            socket.emit("reset-password-result", errorCode);
        });
    });

    socket.on("forget-password", (data) => {
        var input = getData(data);
        var username = input.username;

        // find the email of the user
        var queryString = "SELECT userid, email FROM accounts WHERE username=?;";
        SQLQuery(queryString, [username], (result, error) => {
            if (!result || !result[0]) {
                // forget password result equal 1 implies invalid username
                socket.emit("forget-password-result", 1);
                return;
            }

            // the reset password link in the email will be expired in 5 minutes
            var user = {
                id: result[0].userid,
                name: username
            };
            var token = jwt.sign({ forget: true, user: user }, JWT_SECRET_KEY, { expiresIn: '5min' });

            // append the token to the link and send it to the email of the user
            mail.sendEmail(result[0].email, token);
            
            // forget password result equal 0 implies no error
            socket.emit("forget-password-result", 0);
        });
    });

    // Change user password
    socket.on("change-password", async (data) => {
        if(!usersInfo.has(socket.id)) return;

        var input = getData(data);
        var user = usersInfo.get(socket.id);
        var { password, newPassword, confirmPassword } = input;
        
        // error code: 1 for invalid username, 2 for invalid password, 4 for invalid email,
        //             8 for sql connection error, 16 for duplicated username, 32 for duplicated email
        //             64 for incorrect password, 128 for non-existing username, 256 for unmatch confirm password
        var errorCode = 0;

        var passwordMatch = passwordFormat.exec(newPassword);
        if(!passwordMatch || passwordMatch[0] != newPassword) {
            errorCode |= 2;
        }
        if (newPassword != confirmPassword) errorCode |= 256;

        // sql query string
        var queryString1 = "SELECT password FROM accounts WHERE userid=?";
        var queryString2 = "UPDATE accounts SET password=? WHERE userid=?;";

        // send query to sql database
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

                    // send query to sql database
                    SQLQuery(queryString2, [hashedNewPassword, user.id], (result, error) => {
                        if(!result) {
                            errorCode |= 8;
                        }
                    });
                }
            } else {
                errorCode |= 64;
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
        //             8 for sql connection error, 16 for duplicated username, 32 for duplicated email
        //             64 for incorrect password, 128 for non-existing username, 256 for unmatch confirm password
        var errorCode = 0;

        var emailMatch = emailFormat.exec(email);
        if (!emailMatch || emailMatch[0] != email) errorCode |= 4;

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
                            socket.emit("change-email-result", errorCode);
                        }
                    });
                    return;
                }
            } else {
                errorCode |= 64;
            }
            socket.emit("change-email-result", errorCode);
        }
    });

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
            
            // update user online information
            updateUserConnection(user, socket.id);
            console.log(user.name, "login");

            // check whether user disconnected from game and reconenct it
            var roomId = room.getRoomId(user);
            if (roomId) {
                socket.emit("room-state", JSON.stringify(room.getRoomState(roomId)));
                socket.join(roomId);
                console.log(user.name + " reconnected to the game");
            }
        });
    });
    
    socket.on("get-token", async (data) => {
        if (usersInfo.has(socket.id)) return;

        var input = getData(data);
        var { username, password } = input;

        // error code: 1 for invalid username, 2 for invalid password, 4 for invalid email,
        //             8 for sql connection error, 16 for duplicated username, 32 for duplicated email
        //             64 for incorrect password, 128 for non-existing username
        var errorCode = 0;

        // sql query string
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
            else errorCode |= 128;

            // compare the encrypted password with user input
            if (await bcrypt.compare(password, hashedPassword)) {
                // send JWT to user if correct
                var user = {
                    id: result[0].userid,
                    name: username
                }
                var token = jwt.sign({ user: user }, JWT_SECRET_KEY, { expiresIn: '7d' });
                socket.emit("access-token", token);
            } else {
                errorCode |= 64;
            }
            socket.emit("login-result", errorCode);
        });
    });

    socket.on("register", async (data) => {
        if (usersInfo.has(socket.id)) return;

        var input = getData(data);
        var { username, password, confirmPassword, email } = input;
        
        // error code: 1 for invalid username, 2 for invalid password, 4 for invalid email,
        //             8 for sql connection error, 16 for duplicated username, 32 for duplicated email
        //             64 for incorrect password, 128 for non-existing username, 256 for unmatch confirm password
        var errorCode = 0;
        
        var usernameMatch = usernameFormat.exec(username);
        var passwordMatch = passwordFormat.exec(password);
        var emailMatch = emailFormat.exec(email);

        if(!usernameMatch || usernameMatch[0] != username) errorCode |= 1;
        if(!passwordMatch || passwordMatch[0] != password) errorCode |= 2;
        if(!emailMatch || emailMatch[0] != email) errorCode |= 4;
        if(password != confirmPassword) errorCode |= 256;
        
        // sql query string
        var queryString1 = "SELECT COUNT(*) AS count FROM accounts WHERE username=?;";
        var queryString2 = "SELECT COUNT(*) AS count FROM accounts WHERE email=?;";
        var queryString3 = "INSERT INTO accounts (username, email, password) VALUES (?, ?, ?);";
        var queryString4 = "INSERT INTO leaderboard (ranking) VALUES (0);";
        
        SQLQuery(queryString1 + queryString2, [username, email], validateAndCreate);

        async function validateAndCreate(result, error) {
            if(!result) {
                errorCode |= 8;
                socket.emit("register-result", errorCode);
                return;
            }

            if(result[0][0].count > 0) {
                errorCode |= 16;
            }
            
            if(result[1][0].count > 0) {
                errorCode |= 32;
            }

            if(errorCode == 0) {
                // encrypt user password
                const hashedPassword = await bcrypt.hash(password, 10);

                SQLQuery(queryString3 + queryString4, [username, email, hashedPassword], (result, error) => {
                    if(!result) {
                        errorCode |= 8;
                    }
                    socket.emit("register-result", errorCode);
                });
            } else {
                socket.emit("register-result", errorCode);
            }
        }
    });
});