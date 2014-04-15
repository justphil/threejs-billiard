module.exports = (function(Hooray, Logger, THREE, Q) {
    "use strict";

    return Hooray.Class({
        init: function() {
            Logger.log('A new Billiard.AssetLoader instance has been created!');

            this.maps = {}; // url -> texture map
            this.textureLoader = new THREE.TextureLoader();
        },

        getMap: function(url) {
            if (Hooray.isUndefined(this.maps[url])) {
                var deferred = Q.defer(),
                    that = this,
                    onLoad,
                    onProgress,
                    onError;



                onLoad = function(content) {
                    Logger.log('[Billiard.AssetLoader] Texture "'+url+'" loaded.');
                    that.maps[url] = content;
                    deferred.resolve(content);
                };

                onProgress = function(progress) {
                    Logger.log('[Billiard.AssetLoader] Loading texture "'+url+'"...', progress);
                    deferred.notify(progress);
                };

                onError= function(message) {
                    Logger.log('[Billiard.AssetLoader] Error while loading texture "'+url+'".');
                    deferred.reject(message);
                };

                // parameters: url, onLoad, onProgress, onError
                this.textureLoader.load(url, onLoad, onProgress, onError);


                return deferred.promise;
            }
            else {
                Logger.log('[Billiard.AssetLoader] Returning cached texture "'+url+'".');
                return Q.when(this.maps[url]);
            }
        },

        getMaps: function(urlArray) {
            var promises = [],
                i, n;

            for (i = 0, n = urlArray.length; i < n; i++) {
                promises.push(
                    this.getMap(urlArray[i])
                );
            }

            return Q.all(promises).then(function(resultArray) {
                var obj = {};

                for (i = 0, n = urlArray.length; i < n; i++) {
                    obj[urlArray[i]] = resultArray[i];
                }

                return obj;
            });
        }
    });
})(require('../basics/foundation'), require('../basics/log'), require('three'), require('q'));
