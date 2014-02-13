(function(W, T, Hooray) {
    "use strict";

    var game = new Billiard.GameRenderEngine('gameContainer');

    W.onload = function() {
        game.start().then(function(data) {
            console.log('Promise has been resolved with: ' + data);

            var assetLoader = new Billiard.AssetLoader();

            var texturesToLoad = [
                'images/ball0.jpg', 'images/ball1.jpg', 'images/ball2.jpg',
                'images/ball3.jpg', 'images/ball4.jpg', 'images/ball5.jpg',
                'images/ball6.jpg', 'images/ball7.jpg', 'images/ball8.jpg',
                'images/ball9.jpg', 'images/ball10.jpg', 'images/ball11.jpg',
                'images/ball12.jpg', 'images/ball13.jpg', 'images/ball14.jpg',
                'images/ball15.jpg'
            ];

            assetLoader.getMaps(texturesToLoad).then(function(mapArray) {
                console.log('OK', mapArray);
            });
        });
    };
})(window, THREE, Hooray);
