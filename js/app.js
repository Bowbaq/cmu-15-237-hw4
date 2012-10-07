var App = (function (app) {
    'use strict';
    
    var _mixes = [],
        _currMix = 0;
    
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
            
            // Show the control bar on the first search
            $('#controls-bar').removeClass('visually-hidden');

            // Stop playing current sound on new search
            ML.clear();
            EightTracks.find(search, function(mixes) {
                if(mixes.length > 0) {
                    _mixes = mixes;
                    _currMix = 0;
                    changeMix();
                } else {
                    $('#playlist ul').html("<li>No results found</li>");
                    $('#playlist ul').removeClass('visually-hidden');
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
        
        // Setup next track button
        $('#track-skip').click(nextSong);
        
        // Hook up volume slider
        $('#volume-slider').change(function(e) {
            var val = $(this).val();
            ML.setVolume(val);
            
            if (0 == val) {
                $('#volume-icon').removeClass('icon-volume-up').addClass('icon-volume-off');
            } else {
                $('#volume-icon').removeClass('icon-volume-off').addClass('icon-volume-up');
            }
        });
        // Hook up volume icon
        $('#volume-icon').click(function() {
            var slider = $('#volume-slider');
            slider.attr('value', 0);
            slider.trigger('change');
        });
        
        // Hook up progress bar
        ML.setProgressUpdate(function(curr) {
            $('#progress-bar').attr('value', curr);
        });
        
        ML.setProgressReset(function(duration) {
            $('#progress-bar').attr('value', 0);
            $('#progress-bar').attr('max', duration);
        });
        
        ML.setSongEnd(nextSong);
    }
    
    function updateCover() {
        var url = _mixes[_currMix].cover;
        if(url !== undefined && url !== null && url !== '') {
            $('#music-controls').css('background-image', 'url("' + url + '")');
        } else {
            $('#music-controls').css('background-image', 'url("img/unknown.jpg")');
        }
    }
    
    function updateTrackInfo(track) {
        var name = (track.name.length > 20) ? track.name.substr(0, 20) + '...' : track.name;
        var perf = (track.performer.length > 32) ? track.performer.substr(0, 32) + '...' : track.performer;
        $('#track-name').text(name);
        $('#track-artist').text(perf);
    }
    
    function updatePlaylist(mixes) {
        var list = $('#playlist > ul'),
            item = '<li data-mix-id={{id}}><a href="#" alt="{{desc}}" title="{{desc}}"><i class="{{class}}"></i>{{name}}</a></li>\n',
            mix, li
        ;
        
        list.addClass('visually-hidden');
        list.html('');
        for (var i = 0; i < _mixes.length; i++){
            mix = _mixes[i];
            li = item.replace('{{desc}}', mix.desc)
                .replace('{{desc}}', mix.desc)
                .replace('{{name}}', mix.name)
                .replace('{{id}}', i);
            
            if(i == _currMix) {
                list.append(li.replace('{{class}}', 'icon-music'));
            } else {
                list.append(li.replace('{{class}}', 'icon-play hover-show'));
            }
        };
		
		list.children().click(function() {
		    _currMix = $(this).attr('data-mix-id');
		    changeMix();
		});
		
		list.removeClass('visually-hidden');
    }
    
    function changeMix() {
        if (_mixes.length > 0 && _currMix < _mixes.length) {
            updatePlaylist(_mixes);
            updateCover();
            nextSong();
        } else {
            // Fetch more mixes?
        }
    }
    
    function nextSong() {
        if (_mixes.length > 0) {
            if(_mixes[_currMix].set === undefined) {
                EightTracks.requestplay(_mixes[_currMix], playSong);
            } else if(!_mixes[_currMix].set.at_end) {
                EightTracks.requestnext(_mixes[_currMix], playSong);
            } else if(_currMix < _mixes.length - 1) {
                // Next mix
                _currMix++;
                changeMix();
            }
        }
    }
    
    function playSong(set) {
        console.log(set);
        _mixes[_currMix].set = set;
        ML.pause();
        ML.load(set.track.url);
        ML.play();

        updateTrackInfo(set.track);

        // Report song play after 30s
        setTimeout(function() {
            EightTracks.reportplayed(_mixes[0].id, set.track.id);
        }, 30 * 1000);
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