module.exports = {
    initialize,
    getIO
}

var io = null;

function initialize(server) {
    io = require("socket.io")(server);
    require("./disconnectHandler.js")(io);
    require("./loginHandler.js")(io);
    require("./accountHandler.js")(io);
    require("./forgetPasswordHandler.js")(io);
    require("./rankingHandler.js")(io);
    require("./roomHandler.js")(io);
    require("./leaderboardHandler.js")(io);
    require("./battlelogHandler.js")(io);
    require("./friendHandler.js")(io);
    require("./gameHandler.js")(io);
}

function getIO() {
    return io;
}