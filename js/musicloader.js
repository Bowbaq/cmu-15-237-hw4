var ML = (function(ml) {
    'use strict';
    
    var context = new webkitAudioContext(),
        sound = null,
        progress_callback = null,
        progress_reset = null,
        progress_interval = null,
        song_end = null
    ;
    
    function onLoadedData() {
        if(progress_reset !== null) {
            progress_reset(Math.ceil(sound.node.duration));
        }
    }
    
    function onSongEnded() {
        if(song_end !== null) {
            ml.pause();
            song_end();
        }
    }
    
    function onProgress() {
         progress_callback(Math.ceil(sound.node.currentTime));
    }
    
    ml.load = function(url) {
        var source,
            audio = document.createElement('audio'),
            gain  = context.createGainNode(),
            analyser = context.createAnalyser()
        ;
        
        audio.setAttribute('src', url);
        audio.load();
        audio.addEventListener('loadeddata', onLoadedData);
        audio.addEventListener('ended', onSongEnded);
        
        Visualizer.reset(analyser);
        
        source = context.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(gain);
        gain.connect(context.destination);
        gain.gain.value = $('#volume-slider').attr('value');
        
        sound = {
            "node": audio,
            "gainNode": gain,
            "analyserNode": analyser,
            "source" : source
        };
        
        return sound;
    };
    
    ml.play = function() {
        if (sound !== null) {
            sound.source.mediaElement.play();
            
            if(progress_callback !== null ) {
                if(progress_interval !== null) {
                    clearInterval(progress_interval);
                }
                progress_interval = setInterval(onProgress, 1000);
            }
            
            Visualizer.animate();
        }
    };
    
    ml.pause = function() {
        if (sound !== null) {
            sound.source.mediaElement.pause();
            Visualizer.stop();
        }
    };
    
    ml.remove = function() {
        if(sound !== null) {
            this.pause();
            sound = null;
        }
    };
    
    ml.setVolume = function(val) {
        if(val < 0) {
            val = 0;
        }
        if (val > 1) {
            val = 1;
        }
        
        if(sound !== null) {
            sound.gainNode.gain.value = val;
        }
    };
    
    ml.setProgressUpdate = function(callback) {
        progress_callback = callback;
    };
    
    ml.setProgressReset = function(callback) {
        progress_reset = callback;
    };
    
    ml.setSongEnd = function(callback) {
        song_end = callback;
    };
    
    return ml;
})(ML || {});