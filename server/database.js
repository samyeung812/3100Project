// SQL
// CREATE DATABASE nodeserverdb;
// CREATE TABLE accounts (userid int NOT NULL AUTO_INCREMENT, username varchar(20) NOT NULL, email varchar(200) NOT NULL, password varchar(100) NOT NULL, PRIMARY KEY (userid), CONSTRAINT valid_name UNIQUE (username));
// CREATE TABLE leaderboard (userid int NOT NULL AUTO_INCREMENT, ranking bigint, FOREIGN KEY (userid) REFERENCES accounts(userid), PRIMARY KEY (userid));
// CREATE TABLE friendship (id1 int NOT NULL, id2 int NOT NULL, status tinyint NOT NULL, FOREIGN KEY (id1) REFERENCES accounts(userid), FOREIGN KEY (id2) REFERENCES accounts(userid), PRIMARY KEY (id1, id2), CONSTRAINT valid CHECK (id1 < id2));
// friendship status 0 for friend, 1 for id1 pending id2, 2 for id2 pending id1, 3 for id1 blocked id2, 4 for id2 blocked id1, 5 for both blocked
// CREATE TABLE messages (fromid int NOT NULL, toid int NOT NULL, content varchar(255), createdate timestamp DEFAULT NOW(), unread boolean DEFAULT 1, FOREIGN KEY (fromid) REFERENCES accounts(userid), FOREIGN KEY (toid) REFERENCES accounts(userid));
// CREATE TABLE battlelog (userid int NOT NULL, opponentid int NOT NULL, ranked boolean NOT NULL, win boolean NOT NULL, rankchange smallint NOT NULL, battledate timestamp DEFAULT NOW(), FOREIGN KEY (userid) REFERENCES accounts(userid), FOREIGN KEY (opponentid) REFERENCES accounts(userid));

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

module.exports = {
    SQLQuery
}