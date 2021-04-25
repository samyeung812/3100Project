// Show Main Menu and Hide Game Board
function showMenu() {
    menuWrapper.style.display = "block";
    gameBoard.style.display = "none";
}

// Show Game Board and Hide Main Menu
function showGameBoard() {
    menuWrapper.style.display = "none";
    gameBoard.style.display = "block";
}

socket.on("clockwise", (data) =>　{
    var {x, y, seed} = JSON.parse(data);
    Math.seedrandom(seed);
    clockwise(gamestate, x, y, (winner) => {
        if(roomstate.players[winner].id == user.id) {
            user.ranking += rankingChange;
            var msg = ["You are the winner!"];
            if(roomstate.ranked) msg.push(`Your ranking: ${String(user.ranking)} (+${String(rankingChange)})`);
            showPopUpMessageBox("Congratulation", msg);
            rankingChange = 0;
        } else if(roomstate.players[winner ^ 1].id == user.id) {
            user.ranking += rankingChange;
            var msg = ["You has lost the game!"];
            if(roomstate.ranked) msg.push(`Your ranking: ${String(user.ranking)} (-${String(Math.abs(rankingChange))})`);
            showPopUpMessageBox("Game Over", msg);
            rankingChange = 0;
        } else {
            showPopUpMessageBox("Game Result", [roomstate.players[winner].name + " is the winner!"]);
        }
        roomstate = nextRoomstate;
        nextRoomstate = null;
        updateRoomState(roomstate);
        updating = false;
    });
});

socket.on("anti-clockwise", (data) =>　{
    var {x, y, seed} = JSON.parse(data);
    Math.seedrandom(seed);
    anticlockwise(gamestate, x, y, (winner) => {
        if(roomstate.players[winner].id == user.id) {
            user.ranking += rankingChange;
            var msg = ["You is the winner!"];
            if(roomstate.ranked) msg.push(`Your ranking: ${String(user.ranking)} (+${String(rankingChange)})`);
            showPopUpMessageBox("Congratulation", msg);
            rankingChange = 0;
        } else if(roomstate.players[winner ^ 1].id == user.id) {
            user.ranking += rankingChange;
            var msg = ["You has lost the game!"];
            if(roomstate.ranked) msg.push(`Your ranking: ${String(user.ranking)} (-${String(Math.abs(rankingChange))})`);
            showPopUpMessageBox("Game Over", msg);
            rankingChange = 0;
        } else {
            showPopUpMessageBox("Game Result", [roomstate.players[winner].name + " is the winner!"]);
        }
        roomstate = nextRoomstate;
        nextRoomstate = null;
        updateRoomState(roomstate);
        updating = false;
    });
});

socket.on("gameover", (data) => {
    nextRoomstate = JSON.parse(data);
});

socket.on("leave-game", (data) => {
    nextRoomstate = JSON.parse(data);
    
    if(roomstate.players[0].id == user.id || roomstate.players[1].id == user.id) {
        user.ranking += rankingChange;
        var msg = ["You is the winner!", "Your opponent have leave the game!", `Your ranking: ${String(user.ranking)} (+${String(rankingChange)})`];
        showPopUpMessageBox("Congratulation", msg);
        rankingChange = 0;
    }

    roomstate = nextRoomstate;
    nextRoomstate = null;
    updateRoomState(roomstate);
});