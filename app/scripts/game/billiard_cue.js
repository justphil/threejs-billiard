module.exports = (function(Hooray, Logger, THREE, MouseInput, TargetGuide) {
    "use strict";

    return Hooray.Class({
        init: function(playerId, table) {
            this.id = 'cue_' + playerId;
            this.table = table;
            Logger.log('A new Billiard.Cue instance has been created with id "'+this.id+'"!');

            this.controlRadius = 270;

            this.otherBalls = [];

            this.distanceTopLeftToBottomRight = 0;

            this.targetGuide = new TargetGuide();

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

                MouseInput.registerClickHandler(val.domElement, function() {
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

                // angle, ball0, otherBalls, distanceTopLeftToBottomRight, table
                this.targetGuide.update(
                    angle, this.ball0, this.otherBalls, this.distanceTopLeftToBottomRight, this.table
                );
            }
            else {
                this.mouse = MouseInput.capture(this.gameContainer.domElement);
            }
        },

        browserCoordsToThreeCoords: MouseInput.browserCoordsToThreeCoords
    });

})(
    require('../basics/foundation'),
    require('../basics/log'),
    require('three'),
    require('../basics/input'),
    require('./billiard_target_guide')
);
