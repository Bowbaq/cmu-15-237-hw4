var ML = (function(ml) {
    'use strict';
    
    var context = new webkitAudioContext(),
        sound = null
    ;
    
    ml.load = function(url) {
        var source,
            audio = document.createElement('audio'),
            gain  = context.createGainNode(),
            analyser = context.createAnalyser()
        ;
        
        audio.setAttribute('src', url);
        audio.load();
        
        source = context.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(gain);
        gain.connect(context.destination);
        
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
        } 
    };
    
    ml.stop = function() {
        if (sound !== null) {
            sound.source.mediaElement.pause();
        }
    };
    
    ml.remove = function() {
        if(sound !== null) {
            this.stop();
            sound = null;
        }
    };
    
    return ml;
})(ML || {});