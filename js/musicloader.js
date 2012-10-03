(function(){
    var loader = function MusicLoader(api_key) {
        this.api_key = api_key;
        
        this.context = new webkitAudioContext();
        
        this.sounds = {};
        this.sound_id = 0;
    };

    loader.prototype.load = function(url) {
        var source,
            audio = document.createElement('audio'),
            gain  = this.context.createGainNode(),
            analyser = this.context.createAnalyser()
        ;
        
        audio.setAttribute('src', url + '?client_id=' + this.api_key);
        audio.load();
        
        source = this.context.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(gain);
        gain.connect(this.context.destination);
        
        
        this.sound_id += 1;
        this.sounds[this.sound_id] = {
            "id": this.sound_id,
            "node": audio,
            "gainNode": gain,
            "analyserNode": analyser,
            "source" : source
        };
                
        return this.sound_id;
    };
    
    loader.prototype.play = function(sound_id) {
        var sound = this.sounds[sound_id];
        sound.source.mediaElement.play();
    };
    
    loader.prototype.stop = function(sound_id) {
        var sound = this.sounds[sound_id];
        sound.source.mediaElement.pause();
    };
    
    loader.prototype.remove = function(sound_id) {
        delete this.sounds[sound_id];
    };
    
    loader.prototype.get = function(sound_id) {
        return this.sounds[sound_id];
    }
    
    window.ML = new loader('c82759e173597444cb667171f18e7656');
})();