const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const knightWidth = 50;
const knightHeight = 100;
const lanceLength = 80;
const speed = 2;
let playerY = canvas.height / 2;
let computerY = canvas.height / 2;
let playerLanceY = playerY;
let computerLanceY = computerY;
let playerX = 50;
let computerX = canvas.width - 100;
let playerMoving = false;
let computerMoving = false;

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
    ctx.fillRect(x, y - knightHeight / 2, knightWidth, knightHeight);
    ctx.beginPath();
    ctx.moveTo(x + (isPlayer ? knightWidth : 0), y);
    ctx.lineTo(x + (isPlayer ? knightWidth + lanceLength : -lanceLength), lanceY);
    ctx.stroke();
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
        // Check for collision and determine winner
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawKnight(playerX, playerY, playerLanceY, true);
    drawKnight(computerX, computerY, computerLanceY, false);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
