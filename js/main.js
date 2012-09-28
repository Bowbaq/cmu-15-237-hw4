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
});