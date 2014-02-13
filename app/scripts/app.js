(function(W, T, Hooray) {
    "use strict";

    var game = new Billiard.Game('gameContainer', new Billiard.Rules.EightBall());

    W.onload = function() {
        game.initGame().then(function(renderFn) {
            Hooray.log('The game is completely set up and about to start!', renderFn);
            renderFn();
        });
    };
})(window, THREE, Hooray);
