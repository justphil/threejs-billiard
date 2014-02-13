(function(W, Hooray) {
    "use strict";

    var game = new Billiard.Game(
        'gameContainer',
        new Billiard.Rules.EightBall(),
        new Billiard.Table.Default(300, 300)
    );

    W.onload = function() {
        game.prepare().then(function() {
            Hooray.log('The game is completely set up and about to start!');
            game.start();

            W.setTimeout(function() {
                game.stop();
            }, 5000);
        });
    };
})(window, Hooray);
