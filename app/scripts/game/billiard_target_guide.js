(function(W, Hooray) {
    "use strict";

    Hooray.defineClass('Billiard', '', 'TargetGuide', {
        init: function() {
            Hooray.log('A new Billiard.TargetGuide instance has been created!');
            this.collisionHelper = Billiard.Helper.CollisionHelper;

            /**
             * !!!
             * A Billiard.TargetGuide object will be augmented with the following properties during initialization:
             * * * mesh
             * * * meshCircle
             * !!!
             */
        },

        augment: function(prop, val) {
            this[prop] = val;
        },

        update: function(angle, ball0, otherBalls, distanceTopLeftToBottomRight, controlRadius) {
            /**
             * Basic idea:
             * Among the other parameters the Cue object passes us the distance from the top-left corner to
             * the bottom-right corner (main diagonal). This is the longest distance between two points on the playing field.
             * We use this distance to cast a ray from the white ball in the direction of the current cue orientation.
             * If there is an intersection between the ray and a ball we take this ball into account for displaying
             * the target guide circle (TGC) for the frame we are about to calculate.
             * But we are only interested in the first ball intersection. That's why we sort all ball intersections
             * by their occurrence time and only consider the first one for the calculation of the TGC's position.
             */

            var i, n, t, b, endX, endY;
            var fakeVx = distanceTopLeftToBottomRight * Math.cos(angle);
            var fakeVy = distanceTopLeftToBottomRight * Math.sin(angle);
            var ball0Pos = ball0.mesh.position;
            var timeToConsider = 1;
            var indexOfRelevantBall = -1;

            for (i = 0, n = otherBalls.length; i < n; i++) {
                b = otherBalls[i];
                // Parameters:
                // x1, y1, vX1, vY1, r1,
                // x2, y2, vX2, vY2, r2
                t = this.collisionHelper.getCollisionTime(
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
                endX = ball0Pos.x + timeToConsider * fakeVx;
                endY = ball0Pos.y + timeToConsider * fakeVy;
            }
            else {
                endX = ball0Pos.x + (Math.cos(angle) * controlRadius);
                endY = ball0Pos.y + (Math.sin(angle) * controlRadius);
            }

            // update vertices (dashed line)
            this.mesh.geometry.vertices[0].x = ball0Pos.x;
            this.mesh.geometry.vertices[0].y = ball0Pos.y;
            this.mesh.geometry.vertices[1].x = endX;
            this.mesh.geometry.vertices[1].y = endY;
            this.mesh.geometry.verticesNeedUpdate = true;

            // update TGC
            this.meshCircle.position.x = endX;
            this.meshCircle.position.y = endY;
        }
    });

})(window, Hooray);
