(function(W, Hooray) {
    "use strict";

    Hooray.defineClass('Billiard', '', 'Cue', {
        init: function(playerId) {
            this.id = 'cue_' + playerId;
            Hooray.log('A new Billiard.Cue instance has been created with id "'+this.id+'"!');

            this.controlRadius = 270;

            this.otherBalls = [];

            this.distanceTopLeftToBottomRight = 0;

            this.targetGuide = new Billiard.TargetGuide(this.controlRadius);

            this.collisionHelper = Billiard.Helper.CollisionHelper;

            /**
             * !!!
             * A Billiard.Cue object will be augmented with the following properties during initialization:
             * * * mesh
             * * * gameContainer
             * * * ball0
             * * * otherBalls (will be populated with all balls except ball0)
             * * * distanceTopLeftToBottomRight (will be updated when gameContainer is set)
             * !!!
             */
        },

        augment: function(prop, val) {
            this[prop] = val;

            var that = this;

            if (prop === 'gameContainer') {
                var topLeft = new THREE.Vector2( -val.width/2, val.height/2 );
                var bottomRight = new THREE.Vector2( val.width/2, -val.height/2 );
                that.distanceTopLeftToBottomRight = topLeft.distanceTo(bottomRight);

                Hooray.Input.Mouse.registerClickHandler(val.domElement, function() {
                    var angle = that.mesh.rotation.z;
                    that.ball0.vX = 20 * Math.cos(angle);
                    that.ball0.vY = 20 * Math.sin(angle);
                });
            }
        },

        update: function() {
            if (this.mouse) {
                var cuePos = this.mesh.position;
                var ball0Pos = this.ball0.mesh.position;
                var mousePos = this.browserCoordsToThreeCoords(
                    this.mouse.x, this.mouse.y,
                    this.gameContainer.width, this.gameContainer.height
                );
                var dx = ball0Pos.x - mousePos.x;
                var dy = ball0Pos.y - mousePos.y;
                var angle = Math.atan2(dy, dx);

                cuePos.x = ball0Pos.x + (Math.cos(angle + Math.PI) * this.controlRadius);
                cuePos.y = ball0Pos.y + (Math.sin(angle + Math.PI) * this.controlRadius);

                this.mesh.rotation.z = angle;

                // check if the target guide circle intersects with a ball and determine the point

                var i, n, t, b, endX, endY, ob = this.otherBalls;
                var fakeVx = this.distanceTopLeftToBottomRight * Math.cos(angle);
                var fakeVy = this.distanceTopLeftToBottomRight * Math.sin(angle);
                for (i = 0, n = ob.length; i < n; i++) {
                    b = ob[i];
                    // x1, y1, vX1, vY1, r1,
                    // x2, y2, vX2, vY2, r2
                    t = this.collisionHelper.getCollisionTime(
                        ball0Pos.x, ball0Pos.y,
                        fakeVx,
                        fakeVy,
                        this.ball0.radius,
                        b.mesh.position.x, b.mesh.position.y, 0, 0, b.radius
                    );

                    if (t !== null && t >= 0 && t <= 1) {
                        endX = ball0Pos.x + t * fakeVx;
                        endY = ball0Pos.y + t * fakeVy;
                        //console.log(endX, endY);
                        break;
                    }
                    else {
                        endX = ball0Pos.x + (Math.cos(angle) * this.controlRadius);
                        endY = ball0Pos.y + (Math.sin(angle) * this.controlRadius);
                    }
                }

                this.targetGuide.update(
                    ball0Pos,
                    endX,
                    endY
                );
            }
            else {
                this.mouse = Hooray.Input.Mouse.capture(this.gameContainer.domElement);
            }
        },

        browserCoordsToThreeCoords: Hooray.Input.Mouse.browserCoordsToThreeCoords
    });

})(window, Hooray);
