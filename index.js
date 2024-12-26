const canvas = document.getElementById("canvas")
canvas.width = 1080;
canvas.height = 648;
const c = canvas.getContext("2d");

const backgroundImg = new Image();
backgroundImg.src = './assets/Background.png';
const duckImg = new Image();
duckImg.src = './assets/duckhunt_various_sheet_cr-removebg-preview.png';

const pointText = document.getElementById('points');
let point = 0;
const healthText = document.getElementById('health');
let health = 3;
let ducks = [];
let duckSpawnTime = 2000; // 2 detik

function drawBackground() {
    c.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
};

function drawDucks(duck) {
    c.drawImage(duckImg, duck.x, duck.y, 41, 33);
};

function spawnDuck() {
    const newDuck = {
        x:canvas.width,
        y: Math.random() * (canvas.height - 250),
    };
    ducks.push(newDuck);
    console.log(ducks)
}

function checkHit(x, y) {
    for (let i = 0; i < ducks.length; i++) {
        const duck = ducks[i];
        const rightSide = duck.x + 41
        const leftSide = duck.x
        const bottomSide = duck.y + 33
        const topSide = duck.y

        if (
            x < rightSide &&
            x > leftSide &&
            y > topSide &&
            y < bottomSide
        ) {
            ducks.splice(i,1);
            return true;
        } else {
            return false;
        }
    }
}

const hitSound = new Audio('./assets/videoplayback_2.m4a');
hitSound.load();
let cooldown = false;
canvas.addEventListener('click', function(e) {
    if (gameState === "running") {
        if (cooldown) return;
        cooldown = true;
        hitSound.currentTime = 0.25;
        hitSound.play();
        if (checkHit(e.offsetX, e.offsetY)) {
            point += 1;
            pointText.innerHTML = point;
        } else {
            health -= 1;
            healthText.innerHTML = health;
            if (health <= 0) {
                gameOver();
            }
        }

        setTimeout(function() {cooldown = false;}, 1000);
    }
})

let imagesLoaded = 0;
backgroundImg.onload = () => {
    imagesLoaded++;
    if (imagesLoaded === 2) startGame();
};
duckImg.onload = () => {
    imagesLoaded++;
    if (imagesLoaded === 2) startGame();
};

let gameState = "running" // bisa "running" "paused" "ended"
let gameInterval;
let spawnInterval;
function start() {
    gameState = "running";
    spawnDuck();
    gameInterval = setInterval(updateGame, 1000/60);
    spawnInterval = setInterval(spawnDuck, duckSpawnTime);
}

const overlay = document.getElementById('Overlay');
const pauseOrOverText = document.getElementById('pauseOrOver');
const pauseMenu = document.getElementById('pauseMenu');
const gameOverMenu = document.getElementById('gameOverMenu');
function togglePause() {
    if (gameState === "running") {
        gameState = "paused";
        pauseOrOverText.innerHTML = 'Paused';
        clearInterval(gameInterval);
        clearInterval(spawnInterval);
        overlay.style.display = 'flex';
        pauseMenu.style.display = 'flex';
    } else if (gameState === "paused") {
        gameState = "running";
        gameInterval = setInterval(updateGame, 1000/60);
        spawnInterval = setInterval(spawnDuck, duckSpawnTime);
        overlay.style.display = 'none';
        pauseMenu.style.display = 'none';
    }
}
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        togglePause();
    };
});
const restartGameBtn = document.getElementById('restartGameBtn');
const backToMenuBtn = document.getElementById('backToMenuBtn');
const continueGameBtn = document.getElementById('continueGameBtn');
restartGameBtn.addEventListener('click', function () {
    endGame();
    overlay.style.display = 'none';
    start();
});
backToMenuBtn.addEventListener('click', function() {
    endGame();
    overlay.style.display = 'none';
    game.style.display = 'none';
    menu.style.display = 'flex';
});
continueGameBtn.addEventListener('click', togglePause);

function endGame() {
    gameState = "ended"
    clearInterval(gameInterval);
    clearInterval(spawnInterval);

    setScoreboard();

    pointText.innerHTML = 0;
    point = 0;
    healthText.innerHTML = 3;
    health = 3;
    ducks = [];
}

function gameOver() {
    gameState = "ended"
    clearInterval(gameInterval);
    clearInterval(spawnInterval);
    pauseOrOverText.innerHTML = 'Game Over';
    overlay.style.display = 'flex';
    gameOverMenu.style.display = 'flex';
}
const backToMenu2Btn = document.getElementById('backToMenu2Btn');
const scoreboardGameBtn = document.getElementById('scoreboardGameBtn');
const retryGameBtn = document.getElementById('retryGameBtn');
backToMenu2Btn.addEventListener('click', function() {
    endGame();
    overlay.style.display = 'none';
    game.style.display = 'none';
    gameOverMenu.style.display = 'none';
    menu.style.display = 'flex';
});
scoreboardGameBtn.addEventListener('click', function() {
    // change this is just placeholder
    endGame();
    overlay.style.display = 'none';
    game.style.display = 'none';
    gameOverMenu.style.display = 'none';
    leaderboard.style.display = 'flex';
    updateScoreboard();
})
retryGameBtn.addEventListener('click', function() {
    endGame();
    overlay.style.display = 'none';
    gameOverMenu.style.display = 'none';
    start();
})

function updateGame() {
    drawBackground();

    for (let i=0; i < ducks.length; i++) {
        ducks[i].x -= 4;
        drawDucks(ducks[i]);
    }

    drawCursor();

    const isDuckOffScreen = ducks.some(duck => duck.x + duckImg.width <= 0);
    if (isDuckOffScreen) {
        gameOver();
    }
}

function setScoreboard() {
    let scoreboardTemplate = [{
        "name" : username.value,
        "point" : point
    }]

    let scoreboard = JSON.parse(localStorage.getItem("scoreboard"))

    if (scoreboard) {
        let highscore = scoreboard.find(function (val) {
            return val.name == username.value
        })

        if (!highscore) {
            scoreboard.push({name : username.value, point : point})
        } else {
            highscore.point = Math.max(highscore.point, point)
        }

        localStorage.setItem("scoreboard", JSON.stringify(scoreboard));
    } else {
        localStorage.setItem("scoreboard", JSON.stringify(scoreboardTemplate));
    }
    
}

const cursorImg = new Image();
cursorImg.src = './assets/crosshair.png'
const cursor = {
    x:0,
    y:0,
    width:50
}
function drawCursor() {
    c.drawImage(cursorImg, cursor.x, cursor.y, cursor.width, cursor.width);
}
canvas.addEventListener('mousemove', function (e) {
    cursor.x = e.offsetX - cursor.width /2
    cursor.y = e.offsetY - cursor.width /2
})





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
