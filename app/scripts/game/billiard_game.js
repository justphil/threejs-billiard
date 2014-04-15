module.exports = (function(Hooray, Logger, PubSub, EventProcessor, GameRenderEngine, GameLoop, Ball, Cue, Pocket) {
    "use strict";

    return Hooray.Class({
        init: function(gameContainerId, rules, table) {
            Logger.log('A new Billiard.Game instance has been created!');
            this.pubSub = new PubSub();
            this.eventProcessor = new EventProcessor(this.pubSub);
            this.balls = this.initBalls(rules, this.pubSub); // hash: ballId -> Billiard.Ball object
            this.cues = this.initCues(111, 222, table);
            this.gameRenderEngine = new GameRenderEngine(gameContainerId);
            this.table = table;
            this.pockets = this.initPockets(table);
            this.gameLoop = new GameLoop(
                this.gameRenderEngine, this.table, this.balls, this.cues, this.pockets
            );
        },

        prepare: function() {
            var that = this;
            return this.gameRenderEngine.initGameRenderEngine(
                    this.table, this.balls, this.cues, this.pockets
                ).then(function(renderFn) {
                    that.renderFn = renderFn;
                });
        },

        initBalls: function(rules, pubSub) {
            var positions   = rules.getBalls(), // hash: ballId -> position object
                radius      = rules.getBallRadius(), // number
                mass        = rules.getBallMass(), // number
                balls       = {},
                prop;

            for (prop in positions) {
                if (positions.hasOwnProperty(prop)) {
                    balls[prop] = new Ball(
                        prop,
                        positions[prop].x,
                        positions[prop].y,
                        radius,
                        mass,
                        pubSub
                    );
                }
            }

            return balls;
        },

        initCues: function(player1Id, player2Id, table) {
            var cues = {};

            cues[player1Id] = new Cue(player1Id, table);
            //cues[player2Id] = new Cue(player2Id, table);

            return cues;
        },

        initPockets: function(table) {
            var pockets = {};
            var pocketData = table.getPockets();

            for (var pocketId in pocketData) {
                if (pocketData.hasOwnProperty(pocketId)) {
                    pockets[pocketId] = new Pocket(
                        pocketId,
                        pocketData[pocketId].x,
                        pocketData[pocketId].y,
                        pocketData[pocketId].radius
                    );
                }
            }

            return pockets;
        },

        start: function() {
            if (Hooray.isUndefined(this.renderFn)) {
                throw new Error('Cannot start uninitialized game! Please call prepare() before start().');
            }
            this.gameLoop.start(this.renderFn);
        },

        stop: function() {
            this.gameLoop.stop();
        }
    });

})(
    require('../basics/foundation'),
    require('../basics/log'),
    require('../basics/pub_sub'),
    require('./events/event_processor'),
    require('./billiard_game_render_engine'),
    require('./billiard_game_loop'),
    require('./billiard_ball'),
    require('./billiard_cue'),
    require('./billiard_pocket')
);
