"use-strict";

/*  Love Saroha
    lovesaroha1994@gmail.com (email address)
    https://www.lovesaroha.com (website)
    https://github.com/lovesaroha  (github)
*/

// Choose theme at random.
const colors = ["#D64163", "#fa625f", "#4874E2"];
const colorsDark = ["#c13b59", "#e15856", "#4168cb"];
const selColor = Math.floor(Math.random() * colors.length);
document.documentElement.style.setProperty('--primary', colors[selColor]);
document.documentElement.style.setProperty('--primary-dark', colorsDark[selColor]);

// Get canvas info from DOM.
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
let obstacleGap = 400;
let gameStarted = false;
let speed = 6;
let lift = -75;
let gravity = 0.5;
let up = false;
let clouds = [];
let groundIcons = [];
let maxScore = 0;
let roadBlocks = [];
let score = 0;
let icons = ["\uf0c2", "\uf744", "\uf1bb", "\uf1ad"];

let dinoImg = new Image();
dinoImg.src = "assets/images/dino.png";

// Windows key event.
window.addEventListener("keydown", function (e) {
    e.preventDefault();
    if (e.keyCode == 32) {
        gameStarted = true;
        // Space key pressed.
        dino.moveUp();
    }
});

// Create clouds.
function createClouds() {
    for (let i = 0; i < 2; i++) {
        clouds.push({ x: Math.random() * canvas.width, y: Math.random() * (canvas.height / 2) + 10, i: Math.floor(Math.random() * 2) });
    }
}

// Create ground details.
function createGround() {
    for (let i = 0; i < 2; i++) {
        groundIcons.push({ x: Math.random() * canvas.width + 400});
    }
}

// This function create road block.
function createRoadBlocks() {
    for (let i = 20; i < canvas.width + 40; i += 20) {
        roadBlocks.push(i);
    }
}

// This function show and update road blocks.
function showRoadBlocks() {
    let length = roadBlocks.length;
    if (roadBlocks[0] < 0) {
        roadBlocks.shift();
        roadBlocks.push(roadBlocks[length - 2] + 20);
    }
    for (let i = 0; i < length; i++) {
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.moveTo(roadBlocks[i], 280);
        ctx.lineTo(roadBlocks[i] - 20, 300);
        ctx.strokeStyle = "#949494";
        ctx.stroke();
        if (gameStarted) {
            roadBlocks[i] -= speed;
        }
    }
}

createRoadBlocks();
createClouds();
createGround();

// Reset game function.
function resetGame() {
    score = 0;
    obstacleOne = new Obstacle();
    obstacleTwo = new Obstacle(obstacleOne.xPosition);
    dino = new Dino();
    groundIcons = [];
    createGround();
    gameStarted = false;
    document.getElementById("score_ID").innerText = score;
}

// Show ground function.
function showGround() {
    if (groundIcons[0].x < 0) {
        groundIcons.shift();
        groundIcons.push({ x: canvas.width + (Math.random() * canvas.width) });
    }
    for (let i = 0; i < groundIcons.length; i++) {
        if (gameStarted) {
            groundIcons[i].x -= 1.5;
        }
        ctx.font = `300 100px "Font Awesome 5 Pro"`;
        ctx.fillStyle = "#d1d1d1";
        ctx.textAlign = 'center';
        ctx.fillText("\uf1bb", groundIcons[i].x, 265);
    }
}

// Show clouds.
function showClouds() {
    if (clouds[0].x < 0) {
        clouds.shift();
        clouds.push({ x: canvas.width + (Math.random() * 400), y: Math.random() * (canvas.height / 2), i: Math.floor(Math.random() * 2) });
    }
    for (let i = 0; i < clouds.length; i++) {
        if (gameStarted) {
            clouds[i].x -= 1;
        }
        ctx.font = '300 52px "Font Awesome 5 Pro"';
        ctx.fillStyle = "#666666";
        ctx.textAlign = 'center';
        ctx.fillText(icons[clouds[i].i], clouds[i].x, clouds[i].y);
    }
}

// Dino object defined.
class Dino {
    constructor() {
        this.x = 200;
        this.y = 220;
    }

    // Show function shows dino on canvas.
    show() {
        ctx.drawImage(dinoImg, this.x, this.y);
    }

    // Move up function moves bird up.
    moveUp() {
        if (this.y > 218) {
            this.y += lift;
        }
    }

    // Update bird.
    update() {
        if (gameStarted) {
            if (this.y < 220) {
                this.y += gravity * ((this.y / 100) * (this.y / 100));
            }
        }
        // Detect collision.
        if (this.x + 60 > obstacleOne.xPosition - 26 && this.x + 60 < obstacleOne.xPosition + 26 && this.y + 60 > 248 && this.y + 60 < 286) {
            resetGame();
        }
    }
}

// Obstacle object.
class Obstacle {
    constructor(xGap) {
        let x = canvas.width - 100;
        if (xGap) {
            x = xGap + obstacleGap + (Math.random() * 100);
        }
        this.xPosition = x;
        this.cross = false;
    }

    // Show function shows it on canvas.
    show() {
        ctx.globalCompositeOperation = 'source-over';
        ctx.font = '300 52px "Font Awesome 5 Pro"';
        ctx.fillStyle = "#3d3d3d";
        ctx.textAlign = 'center';
        ctx.fillText("\uf1ad", this.xPosition, 278);
    }

    // Move function moves obstacle.
    move() {
        this.xPosition -= speed;
        if (this.xPosition < 200 && this.cross == false) {
            score += 1;
            this.cross = true;
        }
    }
}

// Obstacles defined.
let obstacleOne = new Obstacle();
let obstacleTwo = new Obstacle(obstacleOne.xPosition);

let dino = new Dino();

draw();
// Draw function.
function draw() {

    ctx.globalCompositeOperation = 'destination-over';
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas

    showClouds();
    showGround();
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.moveTo(0, 280);
    ctx.lineTo(800, 280);
    ctx.strokeStyle = "#666";
    ctx.stroke();
    showRoadBlocks();

    if (gameStarted) {
        if (obstacleOne.xPosition < - 72) {
            obstacleOne = obstacleTwo;
            obstacleTwo = new Obstacle(obstacleOne.xPosition);
        }
        obstacleOne.move();
        obstacleOne.show();
        obstacleTwo.move();
        obstacleTwo.show();
        // Update dom elements.
        document.getElementById("score_ID").innerText = score;
        if (score > maxScore) {
            maxScore = score;
            document.getElementById("maxScore_ID").innerText = maxScore;
        }
    }
    dino.show();
    dino.update();

    window.requestAnimationFrame(draw);
}