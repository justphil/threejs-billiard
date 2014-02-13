(function(W, Hooray) {
    "use strict";

    var Billiard = Hooray.Namespace('Billiard', 'Billiard');
    Billiard.GameLoop = Hooray.Class({
        init: function(balls, gameRenderEngine) {
            Hooray.log('A new Billiard.GameLoop instance has been created!');
            this.balls = balls;
            this.gameRenderEngine = gameRenderEngine;
        },

        /*<MAIN GAME LOOP>*/
        /* #### #### #### */
        /* #### #### #### */

        mainGameLoop: function() {
            Hooray.log('### mainGameLoop() ###');
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
