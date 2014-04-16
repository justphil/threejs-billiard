module.exports = (function(Game, EightBallRules, DefaultTable) {
    "use strict";

    return {
        Game: Game,
        EightBallRules: EightBallRules,
        DefaultTable: DefaultTable
    };
})(
    require('./game/billiard_game'),
    require('./game/rules/eight_ball/eight_ball'),
    require('./game/tables/default')
);
