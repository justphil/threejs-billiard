(function(W, Hooray) {
    "use strict";

    Hooray.defineClass('Billiard', '', 'GameLoop', {
        init: function(gameRenderEngine, table, balls, cues) {
            Hooray.log('A new Billiard.GameLoop instance has been created!');
            this.gameRenderEngine = gameRenderEngine;
            this.balls = balls;
            this.cues = cues;
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
            var i, n, t, collisions, frictions, ball, cueId,
                ba = this.ballsArray,
                remainingFrameTime = 1;

            while (remainingFrameTime > 0) {
                // determine all collisions that will happen in this frame
                collisions = this.determineAllBallCollisions();

                if (collisions.length > 0) {
                    // sort the collisions according to their occurrence time (asc)
                    collisions.sort(this.compareCollisionTime);

                    // translate all balls to the time of the first collision
                    t = collisions[0].t;
                    frictions = this.translateAllBallsByFraction(t);

                    // potentially there can be more collisions at the same time t -> check for it
                    collisions = this.getBallCollisionsAt(t, collisions);

                    // apply collision reaction for all collisions at time t
                    for (i = 0, n = collisions.length; i < n; i++) {
                        collisions[i].ballA.applyBallCollisionReaction(collisions[i].ballB);
                    }

                    // decrease remaining frame time accordingly
                    remainingFrameTime = remainingFrameTime - t;
                }
                else {
                    // translate all balls for the remaining frame time
                    frictions = this.translateAllBallsByFraction(remainingFrameTime);
                    break;
                }
            }

            // apply general loop for friction and z-rotation
            for (i = 0, n = ba.length; i < n; i++) {
                ball = ba[i];
                ball.applyAbsoluteFriction(frictions[i], ball.getVelocity(), ball.getVelocityAngle(), 0.05);
                ball.rotateZ();

                // TODO: Remove experimental cowboy code
                if (ball.id === 'images/ball0.jpg') {
                    ball.mesh.scale.x -= 0.001;
                    ball.mesh.scale.y -= 0.001;
                    ball.mesh.scale.z -= 0.001;
                }
            }

            // render cues
            for (cueId in this.cues) {
                if (this.cues.hasOwnProperty(cueId)) {
                    this.cues[cueId].update();
                }
            }
        },

        /*  #### #### #### */
        /*  #### #### #### */
        /*</MAIN GAME LOOP>*/

        translateAllBallsByFraction: function(fraction) {
            var i, n, ballA,
                frictions = [],
                ba = this.ballsArray;

            for (i = 0, n = ba.length; i < n; i++) {
                ballA = ba[i];
                ballA.translateByFraction(fraction);

                frictions[i] = ballA.rotateByFraction(fraction);

                ballA.handleCushionCollision(this.table);
            }

            return frictions;
        },

        getBallCollisionsAt: function(t, orderedCollisions) {
            return orderedCollisions.filter(function(collision) {
                return collision.t === t;
            });
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
                            //console.log('A collision will happen at t = ' + t + ' ('+ballA.id+' -> '+ballB.id+')');
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
