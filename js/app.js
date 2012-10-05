var App = (function (app) {
    'use strict';
    
    var v;
    
    // Initialze visualizer
    function setupVisualizer() {
        Visualizer.init('visualizer');
        Visualizer.maximize();

        // Resize canvas on window resize
        $(window).resize(function() {
            Visualizer.maximize();
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
                        var sound = ML.load(set.track.url);
                        ML.play();
                                                
                        updateTrackInfo(set.track);
                        
                        // Report song play after 30s
                        setTimeout(function() {
                            EightTracks.reportplayed(mixes[0].id, set.track.id);
                        }, 30 * 1000);
                    });
                } else {
                    $('#playlist ul').html("<li>No results found</li>");
                }
            });

            return false;
        });
    }
    
    function setupControls() {
        // Setup play / pause
        $('#play-pause').click(function() {
            var that = $(this);
            if (that.hasClass('icon-pause')) {
                ML.pause();
            } else {
                ML.play();
            }
            
            that.toggleClass('icon-pause icon-play');
        });
        
        // Hook up volume slider
        $('#volume-slider').change(function(e) {
            var val = e.srcElement.value;
            ML.setVolume(val);
            
            if (0 == val) {
                $('#volume-icon').removeClass('icon-volume-up').addClass('icon-volume-off');
            } else {
                $('#volume-icon').removeClass('icon-volume-off').addClass('icon-volume-up');
            }
        });
        
        // Hook up progress bar
        ML.setProgressUpdate(function(curr) {
            $('#progress-bar').attr('value', curr);
        });
        
        ML.setProgressReset(function(duration) {
            $('#progress-bar').attr('value', 0);
            $('#progress-bar').attr('max', duration);
        });
    }
    
    function updateCover(url) {
        if(url !== undefined && url !== null && url !== '') {
            $('#music-controls').css('background-image', 'url("' + url + '")');
        } else {
            $('#music-controls').css('background-image', 'url("img/unknown.jpg")');
        }
    }
    
    function updateTrackInfo(track) {
        $('#track-name').text(track.name);
        $('#track-artist').text(track.performer);
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
        setupControls();
    };
    
    return app;
})(App || {});