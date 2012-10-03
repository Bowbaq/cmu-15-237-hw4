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
    
    EightTracks.init('2cb05ceb3c6592edb5ee0116b7fb4fb1a832d3f3');
    EightTracks.login("cmu-237-TrackViz", "geez look at that app");
    
    
    $('#search-form').submit(function(){
        var search = $(this).find('#search').val();
            
        if(0 == search.trim().length) {
            return false;
        }
        
        ML.remove();
        EightTracks.find(search, function(mixes) {        
            if(mixes.length > 0) {
                $('#cover').attr('src', mixes[0].cover);
                EightTracks.requestplay(mixes[0], function(play) {
                    console.log(play);
                    ML.load(play.track.url);
                    ML.play();
                    $('#music-controls').text(play.track.name + ' | ' + play.track.performer);
                });
            } else {
                $('#playlist').text("No results found");
            }
        });
        
        return false;
    });
    

});

    

    
    //var sound = ML.get(ML.load('http://api.soundcloud.com/tracks/14278368/stream'));
    //ML.play(sound.id);