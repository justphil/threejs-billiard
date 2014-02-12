(function(W, T, Hooray) {
    "use strict";

    var game = new Billiard.GameRenderEngine('gameContainer');

    W.onload = function() {
        game.start().then(function(data) {
            console.log('Promise has been resolved with: ' + data);
        });
    };
})(window, THREE, Hooray);
