const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.height = innerHeight;
canvas.width = innerWidth;

const floor = canvas.height - 200;

document.addEventListener("resize", () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
});

ctx.fillStyle = "#607D8B";
const gravity = 0.5;
let NUM_OBJECTS = 0;
const objects = [];
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


        // collision points
        this.collisionDots = {
            goreLevo: {
                x: this.x,
                y: this.y
            },
            goreDesno: {
                x: this.x + this.width,
                y: this.y
            },
            doleLevo: {
                x: this.x,
                y: this.y + this.height
            },
            doleDesno: {
                x: this.x + this. width,
                y: this.y + this.height
            }
        };

        // gravity
        this.g = gravity

        this.onGround = false;

        // Object skinn, WIP
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


        // num of objects being inspected
        NUM_OBJECTS++;
        objects.push(this);
        this.posObj = objects.length - 1;
        
        // function binding
        this.update = this.update.bind(this);
        this.collisionDetection = this.collisionDetection.bind(this);

        requestAnimationFrame(this.update);
    }

    update() {
        // Brisem njegovu trenutnu poziciju
        ctx.clearRect(this.x - 1, this.y - 1, this.width + 1, this.height + 1);

        // Proveravam da li ce uskoro pasti na pod
        if (this.y + this.height + this.dy >= floor) {
            // Ako da, stavljam ga na pod i to pamtim
            this.y += floor - this.y - this.height;

            this.onGround = true;
            this.jumps = 0;
            this.dy = 0;
        }
        else {
            // Ako ne, sve standardno
            this.onGround = false;
            this.y += this.dy;
        }

        // Ako nije na podu gravitaciono ubrzanje se dodaje
        if (!this.onGround) {
            this.dy += this.g;
        }


        // Dodajem x komponentu brzine
        this.x += this.dx;

        // Ucrtavam ga nakon sto sam updateovo koordinate
        if (this.hasSkin) {
            // Ako ima skin
            ctx.drawImage(this.skinDrawn, this.x, this.y, this.width, this.height);
        }
        else {
            // Ako je obican blok
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }

        this.collisionDots = {
            goreLevo: {
                x: this.x,
                y: this.y
            },
            goreDesno: {
                x: this.x + this.width,
                y: this.y
            },
            doleLevo: {
                x: this.x,
                y: this.y + this.height
            },
            doleDesno: {
                x: this.x + this. width,
                y: this.y + this.height
            }
        };
        objects[this.posObj] = this;
        // console.log(objects[this.posObj]);
        this.collisionDetection();

        // Trazim update za sledeci pocetak frame-a
        requestAnimationFrame(this.update);
    }
    collisionDetection() {
        const collTop = false;
        const collBot = false;
        const collLeft = false;
        const collRight = false;

        for(let i = 0;i < NUM_OBJECTS;i++) {
            // uvek se sece sam sa sobom brt :)
            if(i === this.posObj) continue;
            // right-left collision
            if(objects[this.posObj].collisionDots.goreDesno.x >= objects[i].collisionDots.goreLevo.x
               && objects[this.posObj].collisionDots.goreDesno.x < objects[i].collisionDots.goreDesno.x
               && objects[this.posObj].collisionDots.goreDesno.y < objects[i].collisionDots.goreDesno.y
               && objects[this.posObj].collisionDots.goreDesno.y > objects[i].collisionDots.goreDesno.y) collRight = true;
            // bottom-top collision
            else if(objects[this.posObj].collisionDots.doleDesno.y >= objects[i].collisionDots.goreDesno.y 
                    && objects[this.posObj].collisionDots.doleDesno.y < objects[i].collisionDots.doleDesno.y
                    && objects[this.posObj].collisionDots.doleDesno.x > objects[i].collisionDots.doleLevo.x
                    && objects[this.posObj].collisionDots.doleDesno.x <= objects[i].collisionDots.doleDesno.x)  collBot = true;
            // left-right collision
            else if(objects[this.posObj].collisionDots.goreLevo.x <= objects[i].collisionDots.goreDesno.x 
                    && objects[this.posObj].collisionDots.goreLevo.x > objects[i].collisionDots.goreLevo.x
                    && objects[this.posObj].collisionDots.goreLevo.y < objects[i].collisionDots.goreLevo.y
                    && objects[this.posObj].collisionDots.goreLevo.y > objects[i].collisionDots.goreLevo.y) collLeft = true;
            // top-bottom collsion
            else if(objects[this.posObj].collisionDots.goreLevo.y <= objects[i].collisionDots.doleLevo.y 
                    && objects[this.posObj].collisionDots.goreLevo.y > objects[i].collisionDots.goreLevo.y 
                    && objects[this.posObj].collisionDots.doleLevo.x >= objects[i].collisionDots.doleLevo.x
                    && objects[this.posObj].collisionDots.doleLevo.x <= objects[i].collisionDots.doleDesno.x) collTop = true;
        }
    }
}
class PC extends Object {
    constructor(x, y, width, height, dx, dy, skinLeft, skinRight) {
        // Prenosim mu sve metode i vrednosti iz Object klase
        super(x, y, width, height, dx, dy, skinLeft, skinRight);

        // Pratim koliko puta je PC skocio
        this.jumps = 0;

        // Function binding
        this.move = this.move.bind(this);
        this.stopMove = this.stopMove.bind(this);
        this.addEventListeners = this.addEventListeners.bind(this);
        this.pressed = [];
        // Dodaje event listenere za keypress
        this.addEventListeners();
    }

    addEventListeners() {
        // Kad pritisne key
        document.addEventListener("keydown", event => {
            let key = event.key.toLowerCase();

            // Necu opet runovati ako je jos uvek pritisnut key
            if (this.pressed[key] === true) {
                return;
            }

            this.pressed[key] = true;

            this.move(event);
        });
        // Kad pusti key
        document.addEventListener("keyup", event => {
            let key = event.key.toLowerCase();

            this.pressed[key] = false;
            
            this.stopMove(event);
        });
    }
    
    move(event) {
        // Ovo radim kad se lik pomera
        event.preventDefault();
        const key = event.key.toLowerCase();

        if (key === ' ') {
            // JUMP
            // console.log("Jumped.");
            if (this.jumps > 0)
                return;
            this.jumps += 1;
            this.dy = -10;
        }
        else if (key === 'a') {
            // LEFT
            this.skinDrawn = this.skinLeft;
            this.dx = -3;
        }
        else if (key === 'd') {
            // RIGHT
            this.skinDrawn = this.skinRight;
            this.dx = 3;
        }
        else if (key === 's') {
            // CROUCH, SLIDE
        }
    }

    stopMove(event) {
        // Kad pusti key
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
const collObj = new Object(500, 500, 100, 150);
const pom = new PC(50, 50, 50, 50, 0, 0, './assets/dudu_duks_left.png', './assets/dudu_duks_right.png');
