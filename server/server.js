// command for installing nodejs library:
// npm install express socket.io bcrypt mysql jsonwebtoken nodemon nodemailer seedrandom

// commad for starting the server
// nodemon start
// node server/server.js

const express = require("express");
const app = express();
const path = require("path");

const server = require("http").Server(app);
require("./socket/io.js").initialize(server);

const { authenticateJWT } = require("./auth.js");

// Set The Client File as Static Directory
app.use(express.static(path.join(__dirname, '../client')));

// Response for http://localhost/
app.get("/", (req, res) => {
    res.sendFile(path.resolve("login.html"));
});

// Response for forget password
app.get("/reset/", (req, res) => {
    // check whether there is a valid jwt in the url get
    authenticateJWT(req.query.token, (result) => {
        // response error page if invalid jwt
        if(!result || !result.forget)
        {
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.charset = "utf-8";
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

// Global function to get JSON data
global.getData = (data) => {
    try {
        return JSON.parse(data);
    }
    catch {
        return "";
    }
}