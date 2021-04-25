
var blockSize;

function updateGameBoard(state = gamestate) {
    if(!roomstate || !gamestate) return;
    var gameWidth = gameBoard.clientWidth;
    var gameHeight = gameBoard.clientHeight;
    blockSize = Math.min(gameWidth / 8, gameHeight * 0.7 / 8);
    stats.innerHTML = "";
    for(var i = 0; i < 2; i++) {
        var playerDiv = document.createElement("div");
        playerDiv.className = "player";
        if(state.now_player == i) {
            if(roomstate.players[i].id == user.id) playerDiv.className += " your-turn";
            else playerDiv.className += " opponent-turn";
        }
        var username = document.createElement("div");
        var HPDiv = document.createElement("div");
        var attackDiv = document.createElement("div");
        var defenceDiv = document.createElement("div");

        username.innerText = roomstate.players[i].name;
        HPDiv.innerText = "HP: " + state.player[i].HP;
        attackDiv.innerText = "Attack: " + state.player[i].attack;
        defenceDiv.innerText = "Defence: " + state.player[i].defence;

        playerDiv.appendChild(username);
        playerDiv.appendChild(HPDiv);
        playerDiv.appendChild(attackDiv);
        playerDiv.appendChild(defenceDiv);
        stats.appendChild(playerDiv);
    }
    canvas.width = 8 * blockSize;
    canvas.height = 8 * blockSize;
    boardDisplay(gamestate.chess_board);
}

function boardDisplay(chess_board = gamestate.chess_board) {
    ctx.globalAlpha = 1;
    for(var i = 0; i < chess_board.length; i++) {
        for(var j = 0; j < chess_board[i].length; j++) {
            if((i&1)^(j&1)) ctx.fillStyle = "#392613";
            else ctx.fillStyle = "#604020";
            ctx.fillRect(j * blockSize, i * blockSize, blockSize, blockSize);
            drawCrystal(j, i, chess_board[i][j]);
        }
    }
    var {x, y} = getSelected();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#ff6666";
    ctx.strokeRect(x * blockSize + 1, y * blockSize + 1, 2 * blockSize - 2, 2 * blockSize - 2);
    ctx.strokeRect(x * blockSize - 1, y * blockSize - 1, 2 * blockSize + 2, 2 * blockSize + 2);
    ctx.strokeStyle = "#ff0000";
    ctx.strokeRect(x * blockSize, y * blockSize, 2 * blockSize, 2 * blockSize);
    ctx.globalAlpha = 0.75;
    ctx.drawImage(images[9], x * blockSize + 0.5 * blockSize, y * blockSize, 1.5 * blockSize, blockSize);
    ctx.drawImage(images[10], x * blockSize, y * blockSize + 0.5 * blockSize, blockSize, 1.5 * blockSize);
}

function drawCrystal(x, y, number) {
    ctx.drawImage(getCrystal(number), x * blockSize, y * blockSize, blockSize, blockSize);
}

function getCrystal(number) {
    if(number < 1 || number > 8) return images[0];
    return images[number];
}

function updateGameStats(damage) {
    statsUpdate.innerHTML = "";
    statsUpdate.style.width = String(8 * blockSize) * 0.8 + "px";

    var msg = document.createElement("div");
    msg.className = "horizontal-container";
    var attribute = document.createElement("div");
    attribute.innerHTML = "HP Recovery: ";
    var value = document.createElement("div");
    value.innerText = Math.max(0, dissolve_value.HP_increase);
    msg.appendChild(attribute);
    msg.appendChild(value);
    statsUpdate.appendChild(msg);

    msg = document.createElement("div");
    msg.className = "horizontal-container";
    attribute = document.createElement("div");
    attribute.innerHTML = "Attack Increase: ";
    value = document.createElement("div");
    value.innerText = dissolve_value.attack_increase;
    msg.appendChild(attribute);
    msg.appendChild(value);
    statsUpdate.appendChild(msg);


    msg = document.createElement("div");
    msg.className = "horizontal-container";
    attribute = document.createElement("div");
    attribute.innerHTML = "Defence Increase: ";
    value = document.createElement("div");
    value.innerText = dissolve_value.defence_increase;
    msg.appendChild(attribute);
    msg.appendChild(value);
    statsUpdate.appendChild(msg);

    msg = document.createElement("div");
    msg.className = "horizontal-container";
    attribute = document.createElement("div");
    attribute.innerHTML = "Damage Dealt: ";
    value = document.createElement("div");
    value.innerText = damage;
    msg.appendChild(attribute);
    msg.appendChild(value);
    statsUpdate.appendChild(msg);
}