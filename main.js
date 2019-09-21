// Our bresenham class
let d = new Bresenham();

// Util functions
function pixel(x, y) {
    cx.fillRect(x, y, 2, 2);
}

function setupTiles(points) {
    for (let y = 0; y < tilesY; y++) {
        points[y] = [];
        for (let x = 0; x < tilesX; x++) {
            points[y][x] = {
                x: (((x * tileWidth) / width) * PERSPECTIVE) - (PERSPECTIVE / 2),
                y: Math.round(PROJECTION_CENTER_Y),
                z: PERSPECTIVE - (((y * tileHeight) / height) * PERSPECTIVE),
                elevation: 0,
                xProjected: 0,
                yProjected: 0,
                scaleProjected: 0
            };
        }
    }
}

function connectPoints(points) {
    for (let y = 0; y < tilesY; y++) {
        for (let x = 0; x < tilesX; x++) {
            let point = points[y][x];

            if (points[y - 1]) {
                point.u = points[y - 1][x];
            }
            if (points[y + 1]) {
                point.d = points[y + 1][x];
            }

            if (points[y][x - 1]) {
                point.l = points[y][x - 1];
            }
            if (points[y][x + 1]) {
                point.r = points[y][x + 1];
            }
        }
    }
}

function addBoulder(posx, posy, points, boulder = [
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1]
]) {
    for (let y = 0, {
            length
        } = boulder; y < length; y++) {
        for (let x = 0, length2 = boulder[y].length; x < length2; x++) {
            // 
            points[y + posy][x + posx].elevation = boulder[y][x];
        }
    }
}

function drawPoints(points) {
    cx.clearRect(0, 0, canvas.width, canvas.height);
    cx.lineWidth = 2;
    cx.strokeStyle = 'orange';
    for (let y = 0; y < tilesY; y++) {
        for (let x = 0; x < tilesX; x++) {
            var point = points[y][x];
            cx.fillRect(point.x, point.y, 2, 2);

            if (point.u) {
                d.draw_line(point.x, point.y, point.u.x, point.u.y);
            }
            if (point.d) {
                d.draw_line(point.x, point.y, point.d.x, point.d.y);
            }
            if (point.l) {
                d.draw_line(point.x, point.y, point.l.x, point.l.y);
            }
            if (point.r) {
                d.draw_line(point.x, point.y, point.r.x, point.r.y);
            }
        }
    }
}

function drawFaces(points) {
    cx.clearRect(0, 0, width, height);
    for (let y = 0; y < tilesY; y++) {
        for (let x = 0; x < tilesX; x++) {
            // 
            let point = points[y][x];

            // Fill in the shape
            cx.beginPath();
            // TODO: Add a culling function that takes into account points outside of the screen and draws the face using the edge of the screen
            // if (x2d >= 0 && x2d <= w && y2d >= 0 && y2d <= h) {
            if (point.z >= PERSPECTIVE * .9) {
                cx.strokeStyle = 'purple';
            }

            if (point.r) {
                cx.moveTo(point.xProjected, point.yProjected);
                cx.lineTo(point.r.xProjected, point.r.yProjected);
                point = point.r;

                if (point.d) {
                    cx.lineTo(point.d.xProjected, point.d.yProjected);
                    point = point.d;

                    if (point.l) {
                        cx.lineTo(point.l.xProjected, point.l.yProjected);
                        point = point.l;

                        if (point.u) {
                            cx.lineTo(point.u.xProjected, point.u.yProjected);
                            point = point.u;
                        }
                    }
                }
            }
            cx.fill();
            cx.stroke();
            cx.closePath();
            cx.strokeStyle = 'darkorange';

            //#region Render the lines
            // if (point.r) {
            //     d.draw_line(point.xProjected, point.yProjected, point.r.xProjected, point.r.yProjected);
            //     point = point.r;
            // }
            // if (point.d) {
            //     d.draw_line(point.xProjected, point.yProjected, point.d.xProjected, point.d.yProjected);
            //     point = point.d;
            // }
            // if (point.l) {
            //     d.draw_line(point.xProjected, point.yProjected, point.l.xProjected, point.l.yProjected);
            //     point = point.l;
            // }
            // if (point.u) {
            //     d.draw_line(point.xProjected, point.yProjected, point.u.xProjected, point.u.yProjected);
            // }
            //#endregion
        }
    }
}

function project() {
    for (let y = 0; y < tilesY; y++) {
        for (let x = 0; x < tilesX; x++) {
            let point = points[y][x];
            // The scaleProjected will store the scale of the element based on its distance from the 'camera'
            point.scaleProjected = PERSPECTIVE / (PERSPECTIVE + point.z);
            // The xProjected is the x position on the 2D world
            point.xProjected = (point.x * point.scaleProjected) + PROJECTION_CENTER_X;
            // The yProjected is the y position on the 2D world
            point.yProjected = ((point.y - (point.elevation * ELEVATION)) * point.scaleProjected) + PROJECTION_CENTER_Y;
        }
    }
}

function addSine1(points, timeDiff) {
    for (let y = 0; y < tilesY; y++) {
        for (let x = 0; x < tilesX; x++) {
            let point = points[y][x];

            let input = (point.x + point.z + timeDiff) * (Math.PI * 2 / PERSPECTIVE);
            point.elevation += Math.sin(input / 2);
        }
    }
}

function update(plain) {
    plain.unshift(plain.pop());
}

function rotate(points) {
    for (let y = 0; y < tilesY; y++) {
        for (let x = 0; x < tilesX; x++) {
            let point = points[y][x];
            let posx = point.x * Math.cos(angle) + point.z * Math.sin(angle);
            // let posy = point.x * Math.sin(angle) + point.y * Math.cos(angle);
            let posz = -point.x * Math.sin(angle) + point.z * Math.cos(angle);
            point.x = posx;
            point.z = posz;
        }
    }
}

let count = 0;
let timeDiff = 0;

function loop(time) {
    update(plain);
    addBoulder(0, 0, points, plain);
    addSine1(points, count);
    count += 43;
    // rotate(points);
    project(points);
    drawFaces(points);

    requestAnimationFrame(loop);
}

// Util
function Bresenham() {
    this.draw_line = (x1, y1, x2, y2) => {
        let dx = x2 - x1;
        let dy = y2 - y1;

        let dx1 = Math.abs(dx);
        let dy1 = Math.abs(dy);

        let px = 2 * dy1 - dx1;
        let py = 2 * dx1 - dy1;

        if (dy1 <= dx1) {
            let x = 0,
                y = 0,
                xe = 0;

            if (dx >= 0) {
                x = x1;
                y = y1;
                xe = x2;
            } else {
                x = x2;
                y = y2;
                xe = x1;
            }

            pixel(x, y);

            for (let i = 0; x < xe; i++) {
                x = x + 1;

                if (px < 0) {
                    px = px + 2 * dy1;
                } else {
                    if ((dx < 0 && dy < 0) || (dx > 0 && dy > 0)) {
                        y = y + 1;
                    } else {
                        y = y - 1;
                    }
                    px = px + 2 * (dy1 - dx1);
                }

                pixel(x, y);
            }
        } else {
            let x = 0,
                y = 0,
                ye = 0;
            if (dy >= 0) {
                x = x1;
                y = y1;
                ye = y2;
            } else {
                x = x2;
                y = y2;
                ye = y1;
            }

            pixel(x, y);

            for (let i = 0; y < ye; i++) {
                y = y + 1;

                if (py <= 0) {
                    py = py + 2 * dx1;
                } else {
                    if ((dx < 0 && dy < 0) || (dx > 0 && dy > 0)) {
                        x = x + 1;
                    } else {
                        x = x - 1;
                    }
                    py = py + 2 * (dx1 - dy1);
                }

                pixel(x, y);
            }
        }
    };
}

function tween(duration, from, to, callback, yoyo, ease) {
    ease = ease || function (t) {
        return t;
    }
    var self = this,
        time = duration || 1000,
        animDiff = to - from,
        startTime = new Date(),
        timer = setInterval(animate, 5);

    function animate() {
        var diff = new Date() - startTime;
        if (diff > time) {
            clearInterval(timer);
            timer = null;
            if (yoyo) {
                tween(duration, to, from, yoyo, ease);
            } else {
                callback(to);
                return;
            }
        }
        tween((animDiff * ease(diff / time)) + from);
    }
}