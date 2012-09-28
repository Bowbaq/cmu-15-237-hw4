function Ball(x, y, r, speed, fr, fg, fb) {
    this.x = x;
    this.y = y;
    this.r = r;
    
    this.vx = Math.sin(Math.random() * 2 * Math.PI) * 400;
    this.vy = speed - 10 * this.r;
    
    //Random colors
	var r = fr * 255 >> 0;
	var g = fg * 255 >> 0;
	var b = fb * 255 >> 0;
	
	this.gradient = [
	    [0, "white"], 
	    [0.4, "rgba(255, 255, 255, 0.5)"], 
	    [0.4, "rgba(" + r + ", " + g + ", " + b + ", 0.5)"],
	    [1, "rgba(0, 0, 0, 0.3)"]
	];
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
		this.gradient.forEach(function(g) {
		    gradient.addColorStop(g[0], g[1]);
		});
		
		ctx.beginPath();
		ctx.fillStyle = gradient;
		ctx.arc(this.x, this.y, this.r, Math.PI * 2, false);
		ctx.fill();
    }
};

function Visualizer (canvasId) {
     this.canvas = document.getElementById(canvasId);
     this.ctx    = this.canvas.getContext('2d');
     
     this.balls = [];
     
     this.last_time = 200;
}

Visualizer.prototype = {
    constructor: Visualizer,
    maximize: function() {
        this.canvas.width = $(window).innerWidth();
        this.canvas.height = $(window).innerHeight();
    },
    draw: function() {
        // Draw background
        this.ctx.globalCompositeOperation = "source-over";
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    	this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.balls = this.balls.filter(function(b) {
            return b.x - b.r > 0 && b.x + b.r < this.canvas.width && b.y + b.r > 0 && b.y - b.r < this.canvas.height;
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
        console.log('fire');
        var r = Math.random(),
            g = Math.random(),
            b = Math.random(),
            speed = Math.random() * 200 + 600;
        for (var i = Math.random() * 10 + 10; i > 0; i--){
            this.balls.push(new Ball(
                this.canvas.width / 2, 
                this.canvas.height - 30, 
                Math.random() * 20 + 20,
                speed,
                r, g, b
            ));
        };
    }
};