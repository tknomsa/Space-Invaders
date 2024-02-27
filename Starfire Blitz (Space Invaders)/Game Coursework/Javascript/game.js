// Creating canvas
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = 700;
canvas.height = 620;

// Game state
let score = 0;
let shotsFired = 0;
let shotsOnTarget = 0;
let lives = 5;
let paused = false; 
let myMusic = document.querySelector('#music')

// Implementing levels
const easyLevel = {
    projectileInterval: 1000,
    invaderSpeed: 3,
    multiplierSpeed: 5,
    extraSpeed: 5,
    powerSpeed: 5,
};

const hardLevel = {
    projectileInterval: 500,
    invaderSpeed: 6,
    multiplierSpeed: 10,
    extraSpeed: 10,
    powerSpeed: 10,
};

// Setting default level to easy
let currentLevel = easyLevel; 

// Displaying pop up
function showPopup() {
    const popup = document.getElementById('popup');
    popup.style.display = 'block';
}
// Flag to track if game is in progress
let isPlaying = false;

// Level selection
function levelSelection() {
    const levelSelectionDiv = document.getElementById('levelSelection');
    levelSelectionDiv.style.display = 'block';
}

// Starting game with chosen level
function startGame(level) {
    const popup = document.getElementById('popup');
    popup.style.display = 'none'; // Hiding the pop up
    isPlaying = true;

    if (level === 'easy') {
        currentLevel = easyLevel;
    } else if (level === 'hard') {
        currentLevel = hardLevel;
    }

    resetGame();

    levelSelection();

    // Playing the music
    myMusic.play()
}

// Initializing hearts
function initializeHearts() {
    updateHearts();
}

initializeHearts();

// Toggling the pause state
function togglePause() {
    paused = !paused;
    const pauseButton = document.getElementById('pauseButton');
    if (paused) {
        pauseButton.innerText = 'PLAY';
        myMusic.pause()
    } else {
        pauseButton.innerText = 'PAUSE';
        myMusic.play();
    }
}

// Function to pause and play game
function pauseGame() {
    togglePause();
}

// Displaying the GAME OVER popup
function showGameOverPopup() {
    // Getting elements
    const gameOverPopup = document.getElementById('gameOverPopup');
    const finalScoreElement = document.getElementById('finalScore');
    const shotsFiredElement = document.getElementById('shotsFired');
    const shotsOnTargetElement = document.getElementById('shotsOnTarget');

    if (gameOverPopup && finalScoreElement && shotsFiredElement && shotsOnTargetElement) {
        finalScoreElement.innerText = `Final Score: ${score}`;
        shotsFiredElement.innerText = `Shots Fired: ${shotsFired}`;
        shotsOnTargetElement.innerText = `Shots On Target: ${shotsOnTarget}`;
        gameOverPopup.style.display = 'block';
    }
}
 
function endGame() {
    isPlaying = false; // Setting game state to not playing
    showGameOverPopup();
}

function resetGame() {
    // Resetting game variables to their initial state
    score = 0;
    lives = 5;
    shotsFired = 0;
    shotsOnTarget = 0;
    isPlaying = true;

    // Resetting player position
    player.position = {
        x: canvas.width / 2 - player.width / 2,
        y: canvas.height - player.height - 20
    };

    // Clearing game elements
    projectiles.length = 0;
    grid.invaders.length = 0;
    playerProjectiles.length = 0;
    bonuses.length = 0; 

    updateScore();

    updateLocalScore();

    updateHearts();

    // Hiding the GAME OVER popup
    const gameOverPopup = document.getElementById('gameOverPopup');
    if (gameOverPopup) {
        gameOverPopup.style.display = 'none';
    }
}

// Restarting game
function restartGame() {
    resetGame();
}
showPopup();

function updateHearts() {
    const heartsContainer = document.getElementById('heartsContainer');
    heartsContainer.innerHTML = ''; 

    for (let i = 0; i < lives; i++) {
        const heartIcon = document.createElement('i'); // Creating herat icon
        heartIcon.classList.add('fa-solid', 'fa-heart');
        heartsContainer.appendChild(heartIcon); // Appending heart icon
    }
}

// Event listeners for level and play buttons
document.getElementById('easyButton').addEventListener('click', function() {
    startGame('easy');
});

document.getElementById('hardButton').addEventListener('click', function() {
    startGame('hard');
});

const playButton = document.getElementById('playButton');
playButton.addEventListener('click', startGame);

// Creating Player class
class Player {
    constructor() {
        // Initializing the player's velocity
        this.velocity = {
            x: 0,
            y: 0
        };

        const image = new Image();
        image.src = 'Images/spaceship.png';
        // Setting up properties after the image has loaded
        image.onload = () => {
            const scale = 0.15;
            this.image = image;
            this.width = image.width * scale;
            this.height = image.height * scale;
            // Initializing player's starting position
            this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - this.height - 20
            };
        };
    }

    // Drawing player spaceship on canvas
    draw() {
        c.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
    }

    // Checking for collison with other game objects
    isCollision(gameObject) {
        // Defining the player's bounding box
        const playerLeft = this.position.x;
        const playerRight = this.position.x + this.width;
        const playerTop = this.position.y;
        const playerBottom = this.position.y + this.height;

        // Defining other game object's bounding box
        let objectLeft, objectRight, objectTop, objectBottom;

        // Collision with player and enemy
        if (gameObject instanceof Projectile) {
            objectLeft = gameObject.position.x - gameObject.radius;
            objectRight = gameObject.position.x + gameObject.radius;
            objectTop = gameObject.position.y - gameObject.radius;
            objectBottom = gameObject.position.y + gameObject.radius;
            //Collision with invaders and enemy spaceship
        } else if (gameObject instanceof Invader) {
            objectLeft = gameObject.position.x;
            objectRight = gameObject.position.x + gameObject.width;
            objectTop = gameObject.position.y;
            objectBottom = gameObject.position.y + gameObject.height;
        } else {
            return false; 
        }

        // Collision detection
        return (
            playerLeft < objectRight &&
            playerRight > objectLeft &&
            playerTop < objectBottom &&
            playerBottom > objectTop
        );
    }

    // Updating player position
    update() {
        if (this.image) {
            this.draw();
            this.position.x += this.velocity.x;
        }

        // Checking for collison with enemy projectiles
        projectiles.forEach((projectile, index) => {
            if (projectile.type === 'enemy' && this.isCollision(projectile)) {
                // Removing collided projectiles
                projectiles.splice(index, 1);
                lives--;

                // Checking player's life count
                if (lives === 0) {
                    endGame(); 
                } else {
                    updateHearts(); 
                }
            }
        });

        // Checking for collision with invaders
        grid.invaders.forEach((invader) => {
            if (this.isCollision(invader)) {
                endGame();
            }
        });
    }
}

// Creating Projectile class
class Projectile {
    constructor({ position, velocity }) {
        // Initializing projectile position and velocity
        this.position = position;
        this.velocity = velocity;
        this.radius = 4.5;
    }

    // Drawing projectiles on canvas
    draw() {
        // Drawing the path for the projectiles
        c.beginPath();
        if (this.type === 'enemy') {
            c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
            c.fillStyle = 'pink'; // Setting filling style for enemy projectiles
        } else if (this.type === 'player') {
            c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
            c.fillStyle = 'orange'; // Setting filling style for enemy projectiles
        }
        // Filling drawn path
        c.fill();
        // Clothing path
        c.closePath();
    }

    // Updating the projectile's position based on velocity
    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

// Class representing the player's projectiles
class PlayerProjectile extends Projectile {
    constructor({ position, velocity }) {
        // Calling constructor of parent class
        super({ position, velocity: { x: velocity.x, y: -6 } });
        this.type = 'player'; // Set the type to identify player projectiles
    }
}

// Creating Explosion class
class Explosion {
    constructor(position) {
         // Initializing explosion position and particle array
        this.position = position;
        this.particles = [];
        this.particleCount = 30;

        // Creating particles with random angles, colours and speeds
        for (let i = 0; i < this.particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 5 + 2; 
            const color = 'pink'; 

            // Creating a particle object
            const particle = {
                x: this.position.x,
                y: this.position.y,
                radius: 3,
                angle: angle,
                speed: speed,
                color: color,
            };

            // Adding partile to particles array
            this.particles.push(particle);
        }
    }

    // Updating method to move and draw particles
    update() {
        // Iterating through each particle in the array
        this.particles.forEach((particle, index) => {
            // Moving particles based on angle and speed
            particle.x += Math.cos(particle.angle) * particle.speed;
            particle.y += Math.sin(particle.angle) * particle.speed;

            c.beginPath();
            c.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            c.fillStyle = particle.color;
            c.fill();
            c.closePath();

            // Decreasing particle radius over time
            particle.radius -= 0.1;

            // Removing particle based on the radius size
            if (particle.radius <= 0) {
                this.particles.splice(index, 1);
            }
        });
    }
}

// Creating Invader class
class Invader {
    constructor({ x, y, difficulty }) {
        const image = new Image();
        image.src = 'Images/invader2.png';
        const scale = 1.75;
        this.image = image;
        this.width = image.width * scale;
        this.height = image.height * scale;
        // Setting initial position of invader
        this.position = {
            x: x,
            y: y + this.height
        };
        this.speed = currentLevel.invaderSpeed;;

        // Setting speed based on difficulty level
        if (difficulty === 'easy') {
            this.speed = currentLevel.invaderSpeed;
        } else if (difficulty === 'hard') {
            this.speed = hardLevel.invaderSpeed;
        }
    }

    // Drawing invader on canvas
    draw() {
        c.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
    }

    // Updating the invader's position    
    update() {
        this.draw();
        // Moving invader horizontally based on speed
        this.position.x += this.speed; 
    }

    // Moving invader down and changing direction
    moveDown() {
        this.position.y += this.height;
        // Changing direction based on the current speed
        if (this.speed > 0) {
            this.speed = -this.speed; 
        } else {
            this.speed = Math.abs(this.speed); 
        }
    }

    // Checking for collision with player projectile
    isCollision(projectile) {
        // Defining boundaries of the invader and the projectile
        const invaderLeft = this.position.x;
        const invaderRight = this.position.x + this.width;
        const invaderTop = this.position.y;
        const invaderBottom = this.position.y + this.height;

        const projectileLeft = projectile.position.x - projectile.radius;
        const projectileRight = projectile.position.x + projectile.radius;
        const projectileTop = projectile.position.y - projectile.radius;
        const projectileBottom = projectile.position.y + projectile.radius;

        // Collison detection
        return (
            invaderLeft < projectileRight &&
            invaderRight > projectileLeft &&
            invaderTop < projectileBottom &&
            invaderBottom > projectileTop &&
            projectile.type === 'player'
        );

    }
}

// Creating a class for the enemy spaceship
class EnemySpaceship {
    // Initializing the enemy spaceship
    constructor({ x, y, difficulty }) {
        const image = new Image();
        image.src = 'Images/enemy.png';
        const scale = 0.025;
        this.image = image;
        this.width = 0;
        this.height = 0;
        this.position = {
            x: x,
            y: y
        };
        this.speed = 5;
        this.direction = 1;
        this.projectileInterval = currentLevel.projectileInterval;
         // Initializing the last projectile time
        this.lastProjectileTime = 0;

        // Adjusting projectile interval based on level difficulty
        if (difficulty === 'easy') {
            this.projectileInterval = currentLevel.projectileInterval;
        } else if (difficulty === 'hard') {
            this.projectileInterval = hardLevel.projectileInterval;
        }

        /* Handling image onload event to set width and 
        height after the image is loaded */
        image.onload = () => {
            this.width = image.width * scale;
            this.height = image.height * scale;
        };
    }

    // Making the enemy spaceshi[] shoot projectiles
    shootProjectile() {
        const projectile = new Projectile({
            position: {
                x: this.position.x + this.width / 2,
                y: this.position.y + this.height
            },
            velocity: {
                x: 0,
                y: 5
            }
        });
        projectile.type = 'enemy';
        projectiles.push(projectile); // Adding the projectile to the array
    }

    // Drawing the enemy spaceship on canvas
    draw() {
        c.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
    }

    // Updating the enemy spaceship's position and checking for collisions
    update() {
        this.draw();
        this.position.x += this.speed * this.direction;

        // Bouncing the enemy spaceship off the canvas walls
        if (this.position.x + this.width >= canvas.width) {
            this.direction = -1; // Changing direction to move left
        } else if (this.position.x <= 0) {
            this.direction = 1; // Changing direction to move right
        }

        /* Shooting a projectile if the time elapsed 
        since the last projectile is greater than the interval*/
        const currentTime = new Date().getTime();
        if (currentTime - this.lastProjectileTime >= currentLevel.projectileInterval) {
            this.shootProjectile();
            // Updating the last projectile time to the current time
            this.lastProjectileTime = currentTime;
        }

        // Checking for collisions with player projectiles
        playerProjectiles.forEach((projectile, playerIndex) => {
            if (this.isCollision(projectile)) {
                // Creating an explosion at the enemy spaceship's position
                const explosion = new Explosion(this.position);
                explosions.push(explosion);

                playerProjectiles.splice(playerIndex, 1);

                // Incrementing the shots on the target counter
                shotsOnTarget++;

                score += 20;

                updateScore();

                updateLocalScore();
            }
        });
    }

    // Method for checking for collision with a projectile
    isCollision(projectile) {
        // Defining the boundaries of the enemy spaceshop
        const spaceshipLeft = this.position.x;
        const spaceshipRight = this.position.x + this.width;
        const spaceshipTop = this.position.y;
        const spaceshipBottom = this.position.y + this.height;

        // Defining the boundaries for the projectiles
        const projectileLeft = projectile.position.x - projectile.radius;
        const projectileRight = projectile.position.x + projectile.radius;
        const projectileTop = projectile.position.y - projectile.radius;
        const projectileBottom = projectile.position.y + projectile.radius;

        // Collision detection for enemy spaceship and projectiles
        return (
            spaceshipLeft < projectileRight &&
            spaceshipRight > projectileLeft &&
            spaceshipTop < projectileBottom &&
            spaceshipBottom > projectileTop &&
            projectile.type === 'player'
        );
    }
}

// Creating a class for a bonus that multiplies the score
class MultiplierBonus {
    constructor(difficulty) {
        this.width = 32;
        this.height = 32; 
        this.image = new Image();
        this.image.src = 'Images/multiplier.png'; // Provide the path to your bonus image
        this.position = {
            x: Math.random() * (canvas.width - this.width),
            y: 0
        };
        this.speed = currentLevel.multiplierSpeed;

        // Adjusting the speed based on difficulty
        if (difficulty === 'easy') {
            this.speed = currentLevel.multiplierSpeed;
        } else if (difficulty === 'hard') {
            this.speed = hardLevel.multiplierSpeed;
        }
    }

    // Drawing the multiplier bonus on the canvas
    draw() {
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }

    update() {
        this.draw();
        // Updating the position based on speed
        this.position.y += this.speed;

        // Checking for collision with the player
        if (
            player.position.x < this.position.x + this.width &&
            player.position.x + player.width > this.position.x &&
            player.position.y < this.position.y + this.height &&
            player.position.y + player.height > this.position.y
        ) {
            // Checking for collision with player and applying score multiplier
            score *= 2;

            updateScore();

            updateLocalScore();

            bonuses.splice(bonuses.indexOf(this), 1);
        }

        // Checking if the bonus object is out of the canvas
        if (this.position.y > canvas.height) {
            // Removing the bonus object if it's out of the canvas
            bonuses.splice(bonuses.indexOf(this), 1);
        }
    }
}

// Spawning a score multiplier bonus every 10 seconds
setInterval(spawnMultiplierBonus, 10000); 

// Function to spawn a multiplier bonus
function spawnMultiplierBonus() {
    const multiplierBonus = new MultiplierBonus();
    bonuses.push(multiplierBonus);
}

// Creatin a class for ea class that adds an extra life
class ExtraLifeBonus {
    constructor(difficulty) {
        this.width = 50; 
        this.height = 50; 
        this.image = new Image();
        this.image.src = 'Images/live.png'; 
        // Setting the initial position of the bonus
        this.position = {
            x: Math.random() * (canvas.width - this.width),
            y: 0
        };
        this.speed = currentLevel.extraSpeed;

        // Adjusting speed based on difficulty
        if (difficulty === 'easy') {
            this.speed = currentLevel.extraSpeed;
        } else if (difficulty === 'hard') {
            this.speed = hardLevel.extraSpeed;
        }
    }

    // Drawing the extra life bonus on the canvas
    draw() {
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }

    // Updating the extra life bonus'position
    update() {
        this.draw();
        this.position.y += this.speed;

        // Checking for collision with the player
        if (
            player.position.x < this.position.x + this.width &&
            player.position.x + player.width > this.position.x &&
            player.position.y < this.position.y + this.height &&
            player.position.y + player.height > this.position.y
        ) {
            // Adding extra life if collision is detected
            lives++;
            updateHearts();

            bonuses.splice(bonuses.indexOf(this), 1);
        }

        // Checking if the bonus object is out of the canvas
        if (this.position.y > canvas.height) {
            // Removing the bonus object if it's out of the canvas
            bonuses.splice(bonuses.indexOf(this), 1);
        }
    }
}

// Spawning an extra life bonus every twent seconds
setInterval(spawnExtraLifeBonus, 25000); // Spawn an extra life bonus every 20 seconds

// Function to spawn an extra life bonus
function spawnExtraLifeBonus() {
    const extraLifeBonus = new ExtraLifeBonus();
    bonuses.push(extraLifeBonus);
}

// Creating class for a random bonus
class PowerUp {
    constructor(difficulty) {
        this.width = 34; 
        this.height = 34;
        this.image = new Image();
        this.image.src = 'Images/random.png';
        // Setting the initial position of the bonus
        this.position = {
            x: Math.random() * (canvas.width - this.width),
            y: 0
        };
        this.speed = currentLevel.powerSpeed;

        // Adjusting speed based on difficulty
        if (difficulty === 'easy') {
            this.speed = currentLevel.powerSpeed;
        } else if (difficulty === 'hard') {
            this.speed = hardLevel.powerSpeed;
        }
        
    }

    // Drawing the bonus on the canvas
    draw() {
        c.drawImage(this.image,
             this.position.x, 
             this.position.y, 
             this.width, 
             this.height);
    }

    // Updating the bonus'position 
    update() {
        this.draw();
        this.position.y += this.speed;

        // Checking for collision with the player
        if (
            player.position.x < this.position.x + this.width &&
            player.position.x + player.width > this.position.x &&
            player.position.y < this.position.y + this.height &&
            player.position.y + player.height > this.position.y
        ) {
            /* Randomly deciding whether to add an extra life or 
            multiply the score if collison is detected */
            const randomEffect = Math.random();
            if (randomEffect < 0.5) {
                // 50% chance to add an extra life
                lives++;
                updateHearts();
            } else {
                // 50% chance to multiply the score
                score *= 2;
                updateScore();
                updateLocalScore()
            }

            powerUps.splice(powerUps.indexOf(this), 1);
        }

        // Checking if the box object is out of the canvas
        if (this.position.y > canvas.height) {
            // Removing the box object if it's out of the canvas
            powerUps.splice(powerUps.indexOf(this), 1);
        }
    }
}

// Spawning a bonus every 30 seconds
setInterval(spawnPowerUp, 30000); 

// Function to apply the effects of a bonus
function spawnPowerUp() {
    const types = ['multiplier', 'extraLife'];
    // Generating a random index to select random bonus
    const randomType = types[Math.floor(Math.random() * types.length)];
    // Creating an instance of the new PowerUp class
    const powerUp = new PowerUp(randomType);
    powerUps.push(powerUp);
}

function applyPowerUpEffect(type) {
    if (type === 'multiplier') {
        // Applying multiplier bonus effect
        score *= 2;
        updateScore();
        updateLocalScore();
    } else if (type === 'extraLife') {
        // Applying extra life bonus effect
        lives++;
        updateHearts();
    }
}

// Creating a class for managing the grid of invaders
class Grid {
    constructor() {
        this.invaders = [];
        this.invaderInterval = 500; 
        this.lastInvaderTime = 0;
        this.rowHeight = 50;
        // Current row in the grid
        this.currentRow = 0;
    }

    update() {
        // Getting current time
        const currentTime = new Date().getTime();

        // Handling collisions between player projectiles and invaders
        playerProjectiles.forEach((projectile, playerIndex) => {
            this.invaders.forEach((invader, invaderIndex) => {
                if (invader.isCollision(projectile)) {
                    // Creating an explosion at the invader's position
                    const explosion = new Explosion(invader.position);
                    explosions.push(explosion);
    
                    // Removing the projectile and invader
                    playerProjectiles.splice(playerIndex, 1);
                    this.invaders.splice(invaderIndex, 1);
    
                    // Incrementing shots on target
                    shotsOnTarget++;
                    score += 10;
                    updateScore();
                    updateLocalScore();
                }
            });
        });
    
        // Spawning new invaders based on the interval
        if (currentTime - this.lastInvaderTime >= this.invaderInterval) {
            const invader = new Invader({
                x: 0,
                y: this.currentRow * this.rowHeight
            });
            this.invaders.push(invader);
            this.lastInvaderTime = currentTime;
        }
    
        // Updating existing invaders
        this.invaders.forEach((invader) => {
            invader.update();
    
            // Checking if invader reaches the right side
            if (invader.position.x + invader.width >= canvas.width && invader.speed > 0) {
                // Changing direction and moving down
                invader.moveDown(); 
            }
    
            // Checking if invader reaches the left side
            if (invader.position.x <= 0 && invader.speed < 0) {
                invader.moveDown(); 
            }
        });
    }
}    

// Updating the local high score
function updateLocalScore(){
    let newScore = score;
    // Checking if a user is logged in
    if(sessionStorage.loggedInUser !== undefined){
        let usr = JSON.parse(localStorage[sessionStorage.loggedInUser]);
        // Updating the local high score if new score is higher
        if(usr.highScore < newScore){
            usr.highScore = newScore;
            localStorage[usr.username] = JSON.stringify(usr);
        }

    }
}

// Updating the displayed score on the page
function updateScore() {
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
        scoreElement.innerText = `Score: ${score}`;
    }
}

// Creating instances and setting up the initial game state
const player = new Player();
const enemySpaceship = new EnemySpaceship({
    x: 0,
    y: 0
});
const projectiles = [];
const maxProjectiles = 2;
const grid = new Grid();
// Tracking the state of different keys
const keys = {
    ArrowLeft: { pressed: false },
    ArrowRight: { pressed: false },
    space: { pressed: false }
};
const maxPlayerProjectiles = 2;
const playerProjectiles = [];
const explosions = [];
const bonuses = [];
const powerUps = [];

// Animation loop to continuously update and draw game state
function animate() {
    // Checking if the game is paused
    if (paused) {
        requestAnimationFrame(animate);
        return;
    }

    // Checking if game is not currently playing
    if (!isPlaying) {
        requestAnimationFrame(animate);
        return;
    }

    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);

    // Updating and drawing the player projectiles
    playerProjectiles.forEach((projectile, index) => {
        // Checking is the projectile is above the canvas
        if (projectile.position.y + projectile.radius <= 0) {
            setTimeout(() => {
                playerProjectiles.splice(index, 1);
            }, 0);
        } else {
            projectile.update();
        }
    });

    // Updating and drawing enemy projectiles
    projectiles.forEach((projectile, index) => {
        if (projectile.position.y + projectile.radius <= 0) {
            setTimeout(() => {
                projectiles.splice(index, 1);
            }, 0);
        } else {
            projectile.update();
        }
    });

    grid.update();

    // Updating and drawing explosions
    explosions.forEach((explosion, index) => {
        explosion.update();
        // Checking is the ecplosion has no particles left
        if (explosion.particles.length === 0) {
            // Removing the explosion from the array
            explosions.splice(index, 1);

        }
    });

    player.update();

    enemySpaceship.update();

    bonuses.forEach((bonus, index) => {
        bonus.update();
    });

    powerUps.forEach((powerUp, index) => {
        powerUp.update();
    });

    /*  Check if the space key is pressed and the 
    maximum number of player projectiles is not reached */
    if (keys.space.pressed && playerProjectiles.length < maxPlayerProjectiles) {
        // Creating a new player projectile and adding it to the array
        const playerProjectile = new PlayerProjectile({
            position: {
                x: player.position.x + player.width / 2,
                y: player.position.y
            },
            velocity: {
                x: 0,
                y: -10
            }
        });

        playerProjectiles.push(playerProjectile);
    }

    // Checking if the left arrow key is pressed and the player is within the canvas boundaries
    if (keys.ArrowLeft.pressed && player.position.x >= 0) {
        player.velocity.x = -11;
    } else if (keys.ArrowRight.pressed && player.position.x + player.width <= canvas.width) {
        player.velocity.x = 11;
    } else {
        // Setting the player's horizontal velocity to zero if no arrow keys are pressed
        player.velocity.x = 0;
    }

    // Requesting the next animation frame
    requestAnimationFrame(animate);
}

// Starting the animation loop
animate();

// Event listener for key down events
addEventListener('keydown', ({ key }) => {
    switch (event.key) {
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true;
            break;
        case 'ArrowRight':
            keys.ArrowRight.pressed = true;
            break;
        case ' ':
    	// Preventing the default behavior of the space key
        event.preventDefault();
        if (playerProjectiles.length < maxPlayerProjectiles) {                // Creating a new player projectile and add it to the array
            const playerProjectile = new PlayerProjectile({
                position: {
                    x: player.position.x + player.width / 2,
                    y: player.position.y
                },
                velocity: {
                    x: 0,
                    y: -10
                }
            });
            playerProjectiles.push(playerProjectile);

            // Increamnt shots fired
            shotsFired++
        }
        break;
    }
});

// Event listeners for keyup events
addEventListener('keyup', ({ key }) => {
    switch (key) {
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;
        case ' ':
            break;
    }
});

