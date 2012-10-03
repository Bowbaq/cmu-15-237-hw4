var App = (function (app) {
    'use strict';
    
    var v;
    
    // Initialze visualizer
    function setupVisualizer() {
        v = new Visualizer('visualizer');
        v.maximize();
        v.start();

        // Resize canvas on window resize
        $(window).resize(function() {
            v.maximize();
        });

        // Fire on click
        $('#visualizer').click(function() {
            v.fire();
        });
    }
    
    function setup8Tracks() {
        // Initialize 8Tracks API
        EightTracks.init('2cb05ceb3c6592edb5ee0116b7fb4fb1a832d3f3');
        EightTracks.login("cmu-237-TrackViz", "geez look at that app");
    }
    
    function setupSearch() {
        $('#search-form').submit(function(){
            var search = $(this).find('#search').val();

            if(0 == search.trim().length) {
                return false;
            }

            // Stop playing current sound on new search
            ML.clear();
            EightTracks.find(search, function(mixes) {        
                if(mixes.length > 0) {
                    updatePlaylist(mixes);
                    updateCover(mixes[0].cover);
                    
                    EightTracks.requestplay(mixes[0], function(set) {
                        ML.load(set.track.url);
                        ML.play();
                        setTimeout(function() {
                            EightTracks.reportplayed(mixes[0].id, set.track.id);
                        }, 30 * 1000);

                        $('#music-controls').text(set.track.name + ' | ' + set.track.performer);
                    });
                } else {
                    $('#playlist ul').html("<li>No results found</li>");
                }
            });

            return false;
        });
    }
    
    function updateCover(url) {
        if(url !== undefined && url !== null && url !== '') {
            $('#cover').attr('src', url);
        } else {
            $('#cover').attr('src', 'img/unknown.jpg');
        }
    }
    
    function updatePlaylist(mixes) {
        var list = $('#playlist > ul'),
            item = '<li><a href="{{url}}" alt="{{desc}}" title="{{desc}}">{{name}}</a></li>\n'
        ;
        
        list.html('');
        mixes.forEach(function(mix) {
            list.append(item.replace('{{url}}', mix.url).replace('{{desc}}', mix.desc).replace('{{desc}}', mix.desc).replace('{{name}}', mix.name));
        });
    }

    // Boostrap the app
    app.run = function() { 
        setupVisualizer();
        setup8Tracks();
        setupSearch();
    };
    
    return app;
})(App || {});