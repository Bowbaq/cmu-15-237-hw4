$(document).ready(function() {
    var v = new Visualizer('visualizer');
    v.start();
    $('#fire').click(function(){
        this.fire();        
    }.bind(v));
});