const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const tileSize = 32;
const worldWidth = Math.floor(window.innerWidth / tileSize); // Number of tiles horizontally based on window width
const worldHeight = Math.floor(window.innerHeight / tileSize); // Number of tiles vertically based on window height
const breakDuration = 500; // Duration for block breaking in milliseconds

// Load sprite images
const sprites = {
    dirt: new Image(),
    grass: new Image(),
    stone: new Image()
};

sprites.dirt.src = 'assets/images/1dirt.png';
sprites.grass.src = 'assets/images/0grass.png';
sprites.stone.src = 'assets/images/2stone.png';

// Expanded world layout to cover entire canvas using only existing blocks
const world = Array(worldHeight).fill().map((_, y) => {
    return Array(worldWidth).fill().map((_, x) => {
        if (y === worldHeight - 1) return 2; // Stone layer at the bottom
        if (y >= worldHeight - 3) return 1; // Dirt layer above stone
        return 0; // Grass layer on top
    });
});

// Track blocks to break and their break time
const breakQueue = new Map(); // Map to store the break time of blocks

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

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
            if (isMouseOverBlock(x, y) && world[y][x] !== null) {
                breakQueue.set(`${x},${y}`, Date.now()); // Set the break time for the block
                drawWorld();
                return;
            }
        }
    }
});

// Track mouse position
let mouseX = 0;
let mouseY = 0;

canvas.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    drawWorld();
});

window.addEventListener('resize', resizeCanvas);

window.onload = () => {
    resizeCanvas(); // Set initial canvas size and draw the world
};
