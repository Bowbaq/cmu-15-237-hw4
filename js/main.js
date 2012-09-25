$(document).ready(function() {
    var v = new Visualizer('visualizer');
    v.start();
    $('body').click(function(){
        this.fire();
    }.bind(v));
});