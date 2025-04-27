const canvas = document.getElementById('tetris-canvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('start-btn');
const difficultySelect = document.getElementById('difficulty');
const livesCounter = document.getElementById('lives-counter');

let lives = 3;
let gameInterval;
let gameSpeed = 1000; // Default speed (ms)

// Tetris board and piece logic
const board = Array(20).fill().map(() => Array(10).fill(0));
const piece = {
    shape: [[1, 1, 1, 1]], // I-piece
    pos: { x: 5, y: 0 }
};

// Difficulty settings
const difficultySettings = {
    easy: { speed: 1000, penalty: 1 },
    difficult: { speed: 500, penalty: 2 },
    extreme: { speed: 250, penalty: 3 }
};

// Initialize game
function initGame() {
    const difficulty = difficultySelect.value;
    gameSpeed = difficultySettings[difficulty].speed;
    lives = 3;
    livesCounter.textContent = lives;
    clearInterval(gameInterval);
    gameInterval = setInterval(updateGame, gameSpeed);
}

// Update game state
function updateGame() {
    piece.pos.y++;
    if (checkCollision()) {
        piece.pos.y--;
        mergePiece();
        if (piece.pos.y <= 0) {
            lives--;
            livesCounter.textContent = lives;
            if (lives <= 0) {
                clearInterval(gameInterval);
                alert('Game Over!');
                return;
            }
        }
        resetPiece();
    }
    draw();
}

// Check for collisions
function checkCollision() {
    for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
            if (piece.shape[y][x] &&
                (board[y + piece.pos.y] === undefined ||
                 board[y + piece.pos.y][x + piece.pos.x] === undefined ||
                 board[y + piece.pos.y][x + piece.pos.x])) {
                return true;
            }
        }
    }
    return false;
}

// Merge piece into board
function mergePiece() {
    for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
            if (piece.shape[y][x]) {
                board[y + piece.pos.y][x + piece.pos.x] = 1;
            }
        }
    }
}

// Reset piece
function resetPiece() {
    piece.pos = { x: 5, y: 0 };
}

// Draw game
function draw() {
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw board
    for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board[y].length; x++) {
            if (board[y][x]) {
                ctx.fillStyle = '#0f0';
                ctx.fillRect(x * 30, y * 30, 30, 30);
            }
        }
    }

    // Draw piece
    ctx.fillStyle = '#f00';
    for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
            if (piece.shape[y][x]) {
                ctx.fillRect((piece.pos.x + x) * 30, (piece.pos.y + y) * 30, 30, 30);
            }
        }
    }
}

// Event listeners
startBtn.addEventListener('click', initGame);