const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.height = innerHeight;
canvas.width = innerWidth;

document.addEventListener("resize", () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
});

ctx.fillStyle = "#607D8B";

const gravity = 0.5;

class Object {
    constructor (x, y, width, height, dx = 0, dy = 0, skinLeft = "", skinRight = "") {
        // coordinates
        this.x = x;
        this.y = y;

        // dimensions
        this.width = width;
        this.height = height;
        
        // velocity
        this.dx = dx;
        this.dy = dy;
        
        // gravity
        this.g = gravity

        this.onGround = false;

        this.skinLeft = new Image();
        this.skinRight = new Image();
        this.skinDrawn = new Image();
        
        this.skinDrawn.src = skinRight;
        this.skinLeft.src = skinLeft;
        this.skinRight.src = skinRight;

        this.hasSkin = true;

        if (skinLeft === "") 
            this.hasSkin = false;
        // acceleration WIP
        // this.ax;
        // this.ay;
        
        // function binding
        this.update = this.update.bind(this);
        this.draw = this.draw.bind(this);

        requestAnimationFrame(this.update);
    }

    update () {
        if(this.y + this.height >= canvas.height - 200) {
            this.onGround = true;
            this.jumps = 0;
            if(this.dy > 0) {
                this.dy = 0;
            }
        }
        else {
            this.onGround = false;
        }
        if(!this.onGround) {
            this.dy += this.g;
        }
        // ctx.clearRect(this.x, this.y, this.width, this.height);
        // this.x += this.dx;
        // this.y += this.dy;
        this.draw();
        requestAnimationFrame(this.update);
    }

    draw () {
        let isNegativeX = 1;
        let isNegativeY = 1;

        const offsetX = 2 * Math.abs(this.dx);
        const offsetY = 2 * Math.abs(this.dy);

        if (this.dx < 0)
            isNegativeX = -1;
        if (this.dy < 0)
            isNegativeY = -1;
        if (this.dx !== 0 || this.dy !== 0) {
            for (let X = 1, Y = 1; X <= Math.abs(this.dx) || Y <= Math.abs(this.dy); X++ , Y++) {
                if (X < Math.abs(this.dx)) {
                    this.x += 1 * isNegativeX;
                }
                if (Y < Math.abs(this.dy)) {
                    this.y += 1 * isNegativeY;
                }
                if (this.y + this.height > canvas.height - 200) {
                    this.dy = 0;
                }
                ctx.clearRect(this.x - 1, this.y - 1, this.width + 1, this.height + 1);

                if (this.hasSkin === false)
                    ctx.fillRect(this.x, this.y, this.width, this.height);
                else
                    ctx.drawImage(this.skinDrawn, this.x, this.y, this.width, this.height);
            }
        }
        else {
            if (this.hasSkin === true) {
                ctx.drawImage(this.skinDrawn, this.x, this.y, this.width, this.height);
            }
            else {
                ctx.fillRect(this.x, this.y, this.width, this.height);
            }
        }
        // this.applyMovement();
    }
}

// const pom = new Object(50, 500, 50, 50, 10, -20);
// const pom = new Object(50, 50, 50, 50, 0, 0);
class PC extends Object {
    constructor (x, y, width, height, dx, dy, skinLeft, skinRight) {
        super(x, y, width, height, dx, dy, skinLeft, skinRight);

        this.jumps = 0;
        this.pressed = {};

        this.move = this.move.bind(this);
        this.stopMove = this.stopMove.bind(this);
        this.addEventListeners = this.addEventListeners.bind(this);

        this.addEventListeners();
    }

    addEventListeners () {
        document.addEventListener("keydown", event => {
            let key = event.key.toLowerCase();
            // console.log(key);
            if (this.pressed[key] === true) {
                return;
            }
            this.pressed[key] = true;
            this.move(event);
        });
        document.addEventListener("keyup", event => {
            let key = event.key.toLowerCase();
            this.pressed[key] = false;
            this.stopMove(event);
        });
    }

    move (event) {
        event.preventDefault();
        const key = event.key.toLowerCase();
        
        if(key === ' ') {
            // JUMP
            // console.log("Jumped.");
            if(this.jumps > 0)
                return;
            this.jumps += 1;
            this.dy = -10;
        }
        else if(key === 'a') {
            // LEFT
            this.skinDrawn = this.skinLeft;
            this.dx = -5;
        }
        else if(key === 'd') {
            // RIGHT
            this.skinDrawn = this.skinRight;
            this.dx = 5;
        }
        else if(key === 's') {
            // CROUCH, SLIDE
        }
    }

    stopMove (event) {
        event.preventDefault();
        const key = event.key.toLowerCase();

        // if (key === 'w') {
        //     // JUMP
        //     console.log("Jumped.");
        //     this.dy = -10;
        // }
        if (key === 'a') {
            // LEFT
            this.dx = 0;
        }
        else if (key === 'd') {
            // RIGHT
            this.dx = 0;
        }
        else if (key === 's') {
            // CROUCH
        }
    }
}

const pom = new PC(50, 50, 50, 50, 0, 0, './assets/dudu_duks_left.png', './assets/dudu_duks_right.png');
const pom2 = new Object(100, 100, 50, 50);