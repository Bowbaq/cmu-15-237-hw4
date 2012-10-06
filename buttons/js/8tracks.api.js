var EightTracks = (function (et) {
    'use strict';
    
    var 
        _base_url = 'http://8tracks.com/',
        _api_key = '',
        _user_token = '',
        _logged_in = false,
        _play_token = ''
    ;
    
    function _request(type, action, data, callback) {
        var call = type == 'POST' ? FlyJSONP.post : FlyJSONP.get;
        
        data.api_key = _api_key;
        data.api_version = 2;
        if(_user_token !== '') {
            data.user_token = _user_token;
        }
        
        call({
            url: _base_url + action + '.jsonp',
            parameters: data,
            success: callback
        });
    }
    
    et.init = function(api_key) {
        FlyJSONP.init();
        _api_key = api_key;
    };
    
    et.login = function(login, password) {
        _request('POST', 'sessions', { "login": login, "password": password }, 
            function(data) {
                if (data._logged_in === "true") {
                    _user_token = data.user_token;
                    _logged_in = true;
                }
            }
        );
        
        return _logged_in;
    };
    
    et.find = function(tags, callback) {
        _request('GET', 'mixes',
            {
                q: tags,
                sort: "hot",
                per_page: 5
            },
            function(data) {
                var mixes = [];
                data.mixes.forEach(function(mix) {
                    mixes.push({
                        id: mix.id,
                        name: mix.name,
                        cover: mix.cover_urls.sq500,
                        url: mix.restful_url,
                        desc: mix.description
                    });
                });
                callback(mixes);
            }
        );
    };
    
    et.requestplay = function(mix, callback) {
        _request('GET', 'sets/new', {}, function(data) {
            _play_token = data.play_token;
            _request('GET', 'sets/' + _play_token + '/play',
                {
                    mix_id: mix.id
                },
                function(data) {
                    callback(data.set);
                }
            );
        });
    };
    
    et.requestnext = function(mix, callback) {
        _request('GET', 'sets/' + _play_token + '/next',
            {
                mix_id: mix.id
            },
            function(data) {
                callback(data.set);
            }
        );
    };
    
    et.reportplayed = function(track_id, mix_id) {
        _request('GET', 'sets/' + _play_token + '/report', 
            {
                mix_id: mix_id,
                track_id: track_id
            },
            function(){}
        );
    };
    
    return et;
})(EightTracks || {});