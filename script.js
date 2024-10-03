// Get the canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Adjust canvas size for mobile devices
function resizeCanvas() {
    const size = Math.min(window.innerWidth, window.innerHeight, 500);
    canvas.width = size;
    canvas.height = size;
    gridSize = size / gridCount;
    drawGrid();
}
window.addEventListener('resize', resizeCanvas);

// Grid settings
let gridSize = 25;
const gridCount = 5; // Adjusted for better mobile view (10x10 grid)

// Player, goal, and obstacles
let player = { x: 0, y: 0 };
let goal = { x: gridCount - 1, y: gridCount - 1 };
let obstacles = [];

// Level messages
const levelTexts = [
    "Congratulations! You've unlocked week 1's topic: Data-Centric AI",
    "Great job! Next up, week 2: Generative AI in Business",
    "Well done! Discover on week 3: AI-Gedreven Customer Experience",
    "Awesome! Here's week 4: Customization of AI Models",
    "You're a star! Final topic on week 5: Human-AI Collaboration"
];

let currentLevel = 0;

// Initialize obstacles
function initObstacles(level) {
    obstacles = [];
    let obstacleCount = level + 3; // Increase obstacles with each level
    while (obstacles.length < obstacleCount) {
        let obstacle = {
            x: Math.floor(Math.random() * gridCount),
            y: Math.floor(Math.random() * gridCount)
        };
        // Avoid placing obstacles on the player, goal, or existing obstacles
        if ((obstacle.x !== player.x || obstacle.y !== player.y) &&
            (obstacle.x !== goal.x || obstacle.y !== goal.y) &&
            !obstacles.some(o => o.x === obstacle.x && o.y === obstacle.y)) {
            obstacles.push(obstacle);
        }
    }
}

// Draw the game grid
function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = '#ccc';
    for (let i = 0; i <= gridCount; i++) {
        // Vertical lines
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();

        // Horizontal lines
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
    }

    // Draw obstacles
    ctx.fillStyle = 'red';
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x * gridSize, obstacle.y * gridSize, gridSize, gridSize);
    });

    // Draw goal
    ctx.fillStyle = 'gold';
    ctx.fillRect(goal.x * gridSize, goal.y * gridSize, gridSize, gridSize);

    // Draw player
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x * gridSize, player.y * gridSize, gridSize, gridSize);
}

// Check for collisions
function checkCollision() {
    // Obstacle collision
    if (obstacles.some(obstacle => obstacle.x === player.x && obstacle.y === player.y)) {
        alert('You hit an obstacle! Game over.');
        resetGame();
        return true;
    }
    // Goal reached
    if (player.x === goal.x && player.y === goal.y) {
        document.getElementById('message').innerText = levelTexts[currentLevel];
        currentLevel++;
        if (currentLevel < levelTexts.length) {
            alert('Level Complete! Weekly AI Update topic revealed.');
            resetLevel();
        } else {
            alert('You have completed all levels! Well done.');
            resetGame();
        }
        return true;
    }
    return false;
}

// Reset level
function resetLevel() {
    player = { x: 0, y: 0 };
    goal = { x: gridCount - 1, y: gridCount - 1 };
    initObstacles(currentLevel);
    drawGrid();
}

// Reset game
function resetGame() {
    currentLevel = 0;
    document.getElementById('message').innerText = '';
    resetLevel();
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    e.preventDefault(); // Prevent default scrolling behavior
    switch (e.key) {
        case 'ArrowUp':
        case 'w':
            if (player.y > 0) player.y--;
            break;
        case 'ArrowDown':
        case 's':
            if (player.y < gridCount - 1) player.y++;
            break;
        case 'ArrowLeft':
        case 'a':
            if (player.x > 0) player.x--;
            break;
        case 'ArrowRight':
        case 'd':
            if (player.x < gridCount - 1) player.x++;
            break;
    }
    drawGrid();
    checkCollision();
});

// Touch controls for mobile devices
let touchStartX = null;
let touchStartY = null;

canvas.addEventListener('touchstart', function(e) {
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
}, false);

canvas.addEventListener('touchmove', function(e) {
    e.preventDefault(); // Prevent scrolling
}, false);

canvas.addEventListener('touchend', function(e) {
    if (!touchStartX || !touchStartY) {
        return;
    }

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;

    // Determine swipe direction
    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (diffX > 0 && player.x > 0) {
            // Swipe left
            player.x--;
        } else if (diffX < 0 && player.x < gridCount - 1) {
            // Swipe right
            player.x++;
        }
    } else {
        // Vertical swipe
        if (diffY > 0 && player.y > 0) {
            // Swipe up
            player.y--;
        } else if (diffY < 0 && player.y < gridCount - 1) {
            // Swipe down
            player.y++;
        }
    }

    // Reset touch positions
    touchStartX = null;
    touchStartY = null;

    drawGrid();
    checkCollision();
}, false);

// Initialize the game
resetLevel();
resizeCanvas(); // Adjust canvas size on load
