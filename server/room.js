const game = require("./game.js");

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

// Get room id of the user
function getRoomId(user) {
    if(!user) return null;
    if(!rooms.has(user.id)) return null;
    return rooms.get(user.id);
}

// Get room id of the user by user id
function getRoomIdByUserID(userid) {
    if(!rooms.has(userid)) return null;
    return rooms.get(userid);
}

// Get room state by room id
function getRoomState(roomId) {
    if(!roomStates.has(roomId)) return null;
    return roomStates.get(roomId);
}

// Initialize room state
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

// Remove user from the room
function leaveRoom(user) {
    var roomId = getRoomId(user);
    var state = getRoomState(roomId);

    if(!roomId || !state) return;

    // remove user from the room
    state.players = state.players.filter(e => e.id !== user.id);
    state.spectators = state.spectators.filter(e => e.id !== user.id);
    rooms.delete(user.id);

    // check whether the room has player
    if(state.players.length == 0) {
        // check whether the room has spectators
        if(state.spectators.length == 0) {
            // remove the room
            roomStates.delete(roomId);
            return false;
        }

        // set the first spectator to be the player
        state.players.push(state.spectators[0]);
        state.spectators = state.spectators.splice(1);
    }
    return true;
}

// Open new room for users
function openRoom(users, ranked) {
    // generate random room id
    var roomId = generateCode(6);
    while(rooms.has(roomId)) {
        roomId = generateCode(6);
    }

    // update rooms information
    users.forEach(user => {
        rooms.set(user.id, roomId); 
    });

    // update room state information
    roomStates.set(roomId, initRoomState(roomId, users, ranked));
    if(users.length == 2 && ranked) {
        // initialize the game if ranked
        var roomState = getRoomState(roomId);
        roomState.gamestate = game.initGameState();
    }
    return roomId;
}

// Start the game in the room
function startRoom(user) {
    if(!getRoomId(user)) return false;
    var roomId = getRoomId(user);
    var roomState = getRoomState(roomId);
    if(roomState.start) return;

    // check whether user is the host
    if(user.id == roomState.players[0].id && roomState.players.length == 2) {
        roomState.start = true;
        roomState.gamestate = game.initGameState();
        return true;
    }
    return false;
}

// Join room by room id
function joinRoom(user, roomId) {
    var state = getRoomState(roomId);
    if(!state) return 1;

    // check whether player is full
    if(!state.players.length < 2) state.players.push(user);
    else state.spectators.push(user);

    // update rooms information
    rooms.set(user.id, roomId);
    return 0;
}

// Switch player to spectator mode
function spectate(user) {
    var roomId = getRoomId(user);
    var state = getRoomState(roomId);

    // check whether the game is start
    if(state.start) return false;
    // check whether user is not the host
    if(user.id != state.players[1].id) return false;

    // update room state
    state.players = state.players.splice(0, 1);
    state.spectators.push(user);
    return true;
}

// Switch spectator to player
function play(user) {
    var roomId = getRoomId(user);
    var state = getRoomState(roomId);
    
    // check whether player is full
    if(state.players.length >= 2) return false;

    // remove user from the spectators
    var spectatorsSize = state.spectators.length;
    state.spectators = state.spectators.filter(e => e.id != user.id);
    // check whether user is removed
    if(state.spectators.length == spectatorsSize) return false;
    // add user to players
    state.players.push(user);
    return true;
}

// Join room from friend list
function spectateFriend(roomId, user) {
    var state = getRoomState(roomId);
    if(getRoomId(user)) return false;
    // add user to the room
    state.spectators.push(user);
    // update rooms information
    rooms.set(user.id, roomId);
    return true;
}

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