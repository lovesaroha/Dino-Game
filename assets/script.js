"use-strict";

/*  Love Saroha
    lovesaroha1994@gmail.com (email address)
    https://www.lovesaroha.com (website)
    https://github.com/lovesaroha  (github)
*/

// Themes.
const themes = ["#5468e7", "#e94c2b"];

// Choose random color theme.
let colorTheme = themes[Math.floor(Math.random() * themes.length)];

// This function set random color theme.
function setTheme() {
  // Change css values.
  document.documentElement.style.setProperty("--primary", colorTheme);
}

setTheme();

// Get canvas info from DOM.
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
let obstacleGap = 400;
let gameStarted = false;
let speed = 6;
let lift = -100;
let gravity = 5;
let up = false;
let clouds = [];
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
        clouds.push({ x: Math.random() * canvas.width, y: Math.random() * (canvas.height / 2) + 20, i: Math.floor(Math.random() * 2) });
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
        ctx.strokeStyle = colorTheme;
        ctx.stroke();
        if (gameStarted) {
            roadBlocks[i] -= speed;
        }
    }
}

createRoadBlocks();
createClouds();

// Reset game function.
function resetGame() {
    score = 0;
    speed = 6;
    obstacleOne = new Obstacle();
    obstacleTwo = new Obstacle(obstacleOne.xPosition);
    dino = new Dino();
    gameStarted = false;
    document.getElementById("score_id").innerText = score;
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
        ctx.fillStyle = colorTheme;
        ctx.textAlign = 'center';
        ctx.fillText(icons[clouds[i].i], clouds[i].x, clouds[i].y);
    }
}

// Dino object defined.
class Dino {
    constructor() {
        this.x = 200;
        this.y = 275;
    }

    // Show function shows dino on canvas.
    show() {
        ctx.font = '300 60px "Font Awesome 5 Pro"';
        ctx.fillStyle = colorTheme;
        ctx.textAlign = 'center';
        ctx.fillText("\uf52e", this.x, this.y);
    }

    // Move up function moves bird up.
    moveUp() {
        if (this.y > 250) {
            this.y += lift;
        }
    }

    // Update bird.
    update() {
        if (gameStarted) {
            if (this.y < 275) {
                this.y += gravity;
            }
        }
        // Detect collision.
        if (this.x + 30 > obstacleOne.xPosition - 26 && this.x + 30 < obstacleOne.xPosition + 26 && this.y > 248 && this.y < 286) {
            resetGame();
        }
    }
}

// Obstacle object.
class Obstacle {
    constructor(xGap) {
        let x = canvas.width;
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
        ctx.fillStyle = colorTheme;
        ctx.textAlign = 'center';
        ctx.fillText("\uf1ad", this.xPosition, 278);
    }

    // Move function moves obstacle.
    move() {
        this.xPosition -= speed;
        if (this.xPosition < 200 && this.cross == false) {
            score += 1;
            speed += 0.1;
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
    ctx.clearRect(0, 0, canvas.width, canvas.height); 

    showClouds();
    // Show road.
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.moveTo(0, 280);
    ctx.lineTo(800, 280);
    ctx.strokeStyle = colorTheme;
    ctx.stroke();
    showRoadBlocks();

    if (gameStarted) {
        // Game started move elements.
        if (obstacleOne.xPosition < 0) {
            obstacleOne = obstacleTwo;
            obstacleTwo = new Obstacle(obstacleOne.xPosition);
        }
        obstacleOne.move();
        obstacleOne.show();
        obstacleTwo.move();
        obstacleTwo.show();
        // Update dom elements.
        document.getElementById("score_id").innerText = score;
        if (score > maxScore) {
            maxScore = score;
            document.getElementById("maxScore_id").innerText = maxScore;
        }
    }
    dino.show();
    dino.update();

    window.requestAnimationFrame(draw);
}