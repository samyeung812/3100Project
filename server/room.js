module.exports = {
    openRoom,
    getRoomId,
    getRoomState,
    leaveRoom,
    joinRoom,
    spectate,
    play
}

var rooms = new Map();  // get room id by username
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

function getRoomId(username) {
    if(!rooms.has(username)) return null;
    return rooms.get(username);
}

function getRoomState(roomId) {
    if(!roomStates.has(roomId)) return null;
    return roomStates.get(roomId);
}

function initRoomState(roomId, username, ranked) {
    var state = {
        roomId: roomId,
        start: false,
        ranked: ranked,
        players: [username],
        spectators: [],
        gamestate: null
    }
    return state;
}

function leaveRoom(username) {
    var roomId = getRoomId(username);
    var state = getRoomState(roomId);

    if(!roomId || !state) return;

    state.players = state.players.filter(e => e !== username);
    state.spectators = state.spectators.filter(e => e !== username);
    rooms.delete(username);

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

function openRoom(username, ranked) {
    var roomId = generateCode(6);
    while(rooms.has(roomId)) {
        roomId = generateCode(6);
    }
    rooms.set(username, roomId);
    roomStates.set(roomId, initRoomState(roomId, username, ranked));
    return roomId;
}

function joinRoom(username, roomId) {
    var state = getRoomState(roomId);
    if(!state) return 1;
    if(!state.players.length < 2) state.players.push(username);
    else state.spectators.push(username);
    rooms.set(username, roomId);
    return 0;
}

function spectate(username) {
    var roomId = getRoomId(username);
    var state = getRoomState(roomId);
    if(state.gamestate) return false;
    if(username != state.players[1]) return false;
    state.players = state.players.splice(0, 1);
    state.spectators.push(username);
    return true;
}

function play(username) {
    var roomId = getRoomId(username);
    var state = getRoomState(roomId);
    var spectatorsSize = state.spectators.length;

    state.spectators = state.spectators.filter(e => e != username);
    if(state.spectators.length == spectatorsSize) return false;
    state.players.push(username);
    return true;
}