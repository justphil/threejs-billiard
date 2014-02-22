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
            var t, collisions,
                remainingFrameTime = 1;

            while (remainingFrameTime > 0) {
                // determine all collisions that will happen in this frame
                collisions = this.determineAllBallCollisions();

                if (collisions.length > 0) {
                    // sort the collisions according to their occurrence time (asc)
                    collisions.sort(this.compareCollisionTime);

                    // move, rotate etc. all balls to the time of the first collision
                    t = collisions[0].t;
                    this.moveAllBallsByFraction(t);

                    // apply collision reaction for the first collision
                    collisions[0].ballA.applyBallCollisionReaction(collisions[0].ballB);

                    // decrease remaining frame time accordingly
                    remainingFrameTime = remainingFrameTime - t;
                }
                else {
                    // move, rotate etc. all balls for the remaining frame time
                    this.moveAllBallsByFraction(remainingFrameTime);
                    break;
                }
            }


            // old loop
            /*for (i = 0, n = ba.length; i < n; i++) {
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
            }*/
        },

        /*  #### #### #### */
        /*  #### #### #### */
        /*</MAIN GAME LOOP>*/

        moveAllBallsByFraction: function(fraction) {
            var i, n, ballA,
                ba = this.ballsArray;

            for (i = 0, n = ba.length; i < n; i++) {
                ballA = ba[i];
                ballA.translateByFraction(fraction);
                //ballA.rotateByFraction(fraction);
                //ballA.rotateZByFraction(fraction);
                ballA.handleCushionCollision(this.table);
            }
        },

        determineAllBallCollisions: function() {
            var i, j, n, t, ballA, ballB,
                frameCollisions = [],
                ba = this.ballsArray;

            // determine all collisions that will happen in this frame
            for (i = 0, n = ba.length; i < n; i++) {
                ballA = ba[i];

                // optimization to prevent double checking
                if (i < (n-1)) {
                    for (j = i + 1; j < n; j++) {
                        ballB = ba[j];
                        t = ballA.predictCollisionWith(ballB);
                        if (t >= 0 && t <= 1) {
                            console.log('A collision will happen at t = ' + t + ' ('+ballA.id+' -> '+ballB.id+')');
                            frameCollisions.push({
                                t: t,
                                ballA: ballA,
                                ballB: ballB
                            })
                        }
                    }
                }
            }

            return frameCollisions;
        },

        compareCollisionTime: function(a, b) {
            return a.t - b.t;
        },

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
