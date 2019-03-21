//canvas initialize
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//balls on screen
var balls = [];

var NUMBALLS = 600;
var MAXRADIUS = 15;
var SPACE_BAR = 32;
var colorsOn = true;

//location of mouse
var mouse = {
    x: undefined,
    y: undefined
}

window.addEventListener('mousemove',
    function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
    })

window.addEventListener('keydown',
    function(event) {
        if(event.keyCode == SPACE_BAR){
            if(colorsOn){
                colorsOn = false;
            }
            else{
                colorsOn = true;
            }
        }
    })

//onload function
function start(){

    for(var i = 0; i < NUMBALLS; i++){
        balls.push(new Ball());
    }

    setInterval(update,10);

}

var Ball = function(){

    //this.r = Math.floor(Math.random() * 5) + 5;
    this.r = 0;
    this.minRadius = this.r;
    this.x = Math.floor(Math.random() * (canvas.width - (2*this.r)) ) + this.r;
    this.y = Math.floor(Math.random() * (canvas.height - (2*this.r)) ) + this.r;
    this.xvel = (Math.random() + .5) * Math.pow(-1, Math.floor(Math.random() * 2));
    this.yvel = (Math.random() + .5) * Math.pow(-1, Math.floor(Math.random() * 2));
    this.color = '#' + Math.floor((Math.random() * 0xFFFFFF)).toString(16);

    this.opacity = 1;

    //updates next location to draw ball
    this.move = function(){
        this.checkWallCollide();
        this.x += this.xvel;
        this.y += this.yvel;
    }

    //draws a ball
    this.draw = function(){

        //ctx.fillStyle = this.color;
        ctx.save();
        ctx.globalAlpha = this.opacity;

        if(colorsOn){
            ctx.strokeStyle = this.color;
        }
        else{
            ctx.strokeStyle = "white";
        }
        
        ctx.beginPath();
        ctx.lineWidth = 3;
        
        ctx.arc(this.x,this.y,this.r,0,2 * Math.PI);
        //ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }

    //check if 'this' ball is hitting a wall
    this.checkWallCollide = function(){
        if((this.x - this.r) <= 0 || (this.x + this.r) >= canvas.width){
            this.xvel *= -1;
        }
        if((this.y - this.r) <= 0 || (this.y + this.r) >= canvas.height){
            this.yvel *= -1;
        }
    }

    //checks if 'this' ball is close enough to the mouse to be interacted with
    this.checkMouse = function(){

        //distance between mouse and ball
        var dist = Math.floor(Math.sqrt(Math.pow(mouse.x - this.x, 2) + Math.pow(mouse.y - this.y, 2)));

        if(dist < 50){

            if(this.opacity < .9){
                this.opacity += .1;
            }
            else{
                this.opacity = 1;
            }

            if(this.r < MAXRADIUS){
                this.r += 2;
            }
        }
        else if(this.r > this.minRadius){
            //this.r -= .25;
            if(this.opacity > .1){
                this.opacity -= .015;
            }
            else{
                this.opacity = 0;
            }
        }
    }
}

//looping function to draw balls
function update(){
    //clears the canvas before the next draw
    ctx.clearRect(0,0,canvas.width,canvas.height);

    //create gradient background
    var gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#0F2033");
    gradient.addColorStop(.5, "#1A3757");
    gradient.addColorStop(1, "#0F2033");

    ctx.fillStyle = gradient;
    ctx.fillRect(0,0,canvas.width,canvas.height);

    //update location of each ball and draw it
    for(var i = 0; i < balls.length; i++){
        balls[i].checkMouse();
        balls[i].move();
        balls[i].draw();
    }
    

}


