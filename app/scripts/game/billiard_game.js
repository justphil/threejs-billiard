(function(W, Hooray) {
    "use strict";

    Hooray.defineClass('Billiard', '', 'Game', {
        init: function(gameContainerId, rules, table) {
            Hooray.log('A new Billiard.Game instance has been created!');
            this.pubSub = new Hooray.PubSub();
            this.eventProcessor = new Billiard.Event.EventProcessor(this.pubSub);
            this.balls = this.initBalls(rules, this.pubSub); // hash: ballId -> Billiard.Ball object
            this.cues = this.initCues(111, 222);
            this.gameRenderEngine = new Billiard.GameRenderEngine(gameContainerId);
            this.table = table;
            this.pockets = this.initPockets(table);
            this.gameLoop = new Billiard.GameLoop(this.gameRenderEngine, this.table, this.balls, this.cues);
        },

        prepare: function() {
            var that = this;
            return this.gameRenderEngine.initGameRenderEngine(
                this.balls, this.cues, this.pockets
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
                    balls[prop] = new Billiard.Ball(
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

        initCues: function(player1Id, player2Id) {
            var cues = {};

            cues[player1Id] = new Billiard.Cue(player1Id);
            //cues[player2Id] = new Billiard.Cue(player2Id);

            return cues;
        },

        initPockets: function(table) {
            var pockets = {};
            var pocketData = table.getPockets();

            for (var pocketId in pocketData) {
                if (pocketData.hasOwnProperty(pocketId)) {
                    pockets[pocketId] = new Billiard.Pocket(
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

})(window, Hooray);
