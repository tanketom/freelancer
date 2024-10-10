// Customizable Variables
const canvasWidth = 800;
const canvasHeight = 400;
const knightWidth = 50;
const knightHeight = 100;
const lanceLength = 80;
const speed = 2;
const maxHP = 3;

// Game State Variables
let playerY = canvasHeight / 2;
let computerY = canvasHeight / 2;
let playerLanceY = playerY;
let computerLanceY = computerY;
let playerX = 50;
let computerX = canvasWidth - 100;
let playerMoving = false;
let computerMoving = false;
let playerHP = maxHP;
let computerHP = maxHP;
let playerName = getRandomKnightName();
let computerName = getRandomKnightName();
let highScores = [];

// DOM Elements
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const titleScreen = document.getElementById('titleScreen');
const startButton = document.getElementById('startButton');
const knightNameDisplay = document.getElementById('knightName');

canvas.width = canvasWidth;
canvas.height = canvasHeight;

const knightNames = [
    "Alaric", "Cedric", "Eamon", "Gareth", "Percival", "Roland", "Tristan", "Godfrey",
    "Leopold", "Lionel", "Reginald", "Thaddeus", "Victor", "Alistair", "Benedict", "Conrad",
    "Dominic", "Edmund", "Frederick", "Quentin"
];

const knightEpitaphs = [
    "the Brave", "the Valiant", "the Just", "the Bold", "the Wise", "the Fearless", "the Noble",
    "the Stalwart", "the Gallant", "the Steadfast", "the Honorable", "the Resolute", "the Guardian",
    "the Vigilant", "the Pure", "the Defender", "the Loyal", "the Courageous", "the Mighty", "the Justiciar"
];

function getRandomKnightName() {
    const name = knightNames[Math.floor(Math.random() * knightNames.length)];
    const epitaph = knightEpitaphs[Math.floor(Math.random() * knightEpitaphs.length)];
    return `Sir ${name} ${epitaph}`;
}

knightNameDisplay.textContent = playerName;

startButton.addEventListener('click', () => {
    titleScreen.style.display = 'none';
    canvas.style.display = 'block';
    gameLoop();
});

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        playerMoving = true;
        computerMoving = true;
    }
});

document.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    playerLanceY = e.clientY - rect.top;
});

function drawKnight(x, y, lanceY, isPlayer) {
    ctx.fillStyle = isPlayer ? 'blue' : 'red';
    ctx.fillRect(x, y - knightHeight / 2, knightWidth, knightHeight); // Horse
    ctx.beginPath();
    ctx.moveTo(x + (isPlayer ? knightWidth : 0), y - knightHeight / 2); // Torso
    ctx.lineTo(x + (isPlayer ? knightWidth : 0), y - knightHeight); // Head
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + (isPlayer ? knightWidth : 0), y - knightHeight); // Lance
    ctx.lineTo(x + (isPlayer ? knightWidth + lanceLength : -lanceLength), lanceY);
    ctx.stroke();
}

function drawHPBar(x, y, hp, isPlayer) {
    ctx.fillStyle = isPlayer ? 'blue' : 'red';
    ctx.fillRect(x, y, knightWidth, 10);
    ctx.fillStyle = 'green';
    ctx.fillRect(x, y, knightWidth * (hp / maxHP), 10);
}

function update() {
    if (playerMoving) {
        playerX += speed;
    }
    if (computerMoving) {
        computerX -= speed;
        computerLanceY += (Math.random() - 0.5) * 2; // Random movement for computer lance
    }

    if (playerX + knightWidth + lanceLength >= computerX) {
        playerMoving = false;
        computerMoving = false;
        determineWinner();
    }
}

function determineWinner() {
    let playerHit = Math.abs(playerLanceY - computerY);
    let computerHit = Math.abs(computerLanceY - playerY);
    if (playerHit < computerHit) {
        computerHP--;
    } else {
        playerHP--;
    }

    if (playerHP <= 0) {
        alert(`${playerName} fucking dies!`);
        resetGame();
    } else if (computerHP <= 0) {
        alert(`${playerName} wins!`);
        resetGame();
    } else {
        resetRound();
    }
}

function resetRound() {
    playerX = 50;
    computerX = canvasWidth - 100;
    playerMoving = false;
    computerMoving = false;
}

function resetGame() {
    playerX = 50;
    computerX = canvasWidth - 100;
    playerMoving = false;
    computerMoving = false;
    playerHP = maxHP;
    computerHP = maxHP;
    playerName = getRandomKnightName();
    computerName = getRandomKnightName();
    knightNameDisplay.textContent = playerName;
    titleScreen.style.display = 'flex';
    canvas.style.display = 'none';
    saveHighScore();
}

function saveHighScore() {
    const score = { name: playerName, hp: playerHP };
    highScores.push(score);
    highScores.sort((a, b) => b.hp - a.hp);
    localStorage.setItem('highScores', JSON.stringify(highScores));
    displayHighScores();
}

function displayHighScores() {
    const highScoresList = document.getElementById('highScoresList');
    highScoresList.innerHTML = highScores.map(score => `<li>${score.name}: ${score.hp} HP</li>`).join('');
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawKnight(playerX, playerY, playerLanceY, true);
    drawKnight(computerX, computerY, computerLanceY, false);
    drawHPBar(10, 10, playerHP, true);
    drawHPBar(canvasWidth - knightWidth - 10, 10, computerHP, false);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Load high scores from local storage
highScores = JSON.parse(localStorage.getItem('highScores')) || [];
displayHighScores();
