module.exports = (io) => {
    io.on("connection", (socket) => {
        // Handle player game move
        socket.on("clockwise", (data) => {
            if(!usersInfo.has(socket.id)) return;

            var {x, y} = getData(data);
            var user = usersInfo.get(socket.id);
            if(!room.getRoomId(user)) return;

            var roomId = room.getRoomId(user);
            var roomstate = room.getRoomState(roomId);
            if(!roomstate.start) return;

            var gamestate = roomstate.gamestate;
            if(roomstate.players[gamestate.now_player].id != user.id) return;
            var seed = rng();
            game.setSeed(seed);
            var winner = game.clockwise(gamestate, x, y, seed);
            if(winner == -2) return;
            if(winner >= 0) {
                var {score, lose} = updateBattlelog(roomstate, winner);
                var winnerSocket = socketIds.get(roomstate.players[winner].id);
                var loserSocket = socketIds.get(roomstate.players[winner^1].id);
                io.sockets.sockets.get(winnerSocket).emit("update-user-ranking", score);
                io.sockets.sockets.get(loserSocket).emit("update-user-ranking", lose);
                if(roomstate.ranked) {
                    io.to(roomId).emit("gameover",  JSON.stringify(null));
                    io.to(roomId).emit("clockwise", JSON.stringify({x: x, y: y, seed: seed}));
                    io.of('/').adapter.rooms.get(roomId).forEach(socketId => {
                        var u = usersInfo.get(socketId);
                        room.leaveRoom(u);
                        io.sockets.sockets.get(socketId).leave(roomId);
                    });
                } else {
                    roomstate.start = false;
                    roomstate.gamestate = null;
                    io.to(roomId).emit("gameover",  JSON.stringify(roomstate));
                    io.to(roomId).emit("clockwise", JSON.stringify({x: x, y: y, seed: seed}));
                }
            } else {
                io.to(roomId).emit("clockwise", JSON.stringify({x: x, y: y, seed: seed}));
            }
        });

        socket.on("anti-clockwise", (data) => {
            if(!usersInfo.has(socket.id)) return;

            var {x, y} = getData(data);
            var user = usersInfo.get(socket.id);
            if(!room.getRoomId(user)) return;

            var roomId = room.getRoomId(user);
            var roomstate = room.getRoomState(roomId);
            if(!roomstate.start) return;

            var gamestate = roomstate.gamestate;
            if(roomstate.players[gamestate.now_player].id != user.id) return;
            var seed = rng();
            game.setSeed(seed);
            var winner = game.anticlockwise(gamestate, x, y);
            if(winner == -2) return;
            if(winner >= 0) {
                var {score, lose} = updateBattlelog(roomstate, winner);
                var winnerSocket = socketIds.get(roomstate.players[winner].id);
                var loserSocket = socketIds.get(roomstate.players[winner^1].id);
                io.sockets.sockets.get(winnerSocket).emit("update-user-ranking", score);
                io.sockets.sockets.get(loserSocket).emit("update-user-ranking", lose);
                if(roomstate.ranked) {
                    io.to(roomId).emit("gameover",  JSON.stringify(null));
                    io.to(roomId).emit("anti-clockwise", JSON.stringify({x: x, y: y, seed: seed}));
                    io.of('/').adapter.rooms.get(roomId).forEach(socketId => {
                        var u = usersInfo.get(socketId);
                        room.leaveRoom(u);
                        io.sockets.sockets.get(socketId).leave(roomId);
                    });
                } else {
                    roomstate.start = false;
                    roomstate.gamestate = null;
                    io.to(roomId).emit("gameover",  JSON.stringify(roomstate));
                    io.to(roomId).emit("anti-clockwise", JSON.stringify({x: x, y: y, seed: seed}));
                }
            } else {
                io.to(roomId).emit("anti-clockwise", JSON.stringify({x: x, y: y, seed: seed}));
            }
        });
    });
}

const room = require("../room.js");
const game = require("../game.js");
const { usersInfo , socketIds } = require("../connection.js");
const { updateBattlelog } = require("./battlelogHandler");

// seed random for game
const seedrandom = require('seedrandom');
const rng = seedrandom();