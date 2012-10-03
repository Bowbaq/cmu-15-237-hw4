var EightTracks = (function (et) {
    'use strict';
    
    var 
        _base_url = 'http://8tracks.com/',
        _api_key = '',
        _user_token = '',
        _logged_in = false
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
                per_page: 10
            },
            function(data) {
                var mixes = [];
                data.mixes.forEach(function(mix) {
                    mixes.push({
                        id: mix.id,
                        cover: mix.cover_urls.sq500
                    });
                });
                callback(mixes);
            }
        );
    };
    
    et.requestplay = function(mix, callback) {
        _request('GET', 'sets/new', {}, function(data) {
            _request('GET', 'sets/' + data.play_token + '/play',
                {
                    mix_id: mix.id
                },
                function(data) {
                    callback(data.set);
                }
            );
        });
    };
    
    return et;
})(EightTracks || {});