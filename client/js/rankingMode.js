function showRankingMode() {
    rankingWrapper.style.display = "block";
}

function closeRankingMode() {
    rankingWrapper.style.display = "none";
}

socket.on("ranking-match", (data) => {
    closeRankingMode();
});

rankingBtn.addEventListener("click", () => {
    ranking(socket);
});

closeRankingModeBtn.addEventListener("click", () => {
    closeRanking(socket);
});

const ranking = (socket) => {
    showRankingMode();
    socket.emit("ranking-mode");
};

const closeRanking = (socket) => {
    closeRankingMode();
    socket.emit("quit-ranking-mode");
};