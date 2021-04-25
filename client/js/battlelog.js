closeBattlelogBtn.addEventListener("click", closeBattlelog);
function closeBattlelog() {
    battlelogWrapper.style.display = "none";
    battlelog.innerHTML = "";
    battlelogBox.reset();
}

function updateBattlelog(results) {
    battlelog.innerHTML = "<div class='grid-container'><div>You</div><div>Opponent</div><div>Ranked</div><div>Result</div><div>Rank Changed</div></div>";
    results.forEach(result => {
        var outterDiv = document.createElement("div");
        outterDiv.className = "grid-container";
        var div = document.createElement("div");
        div.className = "username";
        div.innerText = result.you;
        outterDiv.appendChild(div);

        div = document.createElement("div");
        div.innerText = result.opponent;
        outterDiv.appendChild(div);
        
        div = document.createElement("div");
        div.innerText = result.ranked > 0 ? "✔" : "✖";
        outterDiv.appendChild(div);
        
        div = document.createElement("div");
        div.innerText = result.win > 0 ? "👑" : "💀";
        outterDiv.appendChild(div);
        
        div = document.createElement("div");
        div.innerText = result.ranked > 0 ? (result.rankchange > 0 ? "+" + String(result.rankchange) : "-" + String(Math.abs(result.rankchange))) : "---";
        outterDiv.appendChild(div);
        
        battlelog.appendChild(outterDiv);
    });
}

socket.on("battlelog-result", (result) => {
    var battlelogResult = JSON.parse(result);
    updateBattlelog(battlelogResult);
});

battlelogBox.onsubmit = () => {
    searchBattlelog(socket);
    return false;
};

battlelogBtn.addEventListener("click", () => {
    showBattlelog(socket);
});

const showBattlelog = (socket) => {
    socket.emit("get-battlelog");
    battlelog.innerHTML = "";
    battlelogWrapper.style.display = "block";
};

const searchBattlelog = (socket) => {
    var username = battlelogBox.querySelector("input[name='username']").value;
    socket.emit("search-battlelog", username);
    battlelogBox.reset();
};