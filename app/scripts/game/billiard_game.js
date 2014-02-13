(function(W, T, Hooray) {
    "use strict";

    var Billiard = Hooray.Namespace('Billiard', 'Billiard');
    Billiard.Game = Hooray.Class({
        init: function(gameContainerId, rules) {
            Hooray.log('A new Billiard.Game instance has been created!');
            this.balls = this.initBalls(rules); // hash: ballId -> Billiard.Ball object
            this.gameRenderEngine = new Billiard.GameRenderEngine(gameContainerId);
            this.gameLoop = new Billiard.GameLoop(this.balls, this.gameRenderEngine);
        },

        initGame: function() {
            var that = this;
            return this.gameRenderEngine.initGameRenderEngine(this.balls).then(function(renderFn) {
                that.renderFn = renderFn;
            });
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
        },

        start: function() {
            if (Hooray.isUndefined(this.renderFn)) {
                throw new Error('Cannot start uninitialized game! Please call initGame() before start().');
            }
            this.gameLoop.start(this.renderFn);
        },

        stop: function() {
            this.gameLoop.stop();
        }
    });
})(window, THREE, Hooray);
