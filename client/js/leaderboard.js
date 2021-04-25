closeLeaderboardBtn.addEventListener("click", closeLeaderboard);
function closeLeaderboard() {
    leaderboardWrapper.style.display = "none";
    leaderboard.innerHTML = "";
    leaderboardBox.reset();
}

function updateLeaderboard(players) {
    leaderboard.innerHTML = "<div class='grid-container'><div>Username</div><div>Ranking</div></div>";

    players.forEach(player => {
        var outterDiv = document.createElement("div");
        outterDiv.className = "grid-container";
        var div = document.createElement("div");
        div.className = "username";
        div.innerText = player.username;
        outterDiv.appendChild(div);
        
        div = document.createElement("div");
        div.innerText = player.ranking;
        outterDiv.appendChild(div);
        
        leaderboard.appendChild(outterDiv);
    });
}

socket.on("leaderboard-result", (result) => {
    var players = JSON.parse(result);
    updateLeaderboard(players);
});

leaderboardBox.onsubmit = () => {
    searchRanking(socket);
    return false;
};

leaderboardBtn.addEventListener("click", () => {
    showLeaderboard(socket);
});

const showLeaderboard = (socket) => {
    socket.emit("get-leaderboard");
    leaderboard.innerHTML = "";
    leaderboardWrapper.style.display = "block";
};

const searchRanking = (socket) => {
    var username = leaderboardBox.querySelector("input[name='username']").value;
    socket.emit("search-ranking", username);
    leaderboardBox.reset();
};