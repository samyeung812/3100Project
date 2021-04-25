module.exports = (io) => {
    io.on("connection", (socket) => {
        socket.on("get-battlelog", () => {
            if(!usersInfo.has(socket.id)) return;
            var user = usersInfo.get(socket.id);

            var queryString = "SELECT a1.username as you, a2.username as opponent, b.ranked, b.win, b.rankchange from `battlelog` b INNER JOIN `accounts` a1 ON a1.userid=? INNER JOIN `accounts` a2 ON a2.userid = b.opponentid WHERE b.userid=? ORDER BY b.battledate DESC;";
            SQLQuery(queryString, [user.id, user.id], (result, error) => {
                if(!result) return;
                socket.emit("battlelog-result", JSON.stringify(result));
            });
        });

        socket.on("search-battlelog", (username) => {
            if(typeof username != "string") return;
            if(!usersInfo.has(socket.id)) return;
            var queryString = "SELECT a1.username as you, a2.username as opponent, b.ranked, b.win, b.rankchange from `battlelog` b INNER JOIN `accounts` a1 ON a1.userid=b.userid INNER JOIN `accounts` a2 ON a2.userid = b.opponentid WHERE a1.username=? ORDER BY b.battledate DESC;";
            SQLQuery(queryString, [username], (result, error) => {
                if(!result) return;
                socket.emit("battlelog-result", JSON.stringify(result));
            });
        });
    });
}

module.exports.updateBattlelog = updateBattlelog;

const { usersInfo } = require("../connection.js");
const { SQLQuery } = require("../database.js");

function updateBattlelog(roomstate, winner) {
    var players = roomstate.players;
    if(players.length == 0) return {score: 0, lose: 0};
    var score = 0;
    if(roomstate.ranked) score = 30 - Math.min(parseInt(Math.abs(players[0].ranking - players[1].ranking) / 50), 20);
    var lose = -Math.min(players[winner ^ 1].ranking, score);
    if(roomstate.ranked) players[winner ^ 1].ranking += lose;
    if(roomstate.ranked) players[winner].ranking += score;
    var queryString1 = "INSERT INTO battlelog (userid, opponentid, ranked, win, rankchange) VALUES (?,?,?,?,?);";
    var queryString2 = "INSERT INTO battlelog (userid, opponentid, ranked, win, rankchange) VALUES (?,?,?,?,?);";
    var queryString3 = "UPDATE leaderboard SET ranking=? WHERE userid=?;";
    var queryString4 = "UPDATE leaderboard SET ranking=? WHERE userid=?;";
    SQLQuery(queryString1, [players[0].id, players[1].id, roomstate.ranked, winner == 0, winner == 0 ? score : lose], (result, erorr) => {
        if(!result) return;
    });
    SQLQuery(queryString2, [players[1].id, players[0].id, roomstate.ranked, winner == 1, winner == 1 ? score : lose], (result, erorr) => {
        if(!result) return;
    });
    if(roomstate.ranked) {
        SQLQuery(queryString3, [players[0].ranking, players[0].id], (result, erorr) => {
            if(!result) return;
        });
        SQLQuery(queryString4, [players[1].ranking, players[1].id], (result, erorr) => {
            if(!result) return;
        });
    }
    return {score: score, lose: lose};
}