const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const tileSize = 32;
const worldWidth = 25; // Number of tiles horizontally
const worldHeight = 4;  // Number of tiles vertically (example)

// Load sprite images
const sprites = {
    dirt: new Image(),
    grass: new Image(),
    stone: new Image()
};

sprites.dirt.src = 'assets/image/1dirt.png';
sprites.grass.src = 'assets/image/0grass.png';
sprites.stone.src = 'assets/image/2stone.png';

// Simple world layout (0 = grass, 1 = dirt, 2 = stone)
const world = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
];

// Adjust canvas size to fullscreen and redraw the world
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    drawWorld();
}

// Calculate offsets to center the world
function calculateOffsets() {
    const horizontalOffset = (canvas.width - (worldWidth * tileSize)) / 2;
    const verticalOffset = (canvas.height - (worldHeight * tileSize)) / 2;
    return { horizontalOffset, verticalOffset };
}

// Render the world
function drawWorld() {
    const { horizontalOffset, verticalOffset } = calculateOffsets();

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before redrawing

    for (let y = 0; y < worldHeight; y++) {
        for (let x = 0; x < worldWidth; x++) {
            let tile = world[y][x];
            let sprite;

            switch (tile) {
                case 0: sprite = sprites.dirt; break;
                case 1: sprite = sprites.grass; break;
                case 2: sprite = sprites.stone; break;
                default: continue;
            }

            ctx.drawImage(sprite, x * tileSize + horizontalOffset, y * tileSize + verticalOffset, tileSize, tileSize);
        }
    }
}

// Adjust canvas size when the window is resized
window.addEventListener('resize', resizeCanvas);

// Draw the game world once the images are loaded
window.onload = () => {
    resizeCanvas(); // Set initial canvas size and draw the world
};
