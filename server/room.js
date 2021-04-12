module.exports = {
    openRoom,
    getRoomId,
    getRoomIdByUserID,
    getRoomState,
    leaveRoom,
    joinRoom,
    spectate,
    spectateFriend,
    play,
    startRoom
}

var rooms = new Map();  // get room id by user id
var roomStates = new Map(); // get room state by room id

// Generate random code with specific length
const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
function generateCode(len) {
    var res = "";
    for(var i = 0; i < len; i++) {
        res += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return res;
}

function getRoomId(user) {
    if(!user) return null;
    if(!rooms.has(user.id)) return null;
    return rooms.get(user.id);
}

function getRoomIdByUserID(userid) {
    if(!rooms.has(userid)) return null;
    return rooms.get(userid);
}

function getRoomState(roomId) {
    if(!roomStates.has(roomId)) return null;
    return roomStates.get(roomId);
}

function initRoomState(roomId, players, ranked) {
    var state = {
        roomId: roomId,
        start: ranked,
        ranked: ranked,
        players: players,
        spectators: [],
        gamestate: null
    }
    return state;
}

const game = require("./game.js");

function leaveRoom(user) {
    var roomId = getRoomId(user);
    var state = getRoomState(roomId);

    if(!roomId || !state) return;

    state.players = state.players.filter(e => e.id !== user.id);
    state.spectators = state.spectators.filter(e => e.id !== user.id);
    rooms.delete(user.id);

    if(state.players.length == 0) {
        if(state.spectators.length == 0) {
            roomStates.delete(roomId);
            return false;
        }
        state.players.push(state.spectators[0]);
        state.spectators = state.spectators.splice(1);
    }
    return true;
}

function openRoom(users, ranked) {
    var roomId = generateCode(6);
    while(rooms.has(roomId)) {
        roomId = generateCode(6);
    }
    users.forEach(user => {
        rooms.set(user.id, roomId); 
    });
    roomStates.set(roomId, initRoomState(roomId, users, ranked));
    if(users.length == 2 && ranked) {
        var roomState = getRoomState(roomId);
        roomState.gamestate = game.initGameState();
    }
    return roomId;
}

function startRoom(user) {
    if(!getRoomId(user)) return false;
    var roomId = getRoomId(user);
    var roomState = getRoomState(roomId);
    if(user.id == roomState.players[0].id && roomState.players.length == 2) {
        roomState.start = true;
        roomState.gamestate = game.initGameState();
        return true;
    }
    return false;
}

function joinRoom(user, roomId) {
    var state = getRoomState(roomId);
    if(!state) return 1;
    if(!state.players.length < 2) state.players.push(user);
    else state.spectators.push(user);
    rooms.set(user.id, roomId);
    return 0;
}

function spectate(user) {
    var roomId = getRoomId(user);
    var state = getRoomState(roomId);
    if(state.gamestate) return false;
    if(user.id != state.players[1].id) return false;
    state.players = state.players.splice(0, 1);
    state.spectators.push(user);
    return true;
}

function spectateFriend(roomId, user) {
    var state = getRoomState(roomId);
    if(getRoomId(user)) return false;
    if(state.ranked && !state.start) return false;
    state.spectators.push(user);
    rooms.set(user.id, roomId);
    return true;
}

function play(user) {
    var roomId = getRoomId(user);
    var state = getRoomState(roomId);
    var spectatorsSize = state.spectators.length;

    state.spectators = state.spectators.filter(e => e.id != user.id);
    if(state.spectators.length == spectatorsSize) return false;
    state.players.push(user);
    return true;
}