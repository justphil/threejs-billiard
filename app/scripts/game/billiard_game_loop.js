(function(W, Hooray) {
    "use strict";

    Hooray.defineClass('Billiard', '', 'GameLoop', {
        init: function(gameRenderEngine, balls, table) {
            Hooray.log('A new Billiard.GameLoop instance has been created!');
            this.gameRenderEngine = gameRenderEngine;
            this.balls = balls;
            this.table = table;

            // create an array out of the balls hash due to fixed order and easier iteration in mainGameLoop
            this.ballsArray = [];
            for (var ballId in this.balls) {
                if (this.balls.hasOwnProperty(ballId)) {
                    this.ballsArray.push(this.balls[ballId]);
                }
            }
        },

        /*<MAIN GAME LOOP>*/
        /* #### #### #### */
        /* #### #### #### */

        mainGameLoop: function() {
            var i, j, n, ballA, ballB,
                ba = this.ballsArray;
            for (i = 0, n = ba.length; i < n; i++) {
                ballA = ba[i];
                ballA.translate();
                ballA.rotate();
                ballA.rotateZ();
                ballA.handleCushionCollision(this.table);

                // optimization to eliminate double collision checking between two balls
                if (i < (n-1)) {
                    for (j = i + 1; j < n; j++) {
                        ballB = ba[j];
                        ballA.handleBallCollision(ballB);
                    }
                }
            }
        },

        /*  #### #### #### */
        /*  #### #### #### */
        /*</MAIN GAME LOOP>*/

        start: function(renderFn) {
            var that = this;
            (function loop() {
                that.timerId = W.requestAnimationFrame(loop);
                that.mainGameLoop();
                renderFn();
            })();
        },

        stop: function() {
            if (!Hooray.isUndefined(this.timerId)) {
                W.cancelAnimationFrame(this.timerId);
            }
        }
    });

})(window, Hooray);
