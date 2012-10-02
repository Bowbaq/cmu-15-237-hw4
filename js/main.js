$(document).ready(function() {
    var v = new Visualizer('visualizer');
    v.maximize();
    v.start();
    
    $(window).resize(function() {
        v.maximize();
    });
    
    $('#visualizer').click(function() {
        v.fire();
    });
    
    var id = ML.load('http://api.soundcloud.com/tracks/14278368/stream');
    ML.play(id);
    
    setTimeout(function(){
        ML.stop(id);
    }, 5000);
    
    setTimeout(function(){
        ML.remove(id);
    }, 6000);
});