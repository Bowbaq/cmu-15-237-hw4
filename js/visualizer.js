var Visualizer = (function(viz) {
    var canvas, 
        ctx,
        freqByteData,
        timeByteData,
        animate = false,
        analyser
    ;
    
    function update() {
        analyser.smoothingTimeConstant = 0.1;
		analyser.getByteFrequencyData(freqByteData);
		analyser.getByteTimeDomainData(timeByteData);
    }
    
    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "red";
        for (var i = 0; i < timeByteData.length; i++) {
           ctx.fillRect(450 + i, 200 - timeByteData[i] / 2, 1, timeByteData[i]);
        }
        
        ctx.fillStyle = "orange";
        for (var i = 0; i < freqByteData.length; i++) {
           ctx.fillRect(450 + i, 700 - freqByteData[i], 1, freqByteData[i]);
        }
    }
    
    function doAnimate() {
        if(animate) {
            requestAnimationFrame(doAnimate);
            render();
            update();
        }
    }
        
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