// Dimensions
let width = innerWidth;
let height = innerHeight;

// Create the canvas and it's context
let canvas = document.createElement('canvas');
let cx = canvas.getContext('2d');

// Set dimensions
canvas.width = width;
canvas.height = height;

// Add the canvas to the DOM
document.body.appendChild(canvas);

// Set the default fill style
cx.fillStyle = 'black';
cx.strokeStyle = '#e89f56';

// Set the tile counts both horizontally and vertically
let tilesX = 25;
let tilesY = 25;

// Set a tile's width and height
let tileWidth = Math.round(width / tilesX);
let tileHeight = Math.round(height * 1.7 / tilesY);

// Translate the canvas's origin
// cx.translate(tileWidth / 3, 0);

// Our array of points
let points = [];

// Our plain
let plain = [
    [3, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 3],
    [3, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 3],
    [3, 2, 2, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 3],
    [3, 2, 2, 1, 1, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 3],
    [3, 2, 2, 1, 1, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 3],
    [3, 2, 2, 1, 1, 0, 0, 1, 3, 3, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 2, 2, 3],
    [3, 2, 2, 1, 1, 0, 0, 1, 3, 3, 1, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 1, 2, 2, 3],
    [3, 2, 2, 1, 1, 0, 0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 1, 2, 2, 3],
    [3, 2, 2, 1, 1, 0, 0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 1, 2, 2, 3],
    [3, 2, 2, 1, 1, 0, 0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 2, 2, 3],
    [3, 2, 2, 1, 1, 0, 0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 2, 2, 3],
    [3, 2, 2, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 2, 2, 3],
    [3, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 3],
    [3, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 3],
    [3, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 3],
    [3, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 3],
    [3, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 3],
    [3, 2, 2, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 2, 2, 3],
    [3, 2, 2, 1, 0, 0, 0, 0, 1, 1, 1, 3, 3, 1, 1, 0, 0, 0, 0, 0, 0, 0, 2, 2, 3],
    [3, 2, 2, 1, 0, 0, 0, 0, 1, 1, 2, 3, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 2, 2, 3],
    [3, 2, 2, 1, 0, 0, 0, 0, 1, 1, 2, 3, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 2, 2, 3],
    [3, 2, 2, 1, 0, 0, 0, 0, 1, 1, 2, 3, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 2, 2, 3],
    [3, 2, 2, 1, 1, 0, 0, 0, 1, 1, 1, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 2, 2, 3],
    [3, 2, 2, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 2, 2, 3],
    [3, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 3]
];

// The field of view of our 3D scene
let PERSPECTIVE = width * .7;
// x center of the canvas
let PROJECTION_CENTER_X = width / 2;
// y center of the canvas
let PROJECTION_CENTER_Y = height / 4;
// Base elevation value
let ELEVATION = 25;
// PI / 180 constant
const PI180 = Math.PI / 180;
// Angle to rotate player screen by
let angle = 43 * PI180;

setupTiles(points);
connectPoints(points);
addBoulder(0, 0, points, plain);

timeDiff = performance.now();
requestAnimationFrame(loop);