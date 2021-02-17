// command for installing nodejs library:
// npm install express socket.io bcrypt mysql jsonwebtoken

const express = require("express");
const app = express();

const server = require("http").Server(app);
const io = require("socket.io")(server);

// Set The Client File as Static Directory
app.use(express.static(__dirname + "/client/"));

// Response for http://localhost/
app.get("/", (req, res) => {
    res.sendFile(__dirname+"/client/login.html");
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
    insecureAuth : true
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
// Secret Key for JTW Encryption and Decryption
const JWT_SECRET_KEY = "2797822dc6bbfd45e3c23caa9307672770651c1618a1cdb29be33d7bb1eeef1840a274ee32a0d86aa9a550c9119fdaba";

// Store User Online Information
var users = new Map();
var socketIds = new Map();
var rooms = new Map();

// Authenticate JSON Web Token
function authenticate (token, socketId, callback) {
    // check whether token input exist
    if (token == null) return callback(false);

    // verify token by secret key
    jwt.verify(token, JWT_SECRET_KEY, (err, res) => {
        if (err) return callback(false);

        if (users.has(socketId) && users.get(socketId) != res.username) return callback(false);
        return callback(res);
    });
}

// Update user online information
function updateUserConnection(username, socketId)
{
    // check whether user logged in somewhere else
    if (socketIds.has(username) && socketIds.get(username) != socketId) {
        // try to inform the user and disconnect
        var target = socketIds.get(username);
        io.to(target).emit("error", "Login Somewhere Else");
        io.sockets.sockets.get(target).disconnect();
        users.delete(target);
    }

    // check whether the socket logged in for other account
    if (users.has(socketId) && users.get(socketId) != username) {
        // try to inform the user and disconnect
        var target = socketIds.get(users.get(socketId));
        io.to(target).emit("error", "Login Somewhere Else");
        io.sockets.sockets.get(target).disconnect();
        socketIds.delete(username);
    }

    // set user online information
    socketIds.set(username, socketId);
    users.set(socketId, username);
}

// Detect whether user disconnected from the game
function disconnectUser(username) {
    // check whether user logged in
    if (!socketIds.has(username) && rooms.has(username)) {
        // remove user from the game
        rooms.delete(username);
        console.log(username + " disconnected from the room");
    }
}

// Server socket setting
io.on("connection", (socket) => {

    // Wait for user reconnection
    socket.on("disconnect", () => {
        // check if user is not logged in
        if (!users.has(socket.id)) return;

        // wait user to reconnect for 2 minutes
        var minutes = 2;
        if (rooms.get(users.get(socket.id))) setTimeout(disconnectUser, minutes * 60 * 1000, users.get(socket.id));

        // remove user online information
        console.log(users.get(socket.id), "logout");
        socketIds.delete(users.get(socket.id));
        users.delete(socket.id);
    });

    // Open new room for the user
    socket.on("open-room", (data) => {
        var msg = JSON.parse(data);
        if(!msg.token) return;

        authenticate(msg.token, socket.id, (res) => {
            if (!res) {
                socket.emit("auth-error", "Incorrect Access Token");
                return;
            }

            rooms.set(res.username, 1);
            console.log(rooms);
        });
    });

    // Change user pass
    socket.on("change-password", (data) => {
        var input = JSON.parse(data);
        var { token, password, newPassword } = input;

        // authenicate user JWT
        authenticate(token, socket.id, async (res) => {
            if (!res) {
                socket.emit("auth-error", "Incorrect Access Token");
                return;
            }

            try {
                // check whether the password is correct
                if (await bcrypt.compare(password, res.password)) {
                    // sql query string
                    var sql = "UPDATE accounts SET password=? WHERE username=?;";

                    // encrypt the new password
                    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

                    // send query to sql database
                    con.query(sql, [hashedNewPassword, res.username], (err, result) => {
                        if (err) {
                            socket.emit("change-password-result", "Change Password Failed");
                            throw err;
                        }

                        // send result and new JWT
                        socket.emit("change-password-result", "success");
                        var newToken = jwt.sign({ username: res.username, password: hashedNewPassword }, JWT_SECRET_KEY);
                        socket.emit("access-token-update", newToken);
                    });
                } else {
                    socket.emit("change-password-result", "Incorrect Password!");
                }
            } catch {
                socket.emit("change-password-result", "Change Password Error!");
            }
        });
    });

    socket.on("token-login", (token) => {
        // authenticate user JWT
        authenticate(token, socket.id, (res) => {
            if (!res) {
                socket.emit("auth-error", "Incorrect Access Token");
                return;
            }

            // send login message to user
            var username = res.username;
            socket.emit("login", username);
            console.log(username, "login");
            
            // update user online information
            updateUserConnection(username, socket.id);

            // check whether user disconnected from game and reconenct it
            if (rooms.has(username)) {
                socket.emit("game-state", rooms.get(username));
                console.log(username + " reconnected to the game");
            }
        });
    });
    
    socket.on("get-token", async (data) => {
        if (users.has(socket.id)) return;

        var input = JSON.parse(data);
        var { username, password } = input;
        
        try{
            // sql query string
            var sql = "SELECT password FROM accounts WHERE username=?";

            // send sql request
            con.query(sql, [username], async (err, result) => {
                if (err) throw err;

                var hashedPassword = "";
                
                // get query result password
                if (result[0]) hashedPassword = result[0].password;

                // compare the encrypted password with user input
                if (await bcrypt.compare(password, hashedPassword)) {
                    // send JWT to user if correct
                    var token = jwt.sign({ username: username, password: hashedPassword }, JWT_SECRET_KEY);
                    socket.emit("access-token", token);
                } else {
                    socket.emit("login-error", "Incorrect Username or Password!");
                }
            });
        } catch {
            socket.emit("login-error", "Login Error!");
        }
    });

    socket.on("register", async (data) => {
        if (users.has(socket.id)) return;

        var input = JSON.parse(data);
        var { username, password, email } = input;
        
        try {
            // encrypt user password
            const hashedPassword = await bcrypt.hash(password, 10);

            // sql query string
            var sql = "INSERT INTO accounts (username, email, password) VALUES (?, ?, ?);";

            // send request to sql database
            con.query(sql, [username, email, hashedPassword], (err, result) => {
                if (err) {
                    socket.emit("register-result", "Registration Failed");
                    throw err;
                }
                socket.emit("register-result", "success");
            });
        } catch {
            socket.emit("register-result", "Registration Error!");
        }
    });
});