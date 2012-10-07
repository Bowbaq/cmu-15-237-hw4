function Ball() {}

Ball.prototype = {
    constructor: Ball,
    update: function(delta) {
        this.x += (this.vx * delta);
        this.y -= (this.vy * delta);
        if(this.r > 3) {
            this.r -= (3 * delta);
        }
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
    init: function(x, y, r, speed, cr, cg, cb) {		
        var theta = Math.random() * 2 * Math.PI;
        if(r > 50) {
            r = 50;
        }

        this.x = x;
        this.y = y;
        this.r = r;

        this.vx = (speed - 6 * this.r) * Math.sin(theta);
        this.vy = (speed - 6 * this.r) * Math.cos(theta);

    	this.gradient = [
    	    [0, "white"], 
    	    [0.4, "rgba(255, 255, 255, 0.5)"], 
    	    [0.4, "rgba(" + cr + ", " + cg + ", " + cb + ", 0.5)"],
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
        var fqSum = 0, fqSqSum = 0, varAvg = 0, before_last_variance, last_variance, variance,
            length, f, max, min
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
        if(before_last_variance < last_variance && last_variance > variance && variance > varAvg) {
            max = Math.max.apply(null, timeByteData);
            min = Math.min.apply(null, timeByteData);
            size_factor = (max - min) / max;
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
        var inb =  (b.x - b.r > 0 && b.x + b.r < canvas.width && b.y - b.r > 0 && b.y + b.r < canvas.height) || b.r < 4 ;
        return inb;
    }
    
    function draw() {
        var now = Date.now(),
            delta = (now - last_time) / 1000,
            b
        ;
        
        // Draw background
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    	ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        last_time = now;
        balls = balls.filter(inBounds);
        for (var i = balls.length - 1; i >= 0; i--){
            b = balls[i];
            if(!inBounds(b)) {
                pool.releaseBall(b);
                continue;
            }
            b.update(delta);
            b.draw(ctx);
        };
    };
    
    function fire() {
        var ball, speed = Math.random() * 200 + 1000,
            color = size_factor * 16777216,
            r = (color & 0xFF0000) >> 16,
            g = (color & 0x00FF00) >> 8,
            b = color & 0x0000FF;
        
        for (var i = Math.random() * 5 + 10; i > 0; i--){
            ball = pool.getBall();
            ball.init(
                canvas.width / 2, 
                canvas.height / 2, 
                15 / size_factor,
                speed,
                r, g, b
            );
            balls.push(ball);
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