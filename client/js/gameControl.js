var mouseIsDown = false;
var clickPos = {
    x: 0,
    y: 0
};

function getSelected() {
    if(!mouseIsDown) return {x: -8, y: -8};
    var x = parseInt(clickPos.x / blockSize);
    var y = parseInt(clickPos.y / blockSize);
    return {x: x, y: y};
}

canvas.addEventListener("mousedown", (e) => {
    if(updating) return;
    if(roomstate.players[gamestate.now_player].id != user.id) return;
    if(mouseIsDown) return;
    clickPos.x = e.x - canvas.offsetLeft;
    clickPos.y = e.y - canvas.offsetTop;
    mouseIsDown = true;
    var {x, y} = getSelected();
    if(x == 7 || y == 7) {
        mouseIsDown = false;
        return;
    }
    boardDisplay();
});

canvas.addEventListener("mouseup", (e) => {
    if(!mouseIsDown) return;
    mouseIsDown = false;
    boardDisplay();
});

canvas.addEventListener("mousemove", (e) => {
    if(!mouseIsDown) return;
    var {x, y} = getSelected();
    var curX = e.x - canvas.offsetLeft;
    var curY = e.y - canvas.offsetTop;
    if(curX > clickPos.x + blockSize * 0.6) {
        mouseIsDown = false;
        socket.emit("clockwise", JSON.stringify({x: x, y: y}));
        boardDisplay();
    }
    else if(curY > clickPos.y + blockSize * 0.6) {
        mouseIsDown = false;
        socket.emit("anti-clockwise", JSON.stringify({x: x, y: y}));
        boardDisplay();
    }
});

canvas.addEventListener("touchstart", (e) => {
    if(updating) return;
    if(roomstate.players[gamestate.now_player].id != user.id) return;
    if(mouseIsDown) return;
    clickPos.x = e.touches[0].clientX - canvas.offsetLeft;
    clickPos.y = e.touches[0].clientY - canvas.offsetTop;
    mouseIsDown = true;
    boardDisplay();
});

canvas.addEventListener("touchend", (e) => {
    if(!mouseIsDown) return;
    mouseIsDown = false;
    boardDisplay();
});

canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    if(!mouseIsDown) return;
    var {x, y} = getSelected();
    var curX = e.touches[0].clientX - canvas.offsetLeft;
    var curY = e.touches[0].clientY - canvas.offsetTop;
    if(curX > clickPos.x + blockSize * 0.6) {
        mouseIsDown = false;
        socket.emit("clockwise", JSON.stringify({x: x, y: y}));
        boardDisplay();
    }
    else if(curY > clickPos.y + blockSize * 0.6) {
        mouseIsDown = false;
        socket.emit("anti-clockwise", JSON.stringify({x: x, y: y}));
        boardDisplay();
    }
});