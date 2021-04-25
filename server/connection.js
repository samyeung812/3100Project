const room = require("./room.js");
const { SQLQuery } = require("./database.js");
const io = require("./socket/io.js").getIO();

// Store User Online Information
var usersInfo = new Map();  // get user info by socket id
var socketIds = new Map();  //  get socket id by user id

// Update user online information
function updateUserConnection(user, socketId, callback)
{
    // check whether user logged in somewhere else
    if (socketIds.has(user.id) && socketIds.get(user.id) != socketId) {
        // try to inform the user and disconnect
        var target = socketIds.get(user.id);
        var targetSocket = io.sockets.sockets.get(target);
        if(targetSocket) {
            targetSocket.emit("popup-message", JSON.stringify({title: "Warning", messages: ["You Account is Logged in Somewhere Else!"]}));
            targetSocket.disconnect();   
        }
        usersInfo.delete(target);
    }

    // check whether the socket logged in for other account
    if (usersInfo.has(socketId) && usersInfo.get(socketId).id != user.id) {
        // try to inform the user and disconnect
        var target = socketIds.get(usersInfo.get(socketId).id);
        var targetSocket = io.sockets.sockets.get(target);
        if(targetSocket) {
            targetSocket.emit("popup-message", JSON.stringify({title: "Warning", messages: ["You Account is Logged in Somewhere Else!"]}));
            targetSocket.disconnect();
        }
        socketIds.delete(user.id);
    }

    // set user online information
    socketIds.set(user.id, socketId);

    var queryString = "SELECT ranking FROM leaderboard WHERE userid=?;";
    SQLQuery(queryString, [user.id], (result, error) => {
        if(!result) return;
        user.ranking = result[0].ranking;
        usersInfo.set(socketId, user);
        callback();
    });
}

// Detect whether user is disconnected from the game
function disconnectUser(user) {
    // check whether user logged in
    if (!socketIds.has(user.id) && room.getRoomId(user)) {
        // remove user from the game
        var roomId = room.getRoomId(user);
        var roomstate = room.getRoomState(roomId);
        if(!roomstate.start){
            room.leaveRoom(user);
            io.to(roomId).emit("room-state", JSON.stringify(room.getRoomState(roomId)));
            console.log(user.name + " disconnected from the room");
        } else {
            if(roomstate.players[0].id != user.id && roomstate.players[1].id != user.id) {
                room.leaveRoom(user);
                io.to(roomId).emit("room-state", JSON.stringify(room.getRoomState(roomId)));
                console.log(user.name + " disconnected from the room");
            } else {
                var winner = roomstate.players[0].id == user.id ? 1 : 0;
                var {score} = updateBattlelog(roomstate, winner);
                var winnerSocket = socketIds.get(roomstate.players[winner].id);
                
                if(io.sockets.sockets.has(winnerSocket)) io.sockets.sockets.get(winnerSocket).emit("update-user-ranking", score);
                
                room.leaveRoom(user);
                console.log(user.name + " disconnected from the room");
                
                if(roomstate.ranked) {
                    if(io.of('/').adapter.rooms.has(roomId)) {
                        io.to(roomId).emit("leave-game",  JSON.stringify(null));
                        io.of('/').adapter.rooms.get(roomId).forEach(socketId => {
                            var u = usersInfo.get(socketId);
                            room.leaveRoom(u);
                            io.sockets.sockets.get(socketId).leave(roomId);
                        });
                    }
                } else {
                    roomstate.start = false;
                    roomstate.gamestate = null;
                    io.to(roomId).emit("leave-game",  JSON.stringify(roomstate));
                }
            }
        }
    }
}

module.exports = {
    usersInfo,
    socketIds,
    updateUserConnection,
    disconnectUser
};