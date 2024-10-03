// Get the canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Grid settings
let gridSize; // Will be calculated in resizeCanvas()
const gridCount = 5; // Set for a 5x5 grid

// Adjust canvas size for mobile devices
function resizeCanvas() {
    const size = Math.min(window.innerWidth, window.innerHeight, 500);
    canvas.width = size;
    canvas.height = size;
    gridSize = size / gridCount;
    drawGrid();
}
window.addEventListener('resize', resizeCanvas);

// Player, goal, and obstacles
let player = { x: 0, y: 0 };
let goal = { x: gridCount - 1, y: gridCount - 1 };
let obstacles = [];

// Level messages
const levelTexts = [
    "Congratulations! You've unlocked week 1's topic: Data-Centric AI",
    "Great job! Next up, week 2: Generative AI in Business",
    "Well done! Discover on week 3: AI-Driven Customer Experience",
    "Awesome! Here's week 4: Customization of AI Models",
    "You're a star! Final topic on week 5: Human-AI Collaboration"
];

let currentLevel = 0;

// Obstacle movement interval
const obstacleMoveInterval = 1000; // Obstacles move every 1 second
let obstacleInterval; // To store the interval ID

// Update level display
function updateLevelDisplay() {
    const totalLevels = levelTexts.length;
    document.getElementById('level-display').innerText = `Level ${currentLevel + 1}/${totalLevels}`;
}

// Initialize obstacles
function initObstacles(level) {
    obstacles = [];
    let maxObstacles = (gridCount * gridCount) - 2; // Total cells minus player and goal
    let obstacleCount = Math.min(level + 2, maxObstacles); // Adjust obstacle count for 5x5 grid
    while (obstacles.length < obstacleCount) {
        let obstacle = {
            x: Math.floor(Math.random() * gridCount),
            y: Math.floor(Math.random() * gridCount)
        };
        // Avoid placing obstacles on the player, goal, or existing obstacles
        if (
            (obstacle.x !== player.x || obstacle.y !== player.y) &&
            (obstacle.x !== goal.x || obstacle.y !== goal.y) &&
            !obstacles.some(o => o.x === obstacle.x && o.y === obstacle.y)
        ) {
            obstacles.push(obstacle);
        }
    }
}

// Move obstacles randomly
function moveObstacles() {
    obstacles.forEach(obstacle => {
        // Randomly choose a direction: up, down, left, or right
        const directions = ['up', 'down', 'left', 'right'];
        const move = directions[Math.floor(Math.random() * directions.length)];

        let newX = obstacle.x;
        let newY = obstacle.y;

        switch (move) {
            case 'up':
                if (obstacle.y > 0) newY--;
                break;
            case 'down':
                if (obstacle.y < gridCount - 1) newY++;
                break;
            case 'left':
                if (obstacle.x > 0) newX--;
                break;
            case 'right':
                if (obstacle.x < gridCount - 1) newX++;
                break;
        }

        // Check if the new position is not occupied by another obstacle, the player, or the goal
        if (
            !obstacles.some(o => o !== obstacle && o.x === newX && o.y === newY) &&
            !(player.x === newX && player.y === newY) &&
            !(goal.x === newX && goal.y === newY)
        ) {
            obstacle.x = newX;
            obstacle.y = newY;
        }
    });

    drawGrid();
    checkCollision();
}

// Start moving obstacles
function startObstacleMovement() {
    obstacleInterval = setInterval(moveObstacles, obstacleMoveInterval);
}

// Stop moving obstacles
function stopObstacleMovement() {
    clearInterval(obstacleInterval);
}

// Draw the game grid
function drawGrid() {
    // Fill the background with the desired color
    ctx.fillStyle = '#091231'; // Grid background color
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = '#ccc'; // Grid lines color
    ctx.lineWidth = 1;
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
    ctx.fillStyle = '#16FFBB'; // Updated goal color
    ctx.fillRect(goal.x * gridSize, goal.y * gridSize, gridSize, gridSize);

    // Draw player
    ctx.fillStyle = 'white'; // Updated player color
    ctx.fillRect(player.x * gridSize, player.y * gridSize, gridSize, gridSize);
}

// Check for collisions
function checkCollision() {
    // Obstacle collision
    if (obstacles.some(obstacle => obstacle.x === player.x && obstacle.y === player.y)) {
        alert('You hit an obstacle! Game over.');
        stopObstacleMovement();
        resetGame();
        return true;
    }
    // Goal reached
    if (player.x === goal.x && player.y === goal.y) {
        document.getElementById('message').innerText = levelTexts[currentLevel];
        currentLevel++;
        stopObstacleMovement();
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
    stopObstacleMovement();
    drawGrid();
    startObstacleMovement();
    updateLevelDisplay(); // Update the level display
}

// Reset game
function resetGame() {
    currentLevel = 0;
    document.getElementById('message').innerText = '';
    stopObstacleMovement();
    resetLevel();
    updateLevelDisplay(); // Update the level display
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

canvas.addEventListener('touchstart', function (e) {
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
}, false);

canvas.addEventListener('touchmove', function (e) {
    e.preventDefault(); // Prevent scrolling
}, false);

canvas.addEventListener('touchend', function (e) {
    if (touchStartX === null || touchStartY === null) {
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

// Initialize the game when the window loads
window.onload = function () {
    resizeCanvas(); // Adjust canvas size on load
    resetLevel();
    updateLevelDisplay(); // Initialize level display
};
