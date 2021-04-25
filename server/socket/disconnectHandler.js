module.exports = (io) => {
    io.on("connection", (socket) => {
        // Wait for user reconnection
        socket.on("disconnect", () => {
            // check if user is not logged in
            if (!usersInfo.has(socket.id)) return;

            var user = usersInfo.get(socket.id);

            // remove user from ranking matching
            if(ranking.inQueue(user)) {
                ranking.dequeuePlayer(user);
            }

            // wait user to reconnect for 0.5 minutes
            var minutes = 0.5;
            if (room.getRoomId(user)) {
                var roomId = room.getRoomId(user);
                socket.leave(roomId);
                setTimeout(disconnectUser, minutes * 60 * 1000, usersInfo.get(socket.id));
            }

            // remove user online information
            console.log(user.name, "logout");
            socketIds.delete(user.id);
            usersInfo.delete(socket.id);
        });
    });
}

const { usersInfo, socketIds, disconnectUser } = require("../connection.js");
const room = require("../room.js");
const ranking = require("../ranking.js");