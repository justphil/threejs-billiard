(function(W, T, Hooray) {
    "use strict";

    var game = new Billiard.GameRenderEngine('gameContainer');

    W.onload = function() {
        game.start();
    };
})(window, THREE, Hooray);
