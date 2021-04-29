module.exports = (io) => {
    io.on("connection", (socket) => {
        // Join room
        socket.on("join-room", (roomId) => {
            if(!usersInfo.has(socket.id)) return;

            var user = usersInfo.get(socket.id);
            if(ranking.inQueue(user)) return;
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
            
            var user = usersInfo.get(socket.id);
            if(room.getRoomId(user)) return;
            if(ranking.inQueue(user)) return;

            var roomId = room.openRoom([user], false);
            socket.join(roomId);
            io.to(roomId).emit("room-state", JSON.stringify(room.getRoomState(roomId)));
        });

        // Switch user from player to sepectator mode
        socket.on("spectate", () => {
            if(!usersInfo.has(socket.id)) return;
            if(!room.getRoomId(usersInfo.get(socket.id))) return;

            var user = usersInfo.get(socket.id);
            var roomId = room.getRoomId(user);

            if(!room.spectate(user)) return;
            io.to(roomId).emit("room-state", JSON.stringify(room.getRoomState(roomId)));
        });

        // Switch user from spectator to player
        socket.on("play", () => {
            if(!usersInfo.has(socket.id)) return;
            if(!room.getRoomId(usersInfo.get(socket.id))) return;

            var user = usersInfo.get(socket.id);
            var roomId = room.getRoomId(user);

            var res = room.play(user);
            if(!res) return;
            io.to(roomId).emit("room-state", JSON.stringify(room.getRoomState(roomId)));
        });

        // Start game from the room
        socket.on("start-room", () => {
            if(!usersInfo.has(socket.id)) return;

            var user = usersInfo.get(socket.id);
            if(!room.getRoomId(user)) return;

            if(room.startRoom(user)) {
                var roomId = room.getRoomId(user);
                io.to(roomId).emit("room-started");
                io.to(roomId).emit("room-state", JSON.stringify(room.getRoomState(roomId)));
            }
        });

        // Leave room
        socket.on("leave-room", () => {
            if(!usersInfo.has(socket.id)) return;
            if(!room.getRoomId(usersInfo.get(socket.id))) return;

            var user = usersInfo.get(socket.id);
            var roomId = room.getRoomId(user);
            var roomstate = room.getRoomState(roomId);

            if(roomstate.start) {
                if(roomstate.players[0].id == user.id || roomstate.players[1].id == user.id) return;
            }
            
            // check whether the room is still exist after leaving
            socket.leave(roomId);
            if(room.leaveRoom(user)) {
                io.to(roomId).emit("room-state", JSON.stringify(room.getRoomState(roomId)));
            }
        });

        // Send message to room chat
        socket.on("room-chat", (msg) => {
            if(!usersInfo.has(socket.id)) return;
            if(!room.getRoomId(usersInfo.get(socket.id))) return;
            if(typeof msg != "string" || msg.length == 0) return;

            var user = usersInfo.get(socket.id);
            var roomId = room.getRoomId(user);
            
            io.to(roomId).emit("room-msg", JSON.stringify({username: user.name, msg: msg}));
        });
    });
}

const { usersInfo } = require("../connection.js");
const ranking = require("../ranking.js");
const room = require("../room.js");