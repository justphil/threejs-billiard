module.exports = (function(Hooray, Logger, CollisionHelper) {
    "use strict";

    return Hooray.Class({
        init: function() {
            Logger.log('A new Billiard.TargetGuide instance has been created!');

            /**
             * !!!
             * A Billiard.TargetGuide object will be augmented with the following properties during initialization:
             * * * mesh
             * * * meshCircle
             * * * meshAnotherBallReactionLine
             * !!!
             */
        },

        augment: function(prop, val) {
            this[prop] = val;
        },

        update: function(angle, ball0, otherBalls, distanceTopLeftToBottomRight, table) {
            /**
             * Basic idea:
             * Among the other parameters the Cue object passes us the distance from the top-left corner to
             * the bottom-right corner (main diagonal). This is the longest distance between two points on the playing field.
             * We use this distance to cast a ray from the white ball in the direction of the current cue orientation.
             * If there is an intersection between the ray and a ball we take this ball into account for displaying
             * the target guide circle (TGC) for the frame we are about to calculate.
             * But we are only interested in the first ball intersection. That's why we sort all ball intersections
             * by their occurrence time and only consider the first one for the calculation of the TGC's position.
             * In the future we might better use three.js' Raycaster class.
             */

            // TODO: We can save some cpu cycles and only do all the calculations when all balls aren't moving anymore.
            var i, n, t, b,
                endX, endY,
                ball0ReactionLineEndX, ball0ReactionLineEndY,
                collisionReactionalChanges,
                anotherBall, anotherBallPos,
                anotherBallReactionLineStartX, anotherBallReactionLineStartY,
                anotherBallReactionLineEndX, anotherBallReactionLineEndY;
            var sinAngle = Math.sin(angle);
            var cosAngle = Math.cos(angle);
            var fakeVx = distanceTopLeftToBottomRight * cosAngle;
            var fakeVy = distanceTopLeftToBottomRight * sinAngle;
            var ball0Pos = ball0.mesh.position;
            var timeToConsider = 1;
            var indexOfRelevantBall = -1;

            // determine if the TGC is colliding with a ball (indexOfRelevantBall becomes !== -1 if so)
            for (i = 0, n = otherBalls.length; i < n; i++) {
                // TODO: Potted balls doesn't need to be considered.
                b = otherBalls[i];
                // Parameters:
                // x1, y1, vX1, vY1, r1,
                // x2, y2, vX2, vY2, r2
                t = CollisionHelper.getCollisionTime(
                    ball0Pos.x, ball0Pos.y, fakeVx, fakeVy, ball0.radius,
                    b.mesh.position.x, b.mesh.position.y, 0, 0, b.radius
                );

                if (t !== null && t >= 0 && t <= 1) {
                    if (t < timeToConsider) {
                        timeToConsider = t;
                        indexOfRelevantBall = i;
                    }
                }
            }

            if (indexOfRelevantBall !== -1) {
                // TGC is colliding with a ball
                endX = ball0Pos.x + timeToConsider * fakeVx;
                endY = ball0Pos.y + timeToConsider * fakeVy;

                anotherBall = otherBalls[indexOfRelevantBall];
                anotherBallPos = anotherBall.mesh.position;

                // x1, y1, vX1, vY1, r1, m1,
                // x2, y2, vX2, vY2, r2, m2,
                // coefficientOfRestitution
                collisionReactionalChanges = CollisionHelper.calculateBallCollisionReaction(
                    endX, endY, 80 * cosAngle, 80 * sinAngle, ball0.radius, ball0.mass,
                    anotherBallPos.x, anotherBallPos.y, anotherBall.vX, anotherBall.vY, anotherBall.radius, anotherBall.mass,
                    1
                );

                ball0ReactionLineEndX = endX + collisionReactionalChanges.vX1;
                ball0ReactionLineEndY = endY + collisionReactionalChanges.vY1;

                anotherBallReactionLineStartX = anotherBallPos.x;
                anotherBallReactionLineStartY = anotherBallPos.y;
                anotherBallReactionLineEndX = anotherBallReactionLineStartX + (collisionReactionalChanges.vX2 * 0.5);
                anotherBallReactionLineEndY = anotherBallReactionLineStartY + (collisionReactionalChanges.vY2 * 0.5);
            }
            else {
                // TGC needs to be drawn in front of a cushion
                var circlePoint = this.calculateTgcPositionInFrontOfCushion(angle, sinAngle, cosAngle, ball0, table);
                endX = circlePoint.x;
                endY = circlePoint.y;
                ball0ReactionLineEndX = endX;
                ball0ReactionLineEndY = endY;

                anotherBallReactionLineStartX = endX;
                anotherBallReactionLineStartY = endY;
                anotherBallReactionLineEndX = endX;
                anotherBallReactionLineEndY = endY;
                //endX = ball0Pos.x + (Math.cos(angle) * controlRadius);
                //endY = ball0Pos.y + (Math.sin(angle) * controlRadius);
            }

            // update vertices (dashed line)
            this.mesh.geometry.vertices[0].x = ball0Pos.x;
            this.mesh.geometry.vertices[0].y = ball0Pos.y;
            this.mesh.geometry.vertices[1].x = endX;
            this.mesh.geometry.vertices[1].y = endY;
            this.mesh.geometry.vertices[2].x = ball0ReactionLineEndX;
            this.mesh.geometry.vertices[2].y = ball0ReactionLineEndY;
            this.mesh.geometry.verticesNeedUpdate = true;

            // update vertices of meshAnotherBallReactionLine if current orientation will lead to a collision
            var anotherBallReactionLineVertices = this.meshAnotherBallReactionLine.geometry.vertices;
            anotherBallReactionLineVertices[0].x = anotherBallReactionLineStartX;
            anotherBallReactionLineVertices[0].y = anotherBallReactionLineStartY;
            anotherBallReactionLineVertices[1].x = anotherBallReactionLineEndX;
            anotherBallReactionLineVertices[1].y = anotherBallReactionLineEndY;
            this.meshAnotherBallReactionLine.geometry.verticesNeedUpdate = true;


            // update TGC
            this.meshCircle.position.x = endX;
            this.meshCircle.position.y = endY;
        },

        calculateTgcPositionInFrontOfCushion: function(angle, sinAngle, cosAngle, ball0, table) {
            /**
             * Basic idea:
             * We differentiate between the 4 quadrants around the position of ball0. We use the angle between the
             * current mouse position and ball0's position to determine which quadrant to consider. Based on the chosen
             * quadrant we use the trigonometric relations in conjunction with the table dimensions to calculate the
             * position of the target guide circle just in front of the cushions, in case that there are no colliding balls
             * on the straight line between ball0 and any other ball.
             *
             * Most likely there is a much more elegant solution for this problem. But this one seems to be more
             * understandable since it is very explicit.
             */

            var obj = {};

            var ball0Pos = ball0.mesh.position;
            var gk, ak, hyp, tmp;
            var maxX = table.getPlayingFieldWidth() / 2;
            var maxY = table.getPlayingFieldHeight() / 2;
            var halfPi = Math.PI / 2;

            // bottom-left quadrant
            if (angle >= 0 && angle <= halfPi) {
                ak = maxX - ball0.radius - ball0Pos.x;
                hyp= ak / cosAngle;
                gk = hyp * sinAngle;
                tmp= gk + ball0Pos.y;

                if (tmp < (maxY - ball0.radius)) {
                    obj.x = maxX - ball0.radius;
                    obj.y = tmp;
                }
                else {
                    gk = maxY - ball0.radius - ball0Pos.y;
                    hyp= gk / sinAngle;
                    ak = hyp * cosAngle;

                    obj.x = ak + ball0Pos.x;
                    obj.y = maxY - ball0.radius;
                }
            }

            // bottom-right quadrant
            else if (angle > halfPi && angle <= Math.PI) {
                ak = ball0Pos.x + maxX - ball0.radius;
                hyp= ak / cosAngle;
                gk = hyp * sinAngle;
                tmp= -gk + ball0Pos.y;

                if (tmp < (maxY - ball0.radius)) {
                    obj.x = -maxX + ball0.radius;
                    obj.y = tmp;
                }
                else {
                    gk = maxY - ball0.radius - ball0Pos.y;
                    hyp= gk / sinAngle;
                    ak = hyp * cosAngle;

                    obj.x = ak + ball0Pos.x;
                    obj.y = maxY - ball0.radius;
                }
            }

            // top-left quadrant
            else if (angle < 0 && angle >= -halfPi) {
                ak = maxX - ball0.radius - ball0Pos.x;
                hyp= ak / cosAngle;
                gk = hyp * sinAngle;
                tmp= gk + ball0Pos.y;

                if (tmp > (-maxY + ball0.radius)) {
                    obj.x = maxX - ball0.radius;
                    obj.y = tmp;
                }
                else {
                    gk = ball0Pos.y + maxY - ball0.radius;
                    hyp= gk / sinAngle;
                    ak = hyp * cosAngle;

                    obj.x = -ak + ball0Pos.x;
                    obj.y = -maxY + ball0.radius;
                }
            }

            // top-right quadrant
            else {
                ak = ball0Pos.x + maxX - ball0.radius;
                hyp= ak / cosAngle;
                gk = hyp * sinAngle;
                tmp= -gk + ball0Pos.y;

                if (tmp > (-maxY + ball0.radius)) {
                    obj.x = -maxX + ball0.radius;
                    obj.y = tmp;
                }
                else {
                    gk = ball0Pos.y + maxY - ball0.radius;
                    hyp= gk / sinAngle;
                    ak = hyp * cosAngle;

                    obj.x = -ak + ball0Pos.x;
                    obj.y = -maxY + ball0.radius;
                }
            }

            return obj;
        }
    });

})(require('../basics/foundation'), require('../basics/log'), require('./helpers/collision_helper'));
