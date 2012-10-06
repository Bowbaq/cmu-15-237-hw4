function Ball(x, y, r, speed, fr, fg, fb) {
    var theta = Math.random() * 2 * Math.PI;
    if(r > 50) {
        r = 50;
    }
    
    this.x = x;
    this.y = y;
    this.r = r;
    
    this.vx = (speed - 6 * this.r) * Math.sin(theta);
    this.vy = (speed - 6 * this.r) * Math.cos(theta);
    
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

var Visualizer = (function(viz) {
    var canvas, 
        ctx,
        freqByteData,
        timeByteData,
        animate = false,
        analyser,
        beatDetect = [],
        balls = [],
        last_time = Date.now(),
        size_factor = 0
    ;
    
    function update() {
        analyser.smoothingTimeConstant = 0.1;
		analyser.getByteFrequencyData(freqByteData);
		analyser.getByteTimeDomainData(timeByteData);
    }
    
    function render() {
        var fqavg = 0, pastavg = 0,
            max = Math.max.apply(null, timeByteData), min = Math.min.apply(null, timeByteData)
        ;
        
        size_factor = (max - min) / max;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "red";
        for (var i = 0; i < timeByteData.length; i++) {
           ctx.fillRect(450 + i, 200 - timeByteData[i] / 2, 1, timeByteData[i]);
        }
        
        ctx.fillStyle = "orange";
        for (var i = 0; i < freqByteData.length; i++) {
            fqavg += freqByteData[i];
            ctx.fillRect(450 + i, 700 - freqByteData[i], 1, freqByteData[i]);
        }
        
        fqavg /= freqByteData.length;
        beatDetect.push(fqavg);
        if(beatDetect.length > 10) {
            beatDetect.shift();
        }
        
        for (var i = 0; i  < beatDetect.length - 1; i++) {
            pastavg += beatDetect[i];
        };
        pastavg /= beatDetect.length - 1;
        
        if (pastavg - fqavg > 10) {
            fire();
        };
        
        ctx.fillStyle = "blue";
        ctx.fillRect(450, 700 - fqavg, freqByteData.length, 2);
        
        draw();
    }
    
    function doAnimate() {
        if(animate) {
            requestAnimationFrame(doAnimate);
            render();
            update();
        }
    }
    
    function draw() {
        var now = Date.now();
        var delta = (now - last_time) / 1000;
        
        // Draw background
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    	ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        balls = balls.filter(function(b) {
            return b.x - b.r > 0 && b.x + b.r < canvas.width && b.y + b.r > 0 && b.y - b.r < canvas.height;
        });
        
        last_time = now;
        balls.forEach(function(b) {
           b.update(delta);
           b.draw(ctx); 
        });
    };
    
    function fire() {
        var r = Math.random(),
            g = Math.random(),
            b = Math.random(),
            speed = Math.random() * 200 + 600;
        for (var i = Math.random() * 10 + 10; i > 0; i--){
            balls.push(new Ball(
                canvas.width / 2, 
                canvas.height / 2, 
                15 / size_factor,
                speed,
                r, g, b
            ));
        };
    };
        
    viz.init = function(canvas_id) {
        canvas = document.getElementById(canvas_id);
        ctx = canvas.getContext('2d');
    };
    
    viz.reset = function(node) {
        analyser = node;
        animate = false;
        freqByteData = new Uint8Array(analyser.frequencyBinCount);
		timeByteData = new Uint8Array(analyser.frequencyBinCount);
    };
    
    viz.animate = function() {
        animate = true;
        last_time = Date.now();
        doAnimate();
    };
    
    viz.stop = function() {
        animate = false;
    };
    
    viz.maximize = function() {
        canvas.width = $(window).innerWidth();
        canvas.height = $(window).innerHeight();
    };
    
    return viz;
})(Visualizer || {});