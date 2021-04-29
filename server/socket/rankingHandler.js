module.exports = (io) => {
    io.on("connection", (socket) => {
        // Add user to ranking queue
        socket.on("ranking-mode", () => {
            if(!usersInfo.has(socket.id)) return;
            
            var user = usersInfo.get(socket.id);
            if(ranking.inQueue(user)) return;
            if(room.getRoomId(user)) return;
            
            // call back function for match found
            ranking.enqueuePlayer(user, (player, opponent) => {
                var targetSocket = io.sockets.sockets.get(socketIds.get(opponent.id));
                
                // open new ranked room for two players
                var roomId = room.openRoom([player, opponent], true);
                
                // add both players to room
                socket.join(roomId);
                targetSocket.join(roomId);
                
                // send game state to room
                io.to(roomId).emit("ranking-match");
                io.to(roomId).emit("room-state", JSON.stringify(room.getRoomState(roomId)));
            });
        });

        // Remove user from ranking queue
        socket.on("quit-ranking-mode", () => {
            if(!usersInfo.has(socket.id)) return;

            var user = usersInfo.get(socket.id);
            ranking.dequeuePlayer(user);
        });
    });
}

const {usersInfo, socketIds} = require("../connection.js");
const ranking = require("../ranking.js");
const room = require("../room.js");