function Ball() {}

Ball.prototype = {
    constructor: Ball,
    update: function(delta) {
        this.x += (this.vx * delta);
        this.y -= (this.vy * delta);
        this.r -= (3 * delta);
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
    },
    init: function(x, y, r, speed, fr, fg, fb) {
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
};

function BallPool() {
    this.pool = [];
    for (var i = 0; i  < 300; i++) {
        this.pool.push(new Ball());
    };
}

BallPool.prototype = {
    constructor: BallPool,
    getBall: function() {
        if(this.pool.length > 0) {
            return this.pool.pop();
        } else {
            return new Ball();
        }
    },
    releaseBall: function(b) {
        this.pool.push(b);
    }
};

var Visualizer = (function(viz) {
    var canvas, 
        ctx,
        freqByteData,
        timeByteData,
        animate = false,
        analyser,
        balls = [],
        last_time = Date.now(),
        size_factor = 0,
        variances = [0, 0],
        pool = new BallPool()
    ;
    
    function update() {
        var max = Math.max.apply(null, timeByteData), min = Math.min.apply(null, timeByteData),
            fqSum = 0, fqSqSum = 0, varAvg = 0, before_last_variance, last_variance, variance,
            length, f
        ;
        
        analyser.smoothingTimeConstant = 0.1;
		analyser.getByteFrequencyData(freqByteData);
		analyser.getByteTimeDomainData(timeByteData);
		
		length = freqByteData.length;
        for (var i = 0; i < length; i++) {
            f = freqByteData[i];
            fqSum += f;
            fqSqSum += f * f;
        }
        
        size_factor = (max - min) / max;
        
        variance = (length * fqSqSum - fqSum * fqSum) / (length * (length - 1));
        variances.push(variance);
        length = variances.length;
        if(length > 20) {
            variances.shift();
            length--;
        }
        for (var i = length - 1; i >= 0; i--){
            varAvg += variances[i];
        };
        varAvg /= length;
        
        before_last_variance = variances[length - 3];
        last_variance = variances[length - 2];
        // console.log(before_last_variance, last_variance, variance, varAvg);
        if(before_last_variance < last_variance && last_variance > variance && variance > varAvg) {
            fire();
        }
    }
    
    function doAnimate() {
        if(animate) {
            requestAnimationFrame(doAnimate);
            update();
            draw();
        }
    }
    
    function inBounds(b) {
        var inb =  b.x - b.r > 0 && b.x + b.r < canvas.width && b.y - b.r > 0 && b.y + b.r < canvas.height;
        if(!inb) {
            pool.releaseBall(b);
        } 
        
        return inb;
    }
    
    function draw() {
        var now = Date.now();
        var delta = (now - last_time) / 1000;
        var b, tmp, currBalls = [];
        
        // Draw background
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    	ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        last_time = now;
        
        balls = balls.filter(inBounds);
        
        for (var i = balls.length - 1; i >= 0; i--){
            b = balls[i];
            b.update(delta);
            b.draw(ctx);
        };        
    };
    
    function fire() {
        var b,
            r = Math.random(),
            g = Math.random(),
            b = Math.random(),
            speed = Math.random() * 200 + 600
        ;
        
        for (var i = Math.random() * 7 + 10; i > 0; i--){
            b = pool.getBall();
            b.init(
                canvas.width / 2, 
                canvas.height / 2, 
                15 / size_factor,
                speed,
                r, g, b
            );
            balls.push(b);
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