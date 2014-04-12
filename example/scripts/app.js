(function(W, Hooray) {
    "use strict";

    var game = new Billiard.Game(
        'gameContainer',
        new Billiard.Rules.EightBall(),
        new Billiard.Table.Default(960, 480)
    );

    W.onload = function() {
        game.prepare().then(function() {
            Hooray.log('The game is completely set up and about to start!');
            game.start();
        });
    };
})(window, Hooray);
