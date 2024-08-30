const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const tileSize = 32;
const worldWidth = 25; // Number of tiles horizontally
const worldHeight = 18; // Number of tiles vertically

// Load sprite images
const sprites = {
    dirt: new Image(),
    grass: new Image(),
    stone: new Image()
};

sprites.dirt.src = 'assets/image/1dirt.png';
sprites.grass.src = 'assets/image/0grass.png';
sprites.stone.src = 'assets/image/2stone.png';

// Predefined fixed terrain layout (1 = dirt, 0 = grass, 2 = stone)
const world = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
];

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

            ctx.drawImage(sprite, x * tileSize + horizontalOffset, y * tileSize + verticalOffset, tileSize, tileSize);

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

// Remove a block (set it to null) when clicked
canvas.addEventListener('click', () => {
    for (let x = 0; x < worldWidth; x++) {
        for (let y = 0; y < worldHeight; y++) {
            if (isMouseOverBlock(x, y)) {
                world[y][x] = null; // Set the block to null to remove it
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
