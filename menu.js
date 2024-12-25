const startBtn = document.getElementById('startBtn')
const menu = document.getElementById('menu')
const game = document.getElementById('game')

// username
const usernameText = document.getElementById('username');
const username = document.getElementById('userInput');
username.addEventListener('input', function() {
    usernameText.innerHTML = username.value;
});

startBtn.addEventListener("click",function () {
    usernameText.innerHTML = username.value;
    menu.style.display = 'none';
    game.style.display = 'flex';
    start();
    console.log('wtf');
    document.body.style.backgroundColor = 'white';
})

function updateScoreboard() {
    let scoreboardLocal = JSON.parse(localStorage.getItem("scoreboard"))
    scoreboardLocal = scoreboardLocal.sort((a, b) => {
        return b.point - a.point
    })

    const top10Scores = scoreboardLocal.slice(0,10)

    const scoreTable = document.getElementById("scoreTable")

    scoreTable.innerHTML = "<tr><th>Rank</th><th>Username</th><th>Point</th></tr>";

    top10Scores.forEach((val, index) => {
        const row = document.createElement("tr")
        row.innerHTML = `<td>${index + 1}</td><td>${val.name}</td><td>${val.point}</td>`
        scoreTable.appendChild(row)
    });
}
updateScoreboard();

const leaderboard = document.getElementById('leaderboard');
const leaderboardBtn = document.getElementById('leaderboardBtn');
const backFromLeaderboard = document.getElementById('backFromLeaderboard');
leaderboardBtn.addEventListener('click', function () {
    menu.style.display = 'none';
    leaderboard.style.display = 'flex';
    updateScoreboard();
})
backFromLeaderboard.addEventListener('click', function() {
    menu.style.display = 'flex';
    leaderboard.style.display = 'none';
})

const difficultyText = document.getElementById('difficultyText');
const difficulty = document.getElementById('difficulty');
const difficultyBtn = document.getElementById('difficultyBtn');
const easyDifficultyBtn = document.getElementById('easyDifficultyBtn');
const mediumDifficultyBtn = document.getElementById('mediumDifficultyBtn');
const hardDifficultyBtn = document.getElementById('hardDifficultyBtn');
difficultyBtn.addEventListener('click', function() {
    menu.style.display = 'none';
    difficulty.style.display = 'flex';
});
easyDifficultyBtn.addEventListener('click', function() {
    menu.style.display = 'flex';
    difficulty.style.display = 'none';
    duckSpawnTime = 5000; // 5 detik
    difficultyText.innerHTML = 'Easy';
})
mediumDifficultyBtn.addEventListener('click', function() {
    menu.style.display = 'flex';
    difficulty.style.display = 'none';
    duckSpawnTime = 3000; // 3 detik
    difficultyText.innerHTML = 'Medium';
})
hardDifficultyBtn.addEventListener('click', function() {
    menu.style.display = 'flex';
    difficulty.style.display = 'none';
    duckSpawnTime = 2000; // 2 detik
    difficultyText.innerHTML = 'Hard';
})