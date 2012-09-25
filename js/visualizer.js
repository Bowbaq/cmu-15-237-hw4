function Ball(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = Math.random() * 20 + 20;
    
    this.vx = Math.sin(Math.random() * 2 * Math.PI) * 200;
    this.vy = Math.random() * 200 + 600;
    
    //Random colors
	var r = Math.random() * 255 >> 0;
	var g = Math.random() * 255 >> 0;
	var b = Math.random() * 255 >> 0;
	this.color = "rgba(" + r + ", " + g + ", " + b + ", 0.5)";
}

Ball.prototype = {
    constructor: Ball,
    update: function(delta) {
        this.x += (this.vx * delta);
        this.y -= (this.vy * delta);
    },
    draw: function(ctx) {		
		//Time for some colors
		var gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
		gradient.addColorStop(0, "white");
		gradient.addColorStop(0.4, "white");
		gradient.addColorStop(0.4, this.color);
		gradient.addColorStop(1, "black");
		
		ctx.beginPath();
		ctx.fillStyle = gradient;
		ctx.arc(this.x, this.y, this.r, Math.PI * 2, false);
		ctx.fill();
    }
};

function Visualizer (canvasId) {
     this.canvas = document.getElementById(canvasId);
     this.ctx    = this.canvas.getContext('2d');
     this.width  = this.canvas.width;
     this.height = this.canvas.height;
     
     this.balls = [];
     
     this.last_time = 200;
}

Visualizer.prototype = {
    constructor: Visualizer,
    draw: function() {
        // Draw background
        this.ctx.globalCompositeOperation = "source-over";
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    	this.ctx.fillRect(0, 0, this.width, this.height);
        
        this.balls = this.balls.filter(function(b) {
            return b.x - b.r > 0 && b.x + b.r < this.width && b.y + b.r > 0 && b.y - b.r < this.height;
        }.bind(this));
        
        var now = Date.now();
        var delta = (now - this.last_time) / 1000;
        this.last_time = now;
        this.balls.forEach(function(b) {
           b.update(delta);
           b.draw(this.ctx); 
        }.bind(this));
    },
    start: function() {
        $this = this;
        this.loop_id = setInterval(function() { $this.draw(); }, 1);
    },
    stop: function() {
        clearInterval(this.loop_id);
    },
    fire: function() {
        for (var i = Math.random() * 10; i > 0; i--){
            this.balls.push(new Ball(this.width / 2, this.height - 30, 10));
        };
    }
};

/*
//Lets create a simple particle system in HTML5 canvas and JS

//Initializing the canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

//Canvas dimensions
var W = 500; var H = 500;

//Lets create an array of particles
var particles = [];
for(var i = 0; i < 50; i++)
{
	//This will add 50 particles to the array with random positions
	particles.push(new create_particle());
}

//Lets create a function which will help us to create multiple particles
function create_particle()
{
	//Random position on the canvas
	this.x = Math.random()*W;
	this.y = Math.random()*H;
	
	//Lets add random velocity to each particle
	this.vx = Math.random()*20-10;
	this.vy = Math.random()*20-10;
	
	//Random colors
	var r = Math.random()*255>>0;
	var g = Math.random()*255>>0;
	var b = Math.random()*255>>0;
	this.color = "rgba("+r+", "+g+", "+b+", 0.5)";
	
	//Random size
	this.radius = Math.random()*20+20;
}

var x = 100; var y = 100;

//Lets animate the particle
function draw()
{
	//Moving this BG paint code insde draw() will help remove the trail
	//of the particle
	//Lets paint the canvas black
	//But the BG paint shouldn't blend with the previous frame
	ctx.globalCompositeOperation = "source-over";
	//Lets reduce the opacity of the BG paint to give the final touch
	ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
	ctx.fillRect(0, 0, W, H);
	
	//Lets blend the particle with the BG
	ctx.globalCompositeOperation = "lighter";
	
	//Lets draw particles from the array now
	for(var t = 0; t < particles.length; t++)
	{
		var p = particles[t];
		
		ctx.beginPath();
		
		//Time for some colors
		var gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
		gradient.addColorStop(0, "white");
		gradient.addColorStop(0.4, "white");
		gradient.addColorStop(0.4, p.color);
		gradient.addColorStop(1, "black");
		
		ctx.fillStyle = gradient;
		ctx.arc(p.x, p.y, p.radius, Math.PI*2, false);
		ctx.fill();
		
		//Lets use the velocity now
		p.x += p.vx;
		p.y += p.vy;
		
		//To prevent the balls from moving out of the canvas
		if(p.x < -50) p.x = W+50;
		if(p.y < -50) p.y = H+50;
		if(p.x > W+50) p.x = -50;
		if(p.y > H+50) p.y = -50;
	}
}

setInterval(draw, 1);
//I hope that you enjoyed the tutorial :)
*/