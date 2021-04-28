// Store User Online Information
const usersInfo = new Map();  // get user info by socket id
const socketIds = new Map();  //  get socket id by user id

const room = require("./room.js");
const { SQLQuery } = require("./database.js");
const io = require("./socket/io.js").getIO();

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

    // get user ranking
    var queryString = "SELECT ranking FROM leaderboard WHERE userid=?;";
    SQLQuery(queryString, [user.id], (result, error) => {
        if(!result) return;
        user.ranking = result[0].ranking;
        usersInfo.set(socketId, user);
        callback();
    });
}

// Detect whether user is disconnected from the room/game
function disconnectUser(user, updateBattlelog) {
    // check whether user logged in
    if (!socketIds.has(user.id) && room.getRoomId(user)) {
        var roomId = room.getRoomId(user);
        var roomstate = room.getRoomState(roomId);
        
        if(!roomstate.start){
            // remove user from the room
            room.leaveRoom(user);
            io.to(roomId).emit("room-state", JSON.stringify(room.getRoomState(roomId)));
            console.log(user.name + " disconnected from the room");
        } else {
            // remove user from the game

            // check whether user is spectator
            if(roomstate.players[0].id != user.id && roomstate.players[1].id != user.id) {
                room.leaveRoom(user);
                io.to(roomId).emit("room-state", JSON.stringify(room.getRoomState(roomId)));
                console.log(user.name + " disconnected from the room");
            } else {
                // end game and update game result
                var winner = roomstate.players[0].id == user.id ? 1 : 0; // find the winner
                var { score } = updateBattlelog(roomstate, winner); // update battlelog and get the score
                var winnerSocketId = socketIds.get(roomstate.players[winner].id); // get socket id of the winner
                
                // inform the winner
                if(io.sockets.sockets.has(winnerSocketId)) io.sockets.sockets.get(winnerSocketId).emit("update-user-ranking", score);
                
                // remove user from the room
                room.leaveRoom(user);
                console.log(user.name + " disconnected from the room");
                
                // remove the room if the game is ranked
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
                    // update the gamestate of the room
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