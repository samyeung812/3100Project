module.exports = (io) => {
    io.on("connection", (socket) => {
        socket.on("ranking-mode", () => {
            if(!usersInfo.has(socket.id)) return;
            
            var user = usersInfo.get(socket.id);
            if(ranking.inQueue(user)) return;

            ranking.enqueuePlayer(user, (player, opponent) => {
                var targetSocket = io.sockets.sockets.get(socketIds.get(opponent.id));
                
                var roomId = room.openRoom([player, opponent], true);
                
                socket.join(roomId);
                targetSocket.join(roomId);

                io.to(roomId).emit("ranking-match");
                io.to(roomId).emit("room-state", JSON.stringify(room.getRoomState(roomId)));
            });
        });

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