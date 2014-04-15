(function(Hooray, Logger, BilliardGame, EightBallRules, DefaultTable) {
    "use strict";

    var game = new BilliardGame(
        'gameContainer',
        new EightBallRules(),
        new DefaultTable(960, 480)
    );

    window.onload = function() {
        game.prepare().then(function() {
            Logger.log('The game is completely set up and about to start!');
            game.start();
        });
    };
})(
    require('./basics/foundation'),
    require('./basics/log'),
    require('./game/billiard_game'),
    require('./game/rules/eight_ball/eight_ball'),
    require('./game/tables/default')
);
