const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const tileSize = 32;
const worldWidth = 1000; // Number of tiles horizontally
const worldHeight = 50;  // Number of tiles vertically
const breakDuration = 500; // Duration for block breaking in milliseconds

// Load sprite image
const sprites = {
    dirt: new Image(),
    grass: new Image(),
    stone: new Image(),
    bedrock: new Image(), // New image for bedrock
    player: new Image()  // New image for the player
};

sprites.dirt.src = 'assets/image/1dirt.png';
sprites.grass.src = 'assets/image/0grass.png';
sprites.stone.src = 'assets/image/2stone.png';
sprites.bedrock.src = 'assets/image/bedrock.png'; // Path to bedrock sprite
sprites.player.src = 'assets/image/player.png'; // Path to player sprite

// Initialize world layout
const world = Array(worldHeight).fill().map((_, y) => {
    return Array(worldWidth).fill().map((_, x) => {
        if (y === worldHeight - 1) return 3; // Bedrock layer at the bottom
        if (y >= worldHeight - 3) return 1; // Dirt layer above bedrock
        return 0; // Grass layer on top
    });
});

// Track blocks to break and their break time
const breakQueue = new Map(); // Map to store the break time of blocks

// Player properties
const player = {
    x: Math.floor(worldWidth / 2), // Start in the middle
    y: Math.floor(worldHeight / 2),
    width: tileSize,
    height: tileSize,
    velocityX: 0,
    velocityY: 0,
    isJumping: false
};

function resizeCanvas() {
    canvas.width = worldWidth * tileSize;
    canvas.height = worldHeight * tileSize;

    drawWorld();
}

function calculateOffsets() {
    const horizontalOffset = (canvas.width - (worldWidth * tileSize)) / 2;
    const verticalOffset = (canvas.height - (worldHeight * tileSize)) / 2;
    return { horizontalOffset, verticalOffset };
}

function drawWorld() {
    const { horizontalOffset, verticalOffset } = calculateOffsets();

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before redrawing

    for (let y = 0; y < worldHeight; y++) {
        for (let x = 0; x < worldWidth; x++) {
            let tile = world[y][x];
            let sprite;

            switch (tile) {
                case 1: sprite = sprites.dirt; break;
                case 0: sprite = sprites.grass; break;
                case 2: sprite = sprites.stone; break;
                case 3: sprite = sprites.bedrock; break; // Bedrock layer
                default: continue;
            }

            if (breakQueue.has(`${x},${y}`)) {
                const breakTime = breakQueue.get(`${x},${y}`);
                if (Date.now() - breakTime >= breakDuration) {
                    world[y][x] = null; // Set the block to null to remove it
                    breakQueue.delete(`${x},${y}`);
                } else {
                    // Draw a semi-transparent block to indicate it's being broken
                    ctx.globalAlpha = 0.5;
                    ctx.drawImage(sprite, x * tileSize + horizontalOffset, y * tileSize + verticalOffset, tileSize, tileSize);
                    ctx.globalAlpha = 1.0;
                    continue;
                }
            } else {
                ctx.drawImage(sprite, x * tileSize + horizontalOffset, y * tileSize + verticalOffset, tileSize, tileSize);
            }

            // Draw a black outline only on the block the mouse is over
            if (isMouseOverBlock(x, y)) {
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 2;
                ctx.strokeRect(x * tileSize + horizontalOffset, y * tileSize + verticalOffset, tileSize, tileSize);
            }
        }
    }

    // Draw the player
    ctx.drawImage(sprites.player, player.x * tileSize + horizontalOffset, player.y * tileSize + verticalOffset, tileSize, tileSize);
}

// Check if the mouse is over a specific block
function isMouseOverBlock(x, y) {
    const { horizontalOffset, verticalOffset } = calculateOffsets();
    const blockX = x * tileSize + horizontalOffset;
    const blockY = y * tileSize + verticalOffset;

    return mouseX >= blockX && mouseX < blockX + tileSize &&
           mouseY >= blockY && mouseY < blockY + tileSize;
}

// Handle block breaking
canvas.addEventListener('click', () => {
    for (let x = 0; x < worldWidth; x++) {
        for (let y = 0; y < worldHeight; y++) {
            if (isMouseOverBlock(x, y) && world[y][x] !== null && world[y][x] !== 3) { // Can't break bedrock
                breakQueue.set(`${x},${y}`, Date.now()); // Set the break time for the block
                drawWorld();
                return;
            }
        }
    }
});

// Handle player movement
function updatePlayer() {
    const { horizontalOffset, verticalOffset } = calculateOffsets();
    
    // Apply gravity
    if (!player.isJumping && !isSolidBlock(player.x, player.y + 1)) {
        player.velocityY += 0.5; // Gravity strength
    } else {
        player.velocityY = 0;
    }
    
    // Update player position
    player.x += player.velocityX;
    player.y += player.velocityY;

    // Ensure player doesn't move out of bounds
    player.x = Math.max(0, Math.min(worldWidth - 1, player.x));
    player.y = Math.max(0, Math.min(worldHeight - 1, player.y));

    // Ensure player lands on solid blocks
    if (player.velocityY > 0) {
        const tileX = Math.floor(player.x);
        const tileY = Math.floor(player.y + 1);
        if (isSolidBlock(tileX, tileY)) {
            player.y = tileY - 1; // Land on top of the block
            player.velocityY = 0;
            player.isJumping = false;
        }
    }

    drawWorld();
}

function isSolidBlock(x, y) {
    return world[y] && (world[y][x] === 0 || world[y][x] === 1 || world[y][x] === 2 || world[y][x] === 3); // 3 for bedrock
}

// Handle keyboard input
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'a':
            player.velocityX = -2; // Move left
            break;
        case 'd':
            player.velocityX = 2; // Move right
            break;
        case 'w':
        case ' ':
            if (!player.isJumping && isSolidBlock(player.x, player.y + 1)) {
                player.velocityY = -10; // Jump
                player.isJumping = true;
            }
            break;
        case 's':
            player.velocityY = 2; // Move down
            break;
    }
    updatePlayer();
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'a' || e.key === 'd') {
        player.velocityX = 0; // Stop horizontal movement
    }
    if (e.key === 's') {
        player.velocityY = 0; // Stop vertical movement
    }
});

function trackMousePosition(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    drawWorld();
}

canvas.addEventListener('mousemove', trackMousePosition);

window.addEventListener('resize', resizeCanvas);

window.onload = () => {
    resizeCanvas(); // Set initial canvas size and draw the world
};
