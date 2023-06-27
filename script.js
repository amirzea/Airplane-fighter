let airplane = new Image();
airplane.src = '/Users/adelina/Desktop/wellcode/Modul 4 /OOP/Proiecte/Airplane fighter/airplane.png';
let meteorit = new Image();
meteorit.src = '/Users/adelina/Desktop/wellcode/Modul 4 /OOP/Proiecte/Airplane fighter/meteorit.png';
let explosion = new Image();
explosion.src = "/Users/adelina/Desktop/wellcode/Modul 4 /OOP/Proiecte/Airplane fighter/explosion.png";
let missile = new Image();
missile.src = "/Users/adelina/Desktop/wellcode/Modul 4 /OOP/Proiecte/Airplane fighter/missile.png";
let gameOver = new Image();
gameOver.src = "/Users/adelina/Desktop/wellcode/Modul 4 /OOP/Proiecte/Airplane fighter/gameOver.png";
let board = document.getElementById("canvas");
let canvas = board.getContext("2d");
const directions = ["ArrowUp", "ArrowDown", "ArrowLeft","ArrowRight"];
const TILE = 40;
let rockX, rockY, missileX, missileY;
let planeY = 360, planeX = 320;
let boardUpdateInterval;
let rocksToDestroy = 0;
let hitRocks = 0;
let speed = 400;

function generateBoard() {
    board.height = 400;
    board.width = 400;
    generateRocks();
    canvas.drawImage(airplane, planeX, planeY, TILE, TILE);
    document.addEventListener("keydown", keyIsPressed);
    boardUpdateInterval = setInterval(updateBoard, speed);
}

function generateRocks(){
    rockX = Math.floor(Math.random()* 36) * 10;
    while (rockX % TILE != 0) {
        rockX = Math.floor(Math.random()* 36) * 10;
    }
    rockY = Math.floor(Math.random()); 
}

function updateBoard() {
    canvas.clearRect(0, 0, board.height, board.width);
    placeRocks();
    updatePlane();
    checkPlaneCollision();
    if (rocksToDestroy == 1) {
        shoot();
    }
}

function placeRocks() {
    canvas.drawImage(meteorit, rockX, rockY, TILE, TILE);
    canvas.clearRect(rockX, rockY, TILE, TILE);
    rockY += TILE;
    canvas.drawImage(meteorit, rockX, rockY, TILE, TILE);
    if(rockY > 360) {
        generateRocks();
    }
}

function keyIsPressed(e) {
    if (directions.includes(e.code)) { 
        canvas.clearRect(planeX, planeY, TILE, TILE);
        if (e.code == "ArrowUp") {
            planeY -= TILE;
        } else if (e.code == "ArrowDown") {
            planeY += TILE;
        } else if (e.code == "ArrowLeft") {
            planeX -= TILE;
        } else if (e.code == "ArrowRight") {
            planeX += TILE;
        }
        updatePlane();
    } else if(e.code == "Space") {
        missileX = planeX + 15;
        missileY = planeY - 20;
        canvas.drawImage(missile, missileX, missileY, 10, 20);
        rocksToDestroy = 1;
        shoot();
    }
}    
    
function shoot() {
    canvas.clearRect(missileX, missileY, 10, 20);
    missileY -= 20;
    canvas.drawImage(missile, missileX, missileY, 10, 20);
    if (missileY - 20 <= rockY && missileX - 15 == rockX) {
        rocksToDestroy = 0;
        canvas.drawImage(explosion, missileX - 15, missileY - 20, 100, 100);
        generateRocks();
        ++hitRocks;
        document.getElementById("points").innerHTML = hitRocks;
    }
    if(hitRocks % 5 == 0 && hitRocks > 1) {
        clearInterval(boardUpdateInterval);
        speed -= 20;
        boardUpdateInterval = setInterval(updateBoard, speed);
    }
}    

function updatePlane() {
    canvas.drawImage(airplane, planeX, planeY, TILE, TILE);
}

function checkPlaneCollision() {
    if(rockY >= planeY && rockX == planeX) {
        clearInterval(boardUpdateInterval);
        canvas.clearRect(planeX, planeY, TILE, TILE);
        canvas.drawImage(explosion, planeX, planeY, 100, 100);
        document.removeEventListener("keydown", keyIsPressed, false); 
        canvas.drawImage(gameOver, 100, 100, 200, 200);   
        document.getElementById("button").innerHTML += `
        <button id="replay" type="button" class="btn btn-primary" onClick="window.location.reload();">Replay</button>`;
    }
}

function stopPlaying() {
    clearInterval(boardUpdateInterval);
}
