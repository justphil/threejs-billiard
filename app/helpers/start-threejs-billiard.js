(function(Billiard) {
    "use strict";

    var game = new Billiard.Game(
        'gameContainer',
        new Billiard.EightBallRules(),
        new Billiard.DefaultTable(960, 480)
    );

    window.onload = function() {
        game.prepare().then(function() {
            console.log('The game is completely set up and about to start!');
            game.start();
        });
    };
})(ThreeJsBilliard);
