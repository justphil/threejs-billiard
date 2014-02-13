(function(W, T, Hooray) {
    "use strict";

    var Billiard = Hooray.Namespace('Billiard', 'Billiard');
    Billiard.Game = Hooray.Class({
        init: function(gameContainerId, rules) {
            Hooray.log('A new Billiard.Game instance has been created!');
            this.gameContainerId = gameContainerId;
            this.rules = rules;
            this.balls = this.initBalls(rules); // hash: ballId -> Billiard.Ball object
            this.gameRenderEngine = new Billiard.GameRenderEngine(gameContainerId);
        },

        initGame: function() {
            return this.gameRenderEngine.initGameRenderEngine(this.balls);
        },

        initBalls: function(rules) {
            var positions   = rules.getBalls(), // hash: ballId -> position object
                radius      = rules.getBallRadius(), // number
                balls       = {},
                prop;

            for (prop in positions) {
                if (positions.hasOwnProperty(prop)) {
                    balls[prop] = new Billiard.Ball(
                        prop,
                        positions[prop].x,
                        positions[prop].y,
                        radius
                    );
                }
            }

            return balls;
        }
    });
})(window, THREE, Hooray);
