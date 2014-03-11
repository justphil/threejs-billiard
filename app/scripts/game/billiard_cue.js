(function(W, Hooray) {
    "use strict";

    Hooray.defineClass('Billiard', '', 'Cue', {
        init: function(playerId) {
            this.id = 'cue_' + playerId;
            Hooray.log('A new Billiard.Cue instance has been created with id "'+this.id+'"!');

            this.controlRadius = 270;

            this.targetGuide = new Billiard.TargetGuide(this.controlRadius);

            /**
             * !!!
             * A Billiard.Cue object will be augmented with the following properties during initialization:
             * * * mesh
             * * * gameContainer
             * * * ball0
             * !!!
             */
        },

        augment: function(prop, val) {
            this[prop] = val;

            var that = this;

            if (prop === 'gameContainer') {
                Hooray.Input.Mouse.registerClickHandler(val.domElement, function() {
                    var angle = that.mesh.rotation.z;
                    that.ball0.vX = 20 * Math.cos(angle - (Math.PI / 2));
                    that.ball0.vY = 20 * Math.sin(angle - (Math.PI / 2));
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

                this.targetGuide.update(
                    ball0Pos,
                    ball0Pos.x + (Math.cos(angle) * this.controlRadius),
                    ball0Pos.y + (Math.sin(angle) * this.controlRadius),
                    this.mesh.rotation.z
                );
            }
            else {
                this.mouse = Hooray.Input.Mouse.capture(this.gameContainer.domElement);
            }
        },

        browserCoordsToThreeCoords: Hooray.Input.Mouse.browserCoordsToThreeCoords
    });

})(window, Hooray);
