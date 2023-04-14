const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext("2d");
// we will need the gamecontainer to make it blurry
// when we display the end menu
const gameContainer = document.getElementById('game-container');
let planetMass = 0;
let planetRadius = 0;
const flappyImg = new Image();
flappyImg.src = 'assets/spaceship.png';

//Game constants
const FLAP_SPEED = -5;
const BALL_WIDTH = 40;
const BALL_HEIGHT = 30;
const PIPE_WIDTH = 50;
const PIPE_GAP = 125;

// Ball variables
let ballX = 50;
let ballY = 50;
const earthMass = 5.97219 * (10**24);
const earthRad = 6371 * 1000;
const gravityConst = 6.6743 * (10**-11);
const earthAcc = (gravityConst * earthMass) / (earthRad ** 2)
let ballVelocity = 0;
let ballAcceleration = 0;


// Pipe variables
let pipeX = 400;
let pipeY = canvas.height - 200;

// score and highscore variables
let scoreDiv = document.getElementById('score-display');
let score = 0;
let highScore = 0;

// we add a bool variable, so we can check when flappy passes we increase
// the value
let scored = false;

// lets us control the ball with the space key
document.body.onkeyup = function(e) {
        ballVelocity = FLAP_SPEED;
}

// lets us restart the game if we hit game-over
document.getElementById('restart-button').addEventListener('click', function() {
    hideEndMenu();
    resetGame();
    loop();
})



function increaseScore() {
    // increase now our counter when our ball passes the pipes
    if(ballX > pipeX + PIPE_WIDTH && 
        (ballY < pipeY + PIPE_GAP || 
          ballY + BALL_HEIGHT > pipeY + PIPE_GAP) && 
          !scored) {
        score++;
        scoreDiv.innerHTML = score;
        scored = true;
    }

    // reset the flag, if ball passes the pipes
    if (ballX < pipeX + PIPE_WIDTH) {
        scored = false;
    }
}

function collisionCheck() {
    // Create bounding Boxes for the ball and the pipes

    const ballBox = {
        x: ballX,
        y: ballY,
        width: BALL_WIDTH,
        height: BALL_HEIGHT
    }

    const topPipeBox = {
        x: pipeX,
        y: pipeY - PIPE_GAP + BALL_HEIGHT,
        width: PIPE_WIDTH,
        height: pipeY
    }

    const bottomPipeBox = {
        x: pipeX,
        y: pipeY + PIPE_GAP + BALL_HEIGHT,
        width: PIPE_WIDTH,
        height: canvas.height - pipeY - PIPE_GAP
    }

    // Check for collision with upper pipe box
    if (ballBox.x + ballBox.width > topPipeBox.x &&
        ballBox.x < topPipeBox.x + topPipeBox.width &&
        ballBox.y < topPipeBox.y) {
            return true;
    }

    // Check for collision with lower pipe box
    if (ballBox.x + ballBox.width > bottomPipeBox.x &&
        ballBox.x < bottomPipeBox.x + bottomPipeBox.width &&
        ballBox.y + ballBox.height > bottomPipeBox.y) {
            return true;
    }

    // check if bird hits boundaries
    if (ballY < 0 || ballY + BALL_HEIGHT > canvas.height) {
        return true;
    }


    return false;
}

function hideEndMenu () {
    document.getElementById('end-menu').style.display = 'none';
    gameContainer.classList.remove('backdrop-blur');
}

function showEndMenu () {
    document.getElementById('end-menu').style.display = 'block';
    gameContainer.classList.add('backdrop-blur');
    document.getElementById('end-score').innerHTML = score;
    // This way we update always our highscore at the end of our game
    // if we have a higher high score than the previous
    if (highScore < score) {
        highScore = score;
    }
    document.getElementById('best-score').innerHTML = highScore;
}

// we reset the values to the beginning so we start 
// with the ball at the beginning
function resetGame() {
    ballX = 50;
    ballY = 50;
    ballVelocity = 0;
    planetMass = (2 ** document.getElementById('Mass').value) * earthMass;
    console.log(planetMass);
    planetRadius = document.getElementById('Radius').value * 1000;
    planetAcc = (gravityConst * planetMass) / (planetRadius**2)
    ballAcceleration = 0.3 * Math.pow((planetAcc/earthAcc), 1/4);

    pipeX = 400;
    pipeY = canvas.height - 200;

    score = 0;
}

function endGame() {
    showEndMenu();
}

function loop() {
    // reset the ctx after every loop iteration
    console.log(ballAcceleration);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Flappy Bird
    ctx.drawImage(flappyImg, ballX, ballY);

    // Draw Pipes
    ctx.fillStyle = '#333';
    ctx.fillRect(pipeX, -100, PIPE_WIDTH, pipeY);
    ctx.fillRect(pipeX, pipeY + PIPE_GAP, PIPE_WIDTH, canvas.height - pipeY);

    // now we would need to add an collision check to display our end-menu
    // and end the game
    // the collisionCheck will return us true if we have a collision
    // otherwise false
    if (collisionCheck()) {
        endGame();
        return;
    }


    // forgot to mvoe the pipes
    pipeX -= 1.5 + (.15 * score) ** 2;
    // if the pipe moves out of the frame we need to reset the pipe
    if (pipeX < -50) {
        pipeX = 400;
        pipeY = Math.random() * (canvas.height - PIPE_GAP) + PIPE_WIDTH;
    }

    // apply gravity to the bird and let it move
    ballVelocity += ballAcceleration;
    ballY += ballVelocity;

    // always check if you call the function ...
    increaseScore()
    requestAnimationFrame(loop);
}

endGame();
