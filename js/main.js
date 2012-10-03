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
    
    $('#search-form').submit(function(){
        var url = 'https://api.soundcloud.com/tracks.json?client_id=c82759e173597444cb667171f18e7656&q=',
            search = $(this).find('#search').val();
            
        if(0 == search.trim().length) {
            return false;
        }   
            
        $.getJSON(url, function(tracks) {
            if(0 == tracks.length) {
                $('#playlist').text("No results found");
                return;
            }
            
            tracks.forEach(function(t) {
               console.log(t.title); 
            });
            
            ML.play(ML.get(ML.load(tracks[0].stream_url)).id);
        });
        
        return false;
    });
    
    //var sound = ML.get(ML.load('http://api.soundcloud.com/tracks/14278368/stream'));
    //ML.play(sound.id);
});