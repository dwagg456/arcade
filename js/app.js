// Static Variables for game board dimensions and pixel sizes
var GRID_WIDTH = 7,
    GRID_HEIGHT = 7,
    GRID_BOTTOM_SIZE = 119,
    SQUARE_WIDTH_SIZE = 101,
    SQUARE_HEIGHT_SIZE = 83;

/**
 * @namespace Enemy                 - Enemy our player must avoid.
 * @property {number} speed         - The default speed for the enemy.
 * @property {number} x             - The default x position for the enemy.
 * @property {number} y             - The default y position for the enemy.
 * @property {string} direction     - The default moving direction for the enemy.
 * @property {string} sprite        - The default image location for the enemy.
 */
var Enemy = function() {
    //randomly generate speed and starting location for each enemy created
    this.speed = (Math.floor(Math.random()*5)+1)*100;
    var x_square = Math.floor(Math.random()*10);
    var y_square = Math.floor((Math.random()*5) + 1);
    this.y =  y_square * SQUARE_HEIGHT_SIZE - (SQUARE_HEIGHT_SIZE/2);

    //determine direction and image for bug based on starting location
    if (y_square%2 === 0){
        this.x = x_square*(-100)-SQUARE_WIDTH_SIZE;
        this.direction = 'right';
        this.sprite = 'images/enemy-bug.png';
    } else {
        this.x = x_square*100+(GRID_WIDTH*SQUARE_WIDTH_SIZE);
        this.direction = 'left';
        this.sprite = 'images/enemy-bug-left.png';
    }
}

/**
 * Update the enemy's position, required method for game
 * @memberof Enemy
 * @param {number} dt       - A time delta between ticks
 */
Enemy.prototype.update = function(dt) {
    if (this.direction === 'right'){
        this.x = this.x+(dt*this.speed);
        if(this.x > GRID_WIDTH * SQUARE_WIDTH_SIZE)
            this.x = Math.floor(Math.random()*10)*(-100)-SQUARE_WIDTH_SIZE;
    } else {
        this.x = this.x-(dt*this.speed);
        if(this.x < 0-100)
            this.x = Math.floor(Math.random()*10)*100+(GRID_WIDTH*SQUARE_WIDTH_SIZE);
    }
}

/**
 * Draw the enemy on the screen, required method for game
 * @memberof Enemy
 */
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

/**
 * @namespace Player            - The player character.
 * @property {string} sprite    - The default image location for the player.
 * @property {number} numLives  - The remaining number of lives for the player.
 * @property {number} score     - The score for the player.
 * @property {number} POS_X     - The default x square position for the player.
 * @property {number} POS_Y     - The default y square position for the player.
 * @property {number} x         - The default x position for the player.
 * @property {number} y         - The default y position for the player.
 */
var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.numLives = 3;
    this.score = 0;
    this.setInitialPosition();
}

/**
 * Set the player to the default screen position
 * @memberof Player
 */
Player.prototype.setInitialPosition = function() {
    this.POS_X = Math.floor(GRID_WIDTH/2);
    this.POS_Y = GRID_HEIGHT-1;

    this.x = Math.floor(GRID_WIDTH/2)*SQUARE_WIDTH_SIZE;
    this.y = GRID_HEIGHT*SQUARE_HEIGHT_SIZE-GRID_BOTTOM_SIZE;
}

/**
 * Update the player position and increase score
 * @memberof Player
 */
Player.prototype.update = function() {
    if (this.POS_Y === 0){
        this.score += 100;
        this.setInitialPosition();
    }
}

/**
 * Draw the player on the screen with the player's score and lives
 * @memberof Player
 */
Player.prototype.render = function() {
    //render player
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

    //render score
    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(this.score, GRID_WIDTH*SQUARE_WIDTH_SIZE-ctx.measureText(this.score).width-10, GRID_HEIGHT*SQUARE_HEIGHT_SIZE+GRID_BOTTOM_SIZE/2-20);


    //render lives
    var left_x = 0;
    for (var i=0; i<this.numLives; i++){
        ctx.drawImage(Resources.get('images/Heart.png'), left_x, GRID_HEIGHT*SQUARE_HEIGHT_SIZE-10, 50, 75);
        left_x += 60;
    }  
}

/**
 * Handle keyboard input for player movement
 * @memberof Player
 */
Player.prototype.handleInput = function(keyCode) {
    switch (keyCode){
        case 'left':
                if (this.POS_X - 1 >= 0){
                    this.POS_X = this.POS_X - 1;
                    this.x = this.x - SQUARE_WIDTH_SIZE;
                }
                break;
        case 'up':
                if (this.POS_Y - 1 >= 0){
                    this.POS_Y = this.POS_Y - 1;
                    this.y = this.y - SQUARE_HEIGHT_SIZE;    
                }
                break;
        case 'right':
                if (this.POS_X + 1 < GRID_WIDTH){
                    this.POS_X = this.POS_X + 1;
                    this.x = this.x + SQUARE_WIDTH_SIZE;
                }
                break;
        case 'down':
                if (this.POS_Y + 1 < GRID_HEIGHT){
                    this.POS_Y = this.POS_Y + 1;
                    this.y = this.y + SQUARE_HEIGHT_SIZE;
                }
                break;
        default:
                break;
    }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = new Array();

for (var i=0; i< 15; i++){
    var enemy = new Enemy();
    allEnemies.push(enemy);
}

var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
