const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const canvas1 = document.getElementById("myCanvas1");
const ctx1 = canvas1.getContext("2d");

const width = canvas.width;
const height = canvas.height;



const row=height/13;
const col=width/15;

let gameOver = false;
let lives = 3;
let sheepInChair = [false,false,false,false,false];
let score = 0;
let startTime = Date.now(); 
const gameDuration = 50000; 
const gameOverCard = document.getElementById('gameOverCard');
const gameWinCard = document.getElementById('gameWinCard');
const restartButton = document.getElementById('restartButton');
const continueButton = document.getElementById('continueButton');
restartButton.addEventListener('click', restartGame);
continueButton.addEventListener('click', restartGame);

var theme1 = new Audio("audio/shaun-the-sheep-theme-song-piano-sheet-music_QhTOwHGR.mp3");
// theme1.loop = true;
// theme1.play();
const theme2 = new Audio("audio/sheep_baa.ogg");
const theme3 = new Audio("audio/horn.wav");
// theme2.play();



//////////////////////////////////////////////////////////
////////////////BACKGROUND////////////////////////////////
//////////////////////////////////////////////////////////

class Background {
    constructor(ctx, width, height, row, col) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.row = row;
    this.col = col;
    this.halfCol = col / 1.5;
    this.halfRow = row / 1.5;
    }

    drawHorizontalLine(y, color = "gray", lineWidth = 1) {
    this.ctx.beginPath();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.moveTo(0, y);
    this.ctx.lineTo(this.width, y);
    this.ctx.stroke();
    }

    drawVerticalLine(x, start, end, color = "gray", lineWidth = 1) {
    this.ctx.beginPath();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.moveTo(x, start);
    this.ctx.lineTo(x, end);
    this.ctx.stroke();
    }

    drawRect(x, y, w, h, color) {
    this.ctx.beginPath();
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, w, h);
    }

    drawDottedLine(x, y, segments = 12, space = 50, segmentLength = 30, color = "gray") {
    this.ctx.beginPath();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 2.5;

    for (let i = 0; i < segments; i++) {
    this.ctx.moveTo(i * (x + space), y);
    this.ctx.lineTo(i * (x + space) + segmentLength, y);
    }
    this.ctx.stroke();
    }

    drawSheepChair(x, y, w, h) {
    this.ctx.beginPath();
    this.ctx.lineWidth = 4;
    this.ctx.strokeStyle = "#5C4033";
    this.ctx.strokeRect(x, y, w, h);
    }

    drawBush(x, y) {
    this.ctx.beginPath();
    this.ctx.fillStyle = "#18452C";
    this.ctx.arc(x, y, 12, 0, 2 * Math.PI);
    this.ctx.fill();
    }

    drawThickHorizontalLine(y, color = "#388004", lineWidth = 5) {
    this.ctx.beginPath();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.moveTo(0, y);
    this.ctx.lineTo(this.width, y);
    this.ctx.stroke();
    }

    drawSections() {
    const sections = [
    { x: 0, y: 0, w: this.width, h: this.row, color: "#388004" },
    { x: 0, y: this.row, w: this.width, h: 5 * this.row, color: "#005493" },
    { x: 0, y: 6 * this.row, w: this.width, h: this.row, color: "#A9A9A9" },
    { x: 0, y: 7 * this.row, w: this.width, h: 5 * this.row, color: "#555555" },
    { x: 0, y: 12 * this.row, w: this.width, h: this.row, color: "#A9A9A9" },
    ];
    sections.forEach(section => this.drawRect(section.x, section.y, section.w, section.h, section.color));
    }

    drawGridLines() {
    for (let i = 0; i <= 15; i++) {
    let x = i * this.col;
    this.drawVerticalLine(x, 12 * this.row, 13 * this.row);
    this.drawVerticalLine(x, 6 * this.row, 7 * this.row);
    }

    const horizontalLines = [
    12 * this.row, 12.5 * this.row, 13 * this.row,
    7 * this.row, 6.75 * this.row, 6.5 * this.row,
    6.25 * this.row, 6 * this.row
    ];
    horizontalLines.forEach(y => this.drawHorizontalLine(y));
    }

    drawDottedRoad() {
    const roadStartY = 7 * this.row;
    const roadHeight = 5 * this.row;
    const lineSpacing = roadHeight / 5;

    for (let i = 1; i < 5; i++) {
    let yPosition = roadStartY + (i * lineSpacing);
    this.drawDottedLine(8, yPosition);
    }
    }

    drawBushes() {
    for (let i = 0; i <= 15; i += 3) {
    this.drawBush(i * this.col, 20);
    }
    }

    drawSheepChairs() {
    for (let i = 0; i <= 12; i += 3) {
    this.drawSheepChair(i * this.col + 25, 0, 2 * this.halfCol, this.row);
    }
    }

    drawBackground() {
    this.drawSections();
    this.drawGridLines();
    this.drawDottedRoad();
    this.drawSheepChairs();
    this.drawBushes();
    this.drawThickHorizontalLine(this.row);
    }
}

const background = new Background(ctx, width, height, row, col);
background.drawBackground();



///////////////////////////////////////////////////////////
////////////////////////SHEEP//////////////////////////////
//////////////////////////////////////////////////////////

const sheepImg= new Image();
sheepImg.src = "image/3.png";

const deadSheepImg= new Image();
deadSheepImg.src = "image/2.png";


class Player {
    constructor(x1, y1, w1, h1) {
    this.x1 = x1;
    this.y1 = y1;
    this.w1 = w1;
    this.h1 = h1;
    }

    moveUp() {
    if(this.y1>0){
    this.y1 -= 1;
    }
    }

    moveDown() {
    if(this.y1< 12){
    this.y1 += 1;
    }
    }

    moveLeftSide() {
    if(this.x1>0){
    this.x1 -= 1;
    }
    }

    moveRightSide() {
    if(this.x1< 14){
    this.x1 += 1;
    }
    }
    drawSheep() {
    ctx.drawImage(sheepImg, this.x1 * col, this.y1 * row, col,row);
    };

    deadSheep(){
    ctx.drawImage(deadSheepImg, this.x1 * col, this.y1 * row, col,row);
    };
    resetSheep(){
    this.x1 = 7;
    this.y1 = 12;
    }

}



const player = new Player(7, 12, row, col);

document.addEventListener("keydown", function (event) {
    switch (event.key) {
    case "ArrowUp":
    case "w":
    player.moveUp();
    break;
    case "ArrowDown":
    case "s":
    player.moveDown();
    break;
    case "ArrowLeft":
    case "a":
    player.moveLeftSide();
    break;
    case "ArrowRight":
    case "d":
    player.moveRightSide();
    break;
    }
});



/////////////////////////////////////////////////////
/////////////////CAR/////////////////////////////////
/////////////////////////////////////////////////////


class Car {
    constructor(x, y, w, h, velocity,img) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.velocity = velocity;
    this.img = img;
    }

    moveRight() {
    this.x+= this.velocity;
    }

    moveLeft() {
    this.x-=this.velocity;
    }
    drawCar() {
    ctx.drawImage(this.img, this.x * col, this.y * row, this.w,this.h);
    }
}

const carImages = [
'image/Audi.png',
'image/Ambulance.png',
'image/Black_viper.png',
'image/Car.png',
'image/Mini_truck.png',
'image/Mini_van.png',
'image/Police.png',
'image/taxi.png'
];

const carImagesFlip = [
'image/Audi - Copy.png',
'image/Ambulance - Copy.png',
'image/Black_viper - Copy.png',
'image/Car - Copy.png',
'image/Mini_truck - Copy.png',
'image/Mini_van - Copy.png',
'image/Police - Copy.png',
'image/taxi - Copy.png'
];

const truckImg = new Image();
truckImg.src = "image/truck.png";

const getRandomCarImage = () => {
    const carBox=carImages[Math.floor(Math.random() * carImages.length)];
    const img = new Image();
    img.src = carBox;
    return img;
};
const getRandomCarImageFlip = () => {
    const carBoxFlip=carImagesFlip[Math.floor(Math.random() * carImagesFlip.length)];
    const img = new Image();
    img.src = carBoxFlip;
    return img;
};


const lane1Attributes = [-2, 11.1,50,30 , 0.05];
const lane2Attributes = [14, 10.1,50,30 , 0.1];
const lane3Attributes = [-2, 9.1,50,30, 0.05];
const lane4Attributes = [14, 8.1,50,30 , 0.1];
const lane5Attributes = [-5, 7, 100, 35, 0.025];


lane1Cars = [];
lane2Cars = [];
lane3Cars = [];
lane4Cars = [];
lane5Cars = [];


function generateCar(attributes, isTruckLane = false, isFlipped = false) {
    const [x, y, width, height, speed] = attributes;
    const img = isTruckLane
    ? truckImg
    : isFlipped
    ? getRandomCarImageFlip()
    : getRandomCarImage();

    return new Car(x, y, width, height, speed, img);
}


function spawnCarsForLane(laneCars, attributes, isTruckLane = false, isFlipped = false) {
    const numCars = Math.floor(Math.random() * 3) + 1;
    const yOffset = attributes[1];
    const xOffset = attributes[0];
    const xSpacing = 100;
    const carWidth = attributes[2];

    let lastCarXPosition = xOffset;

    for (let i = 0; i < numCars; i++) {
    const carXOffset = lastCarXPosition + i * (carWidth + xSpacing);

    laneCars.push(generateCar([carXOffset, yOffset, carWidth, attributes[3], attributes[4]], isTruckLane, isFlipped));

    lastCarXPosition = carXOffset + carWidth;
    }
}


setInterval(() => spawnCarsForLane(lane1Cars, lane1Attributes), Math.random() * 1000 + 4000);
setInterval(() => spawnCarsForLane(lane2Cars, lane2Attributes, false, true), Math.random() * 1000 + 4000);
setInterval(() => spawnCarsForLane(lane3Cars, lane3Attributes), Math.random() * 1000 + 3000);
setInterval(() => spawnCarsForLane(lane4Cars, lane4Attributes, false, true), Math.random() * 1000 + 4000);
setInterval(() => spawnCarsForLane(lane5Cars, lane5Attributes, true), Math.random() * 5000 + 3000);



function collisionDetect(player, obstacle) {
    if (
        (player.x1 * col ) < (obstacle.x * col) + obstacle.w &&
        (player.x1 * col ) + col > (obstacle.x * col) &&
        (player.y1 * row ) < (obstacle.y * row) + obstacle.h &&
        (player.y1 * row ) + row > (obstacle.y * row)
        ) {
            return true;
    }
}


/////////////////////////////////////////////////////
/////////////////LOG/////////////////////////////////
/////////////////////////////////////////////////////

class log {
    constructor(x, y, w, h, velocity,img) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.velocity = velocity;
    this.img = img;
    }

    moveRight() {
    this.x+= this.velocity;
    }
    drawlog() {
    ctx.drawImage(this.img, this.x * col, this.y * row, this.w,this.h);
    }
}
const logImg = new Image();
logImg.src = "image/wood1.jpg";
const logImg1 = new Image();
logImg1.src = "image/wood 2.jpg";
waterLane1Logs = [];
waterLane2Logs = [];
waterLane3Logs = [];
waterLane4Logs = [];
waterLane5Logs = [];

function generateLog(attributes) {
    const [x, y, w, h, velocity, img] = attributes;
    return new log(x, y, w, h, velocity, img);
}

function spawnLogsForLane(logs, attributes) {
    const numLogs = Math.floor(Math.random() * 3) + 1; 
    const yOffset = attributes[1];
    const xOffset = attributes[0];
    const xSpacing = 80; 
    const logWidth = attributes[2];

    let lastLogXPosition = xOffset;

    for (let i = 0; i < numLogs; i++) {
    const logXOffset = lastLogXPosition + i * (logWidth + xSpacing);

    logs.push(generateLog([logXOffset, yOffset, logWidth, attributes[3], attributes[4], attributes[5]]));

    lastLogXPosition = logXOffset + logWidth;
    }
}

setInterval(() => spawnLogsForLane(waterLane1Logs, [-13, 5.15, col * 4, row / 1.5, 0.01, logImg]), Math.random() * 1000+ 1000);
setInterval(() => spawnLogsForLane(waterLane2Logs, [19, 4.15, col * 3.5, row / 1.5, -0.01, logImg1]), Math.random() * 1000+ 1000);
setInterval(() => spawnLogsForLane(waterLane3Logs, [-13, 3.15, col * 4, row / 1.5, 0.01, logImg]), Math.random() * 1000+ 1000);
setInterval(() => spawnLogsForLane(waterLane4Logs, [19, 2.15, col * 3.5, row / 1.5, -0.01, logImg1]), Math.random() * 1000+ 1000);
setInterval(() => spawnLogsForLane(waterLane5Logs, [-13, 1.15, col * 4, row / 1.5, 0.01, logImg]), Math.random() * 1000+ 1000);

const zone = {
x: 0,
y: 38.46,
width: 469.95,
height: 192.3
};


function isSheepInWater(sheep, zone,) {
    const sheepCenterX = sheep.x1 * col + sheep.w1 / 2;
    const sheepCenterY = sheep.y1 * row + sheep.h1 / 2;
    if (
    sheepCenterX >= zone.x &&
    sheepCenterX <= zone.x + zone.width &&
    sheepCenterY >= zone.y &&
    sheepCenterY <= zone.y + zone.height
) {

return true;
}
return false;
}

function collisionWithLog(sheep,log)
{
    const sheepCenterX = sheep.x1 *col + sheep.w1 / 2;
    const sheepCenterY = sheep.y1 *row + sheep.h1 / 2;
    const logX = log.x * col;
    const logY = log.y * row;
    const logWidth = log.w;
    const logHeight = log.h;

    if (
        sheepCenterX >= logX &&
        sheepCenterX <= logX + logWidth &&
        sheepCenterY >= logY &&
        sheepCenterY <= logY + logHeight
    ) {
        return true;
    }
        return false;
}



function drawdotws (x,y)
{
    const dotX = x;
    const dotY = y
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.arc(dotX, dotY, 3, 0, 2 * Math.PI);
    ctx.fill();
}

/////////////////////////////////////////////////////
/////////////////GOAL SECTION/////////////////////////////////
/////////////////////////////////////////////////////
const prohibitedZones = [
    { x: 0, y: 0.77, width: 31.33, height: 38.46 },
    { x: 78.33, y: 0.77, width: 31.33, height: 38.46 },
    { x: 172.33, y: 0.77, width: 31.33, height: 38.46 },
    { x: 266.33, y: 0.77, width: 31.33, height: 38.46 },
    { x: 360.33, y: 0.77, width: 31.33, height: 38.46 },
    { x: 454.33, y: 0.77, width: 31.33, height: 38.46 }
    ];

    function isSheepInProhibitedZone(sheep, prohibitedZones) {
    const sheepCenterX = sheep.x1 *col + sheep.w1 / 2 -3 ;
    const sheepCenterY = sheep.y1 *row + sheep.h1 / 2 +3;
    for (let i = 0; i < prohibitedZones.length; i++) {
        const zone = prohibitedZones[i];

    if (
        sheepCenterX >= zone.x -20 &&
        sheepCenterX <= zone.x + zone.width +20 &&
        sheepCenterY >= zone.y &&
        sheepCenterY <= zone.y + zone.height
    ) {
    return true;
    }
    }

    return false;
}


const sheepChairs = [
{ x: 25, y: 0, width: 31.33, height: 38.46 },
{ x: 118.99, y: 0, width: 31.33, height: 38.46 },
{ x: 212.98, y: 0, width: 31.33, height: 38.46 },
{ x: 306.97, y: 0, width: 31.33, height: 38.46 },
{ x: 400.96, y: 0, width: 31.33, height: 38.46 }
];
function isSheepInSheepChair(sheep, sheepChairs) {
    const sheepCenterX = sheep.x1 * col + sheep.w1 / 2;
    const sheepCenterY = sheep.y1 * row + sheep.h1 / 2;

    for (let i = 0; i < sheepChairs.length; i++) {
        const chair = sheepChairs[i];
        if (
            sheepCenterX >= chair.x &&
            sheepCenterX <= chair.x + chair.width &&
            sheepCenterY >= chair.y &&
            sheepCenterY <= chair.y + chair.height
        ) {
            // console.log('Sheep in pen' + i);
            return {condition:true,chair:i};
        }
    }

    return {condition:false,chair:-1};
}






/////////////////////////////////////////////////////
/////////////////Animate/////////////////////////////////
/////////////////////////////////////////////////////
let inLog = false;
let animationFrameId;
const animate = () => {
    animationFrameId = requestAnimationFrame(animate);
    const elapsedTime = Date.now() - startTime;
    const timeRemaining = Math.floor((gameDuration - elapsedTime) / 1000);
    // theme1.loop = true;
    // theme1.play();
    ctx1.clearRect(0, 0, canvas1.width, canvas1.height);

    ctx1.font = "35px 'Press Start 2P'";
    ctx1.fillStyle = "white";
    ctx1.fillText("Sheepish Game", canvas1.width/1.4, 45);

    ctx1.font = "15px 'Press Start 2P'";
    ctx1.fillStyle = "white";
    ctx1.fillText("By Cimrika Bajracharya", canvas1.width/1.6, 70);

    ctx1.font = "20px 'Press Start 2P'";
    ctx1.fillStyle = "yellow";
    ctx1.fillText("Score:", canvas1.width/7, 95);
    ctx1.font = "20px 'Press Start 2P'";

    ctx1.fillStyle = "yellow";
    ctx1.font = "20px Arial";
    ctx1.textAlign = "right";

    ctx1.fillText(timeRemaining, canvas.width / 1.01, 95);
    ctx1.fillText("Time:", canvas.width/1.06, 95);

    ctx1.fillText(lives, canvas1.width / 1.25, canvas1.height-40);
    ctx1.fillText("Lives:", canvas1.width/1.3, canvas1.height-40);



    if (timeRemaining < 0 && !gameOver) {
        lives-=1;
        resetGame();
    }

    const inWater = isSheepInWater(player,zone);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    background.drawBackground();
    inLog = false;
    [waterLane1Logs,waterLane2Logs,waterLane3Logs,waterLane4Logs,waterLane5Logs].forEach((laneLogs) => {
    laneLogs.forEach((log, index) => {
    log.drawlog();
    log.moveRight();
    if (collisionWithLog(player,log))
    {
        inLog = true;
        if ((log.velocity <0 && player.x1>0) || (log.velocity >0 && player.x1<14))
        {
        player.x1 += log.velocity;
        }
    }
    if (log.x > canvas.width || log.x < -log.w) {
    laneLogs.splice(index, 1);
    }
    });
    });
    player.drawSheep();
    if (inWater && !inLog)
    {
    // console.log("In water");
    theme2.play();
    player.resetSheep();
    lives-=1;
    }
    else if (inLog)
    {
    // console.log("In log");
    }


    [lane1Cars, lane2Cars, lane3Cars, lane4Cars, lane5Cars].forEach((laneCars, laneIndex) => {
    laneCars.forEach((car, index) => {
    car.drawCar();
    if (laneIndex === 1 || laneIndex === 3) {
    car.moveLeft();
    } else {
    car.moveRight();
    }
    if (collisionDetect(player, car)){
        theme2.play();
        // theme3.play();
        player.resetSheep();
    lives-=1;
    }
    if (car.x > canvas.width || car.x < -car.width) {
    laneCars.splice(index, 1);

    }
    });
});

const result = isSheepInProhibitedZone(player, prohibitedZones);

if (result) {
theme2.play();
player.resetSheep();
lives-=1;
} else {
// console.log("Sheep is in a safe area.");
}

const result1 = isSheepInSheepChair(player, sheepChairs);
// console.log(result1.condition);

if (result1.condition) {
// console.log("Sheep is in chair");
if (!sheepInChair[result1.chair])
{
score += 500;
player.resetSheep();
storeSheepinChair(result1.chair);
}
else
{
player.resetSheep();
lives-=1;
}
} else {

}

if (lives<=0){
    cancelAnimationFrame(animationFrameId);
    drawGameOverScreen();
}
let sheepsinchair=0;
for (let i=0;i<sheepInChair.length;i++)
{
if (sheepInChair[i])
{
    sheepsinchair+=1;
    drawNonPlayerSheep(sheepChairs[i].x,sheepChairs[i].y);
}
if (sheepsinchair==5)
{
    cancelAnimationFrame(animationFrameId);
    theme1.play();
    drawGameWinScreen();
}
}

ctx1.fillStyle = "yellow";
ctx1.fillText(score,canvas.width/4, 95);
};

startNewGame();
function resetGame() {
    if(lives>0){
        startTime = Date.now();
        player.resetSheep();
    }
    else{
       player.resetSheep();
       cancelAnimationFrame(animationFrameId);
       drawGameOverScreen();
    }
};

// let gameOverTime = 3000; // Duration for Game Over screen (in milliseconds)
// let gameOverStartTime = 0;

function startNewGame()
{
    lives = 3;
    sheepInChair = [false,false,false,false,false];
    lane1Cars = [];
    lane2Cars = [];
    lane3Cars = [];
    lane4Cars = [];
    lane5Cars = [];



    offset = 40;
    waterLane1Logs = [];
    waterLane2Logs = [];
    waterLane3Logs = [];
    waterLane4Logs = [];
    waterLane5Logs = [];

    resetGame();
    requestAnimationFrame(animate);

}

function storeSheepinChair(chairNo){
sheepInChair[chairNo] = true;
}

function drawNonPlayerSheep(x,y)
{
ctx.drawImage(sheepImg,x,y, col,row);
}


function drawGameOverScreen() {
    // ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    gameOverCard.style.display = "block";
  }

function restartGame()
{
    gameOverCard.style.display = "none";
    gameWinCard.style.display = "none";
    theme1.pause();
    theme1.currentTime = 0;
    startNewGame();
}

function drawGameWinScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    // Display the Game Win Card
    gameWinCard.style.display = "block";
  }