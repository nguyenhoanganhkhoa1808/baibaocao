const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScore = document.getElementById('final-score');
const highScoreDisplay = document.getElementById('high-score');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const congratsSound = document.getElementById('congrats-sound'); 
const speedSlider = document.getElementById('speed-slider');
const speedDisplay = document.getElementById('speed-display');

// Kích thước ô vuông
const tileSize = 20;
canvas.width = 400;
canvas.height = 400;

let snake = [{ x: 160, y: 160 }];
let snakeLength = 1;
let direction = { x: tileSize, y: 0 };
let apple = { x: Math.floor(Math.random() * canvas.width / tileSize) * tileSize, 
              y: Math.floor(Math.random() * canvas.height / tileSize) * tileSize };
let gameInterval = null;
let gameSpeed = 100; // Tốc độ mặc định
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;

document.addEventListener('keydown', changeDirection);
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);

// Cập nhật tốc độ khi thay đổi thanh trượt
speedSlider.addEventListener('input', function() {
    gameSpeed = parseInt(speedSlider.value);
    speedDisplay.textContent = `${gameSpeed} ms`;
});

// Bắt đầu trò chơi
function startGame() {
    startScreen.style.display = 'none';
    canvas.style.display = 'block';
    gameInterval = setInterval(updateGame, gameSpeed);
}

// Chơi lại
function restartGame() {
    gameOverScreen.style.display = 'none';
    canvas.style.display = 'block';
    snake = [{ x: 160, y: 160 }];
    snakeLength = 1;
    direction = { x: tileSize, y: 0 };
    apple = { x: Math.floor(Math.random() * canvas.width / tileSize) * tileSize, 
              y: Math.floor(Math.random() * canvas.height / tileSize) * tileSize };
    score = 0;
    clearInterval(gameInterval); // Clear interval cũ trước khi tạo interval mới
    gameInterval = setInterval(updateGame, gameSpeed); // Sử dụng gameSpeed mới
}

// Thay đổi hướng di chuyển của rắn
function changeDirection(event) {
    switch (event.key) {
        case 'ArrowUp':
            if (direction.y === 0) direction = { x: 0, y: -tileSize };
            break;
        case 'ArrowDown':
            if (direction.y === 0) direction = { x: 0, y: tileSize };
            break;
        case 'ArrowLeft':
            if (direction.x === 0) direction = { x: -tileSize, y: 0 };
            break;
        case 'ArrowRight':
            if (direction.x === 0) direction = { x: tileSize, y: 0 };
            break;
    }
}

// Cập nhật trò chơi
function updateGame() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Kiểm tra va chạm với tường hoặc chính mình
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height || checkCollision(head)) {
        clearInterval(gameInterval);
        canvas.style.display = 'none';
        gameOverScreen.style.display = 'block';
        finalScore.textContent = `Điểm số: ${score}`;
        
        // Lưu điểm cao nhất
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
            congratsSound.play(); // Phát âm thanh chúc mừng khi vượt qua điểm cao
        }
        highScoreDisplay.textContent = `Điểm cao nhất: ${highScore}`;
        return;
    }

    // Di chuyển rắn
    snake.unshift(head);
    
    // Kiểm tra nếu rắn ăn táo
    if (head.x === apple.x && head.y === apple.y) {
        snakeLength++;
        score++;
        apple = { x: Math.floor(Math.random() * canvas.width / tileSize) * tileSize, 
                  y: Math.floor(Math.random() * canvas.height / tileSize) * tileSize };
    }

    if (snake.length > snakeLength) {
        snake.pop();
    }

    drawGame();
}

// Kiểm tra va chạm với chính mình
function checkCollision(head) {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            return true;
        }
    }
    return false;
}

// Vẽ trò chơi
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Vẽ rắn
    snake.forEach(segment => {
        ctx.fillStyle = '#0f0';
        ctx.fillRect(segment.x, segment.y, tileSize, tileSize);
    });

    // Vẽ táo
    ctx.fillStyle = '#f00';
    ctx.fillRect(apple.x, apple.y, tileSize, tileSize);

    // Hiển thị điểm số
    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.fillText(`Điểm: ${score}`, 10, 20);
}
