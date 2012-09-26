$(document).ready(function() {
    var v = new Visualizer('visualizer');
    v.start();
    $('#fire').click(function(){
        for (var i = 10; i > 0; i--){
            this.fire();
        };
        
    }.bind(v));
});