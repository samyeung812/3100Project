module.exports = {
    openRoom,
    getRoomId,
    getRoomState,
    leaveRoom,
    joinRoom
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

function initRoomState(roomId, username) {
    var state = {
        roomId: roomId,
        start: false,
        host: username,
        participant: null,
        spectator: [],
        gameId: null
    }
    return state;
}

function leaveRoom(username) {
    var roomId = getRoomId(username);
    var state = getRoomState(roomId);

    if(!roomId || !state) return;

    if(state.host == username) {
        state.host = state.participant;
    }
    state.participant = null;
    rooms.delete(username);

    if(!state.host) {
        roomStates.delete(roomId);
        return true;
    }
    return false
}

function openRoom(username) {
    var roomId = generateCode(6);
    while(rooms.has(roomId)) {
        roomId = generateCode(6);
    }
    rooms.set(username, roomId);
    roomStates.set(roomId, initRoomState(roomId, username));
    return roomId;
}

function joinRoom(username, roomId) {
    var state = getRoomState(roomId);
    if(!state) return 1;
    if(state.participant) return 2;
    state.participant = username;
    rooms.set(username, roomId);
    return 0;
}