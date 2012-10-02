(function(){
    var loader = function MusicLoader(api_key) {
        this.api_key = api_key;
        
        this.context = new webkitAudioContext();
        
        this.sounds = {};
        this.sound_id = 0;
    };

    loader.prototype.load = function(url) {
        var audio = document.createElement('audio');
        audio.setAttribute('src', url + '?client_id=' + this.api_key);
        audio.load();
        
        this.sound_id += 1;
        this.sounds[this.sound_id] = {
            "node": audio,
            "source" : this.context.createMediaElementSource(audio)
        };
                
        return this.sound_id;
    };
    
    loader.prototype.play = function(sound_id) {
        var sound = this.sounds[sound_id];
        sound.source.connect(this.context.destination);
        sound.source.mediaElement.play();
    };
    
    loader.prototype.stop = function(sound_id) {
        var sound = this.sounds[sound_id];
        sound.source.mediaElement.pause();
    };
    
    loader.prototype.remove = function(sound_id) {
        delete this.sounds[sound_id];
    };
    
    window.ML = new loader('c82759e173597444cb667171f18e7656');
})();