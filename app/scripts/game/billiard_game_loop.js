(function(W, Hooray) {
    "use strict";

    var Billiard = Hooray.Namespace('Billiard', 'Billiard');
    Billiard.GameLoop = Hooray.Class({
        init: function(gameRenderEngine, balls, table) {
            Hooray.log('A new Billiard.GameLoop instance has been created!');
            this.gameRenderEngine = gameRenderEngine;
            this.balls      = balls;
            this.table = table;

            // create an array out of the balls hash due fixed order
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
            var i, n, b,
                ba = this.ballsArray;
            for (i = 0, n = ba.length; i < n; i++) {
                b = ba[i];
                b.translate();
                b.rotate();
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
