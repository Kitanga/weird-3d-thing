var canvas = document.createElement('canvas'),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight,
    halfWidth = width / 2,
    halfHeight = height / 2,
    fov = 250,
    offsetX = 0,
    offsetY = 0,
    mouseX = 0,
    mouseY = 0;

var context = canvas.getContext('2d');
document.body.appendChild(canvas);
document.body.addEventListener("mousemove", onMouseMove);


// set up an grid of 3D Pixels in undulating waves
var pixels = [];

for (var x = -250; x < 250; x += 6) {
    for (var z = -250; z < 250; z += 6) {
        var zOscillation = Math.sin(z * (Math.PI * 4 / 250));
        var xOscillation = Math.sin((x + z) * (Math.PI * 2 / 250));
        var pixel = new Pixel3D(x, (zOscillation + xOscillation) * 14 + 30, z);
        pixels.push(pixel);
    }
}

// call the render function 30 times a second
setInterval(render, 1000 / 30);


function render() {

    // ease offsetX and offsetY towards the 
    // mouse position (to smooth the "camera" 
    // motion). 
    offsetX += (mouseX - offsetX) * 0.1;
    offsetY += (mouseY - offsetY) * 0.1;


    // clear the canvas
    context.clearRect(0, 0, width, height);
    // and get the imagedata out of it
    var imagedata = context.getImageData(0, 0, canvas.width, canvas.height);

    // iterate through every point in the array
    var i = pixels.length;
    while (i--) {
        var pixel = pixels[i];

        // here's the 3D to 2D formula, first work out 
        // scale for that pixel's z position (distance from 
        // camera)
        var scale = fov / (fov + pixel.z);
        // and multiply our 3D x and y to get our
        // 2D x and y. Add halfWidth and halfHeight
        // so that our 2D origin is in the middle of 
        // the screen.
        var x2d = ((pixel.x + offsetX) * scale) + halfWidth;
        var y2d = ((pixel.y + offsetY) * scale) + halfHeight;

        // and set that 2D pixel to be green
        setPixel(imagedata, x2d, y2d, 10, 255, 255);

        // add 1 to the z position to bring it a little 
        // closer to the camera each frame
        pixel.z -= 1;
        // if it's now too close to the camera, 
        // move it to the back
        if (pixel.z < -fov) pixel.z += (fov * 2);

    }

    // and write all those pixel values into the canvas
    context.putImageData(imagedata, 0, 0);

}

function setPixel(imagedata, x, y, r, g, b) {

    if ((x < 0) || (x > width) || (y < 0) || (y > width)) return;

    var i = ((y >> 0) * imagedata.width + (x >> 0)) * 4;

    imagedata.data[i] = r;
    imagedata.data[i + 1] = g;
    imagedata.data[i + 2] = b;
    imagedata.data[i + 3] = 255;
}

function Pixel3D(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
}

function onMouseMove(e) {
    mouseX = (halfWidth - e.clientX) * 0.1;
    mouseY = (halfHeight - e.clientY) * 0.1;

}