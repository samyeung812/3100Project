module.exports = (io) => {
    io.on("connection", (socket) => {
        // get leaderboard information
        socket.on("get-leaderboard", () => {
            if(!usersInfo.has(socket.id)) return;

            var queryString = "SELECT a.username, l.ranking FROM `leaderboard` l INNER JOIN `accounts` a ON l.userid = a.userid ORDER BY l.ranking DESC LIMIT 100;";
            
            // get the top 100 players username and ranking
            SQLQuery(queryString, [], (result, erorr) => {
                if(!result) return;
                socket.emit("leaderboard-result", JSON.stringify(result));
            });
        });

        // get user ranking by username
        socket.on("search-ranking", (username) => {
            if(typeof username != "string") return;
            if(!usersInfo.has(socket.id)) return;

            var queryString = "SELECT a.username, l.ranking FROM `leaderboard` l INNER JOIN `accounts` a ON l.userid = a.userid WHERE a.username=?;";

            // get ranking by username
            SQLQuery(queryString, [username], (result, error) => {
                if(!result) return;
                socket.emit("leaderboard-result", JSON.stringify(result));
            });
        });
    });
}

const { usersInfo } = require("../connection.js");
const { SQLQuery } = require("../database.js");