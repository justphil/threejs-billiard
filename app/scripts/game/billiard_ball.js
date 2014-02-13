(function(W, Hooray) {
    "use strict";

    var Billiard = Hooray.Namespace('Billiard', 'Billiard');
    Billiard.Ball = Hooray.Class({
        init: function(id, initX, initY, radius) {
            Hooray.log('A new Billiard.Ball instance has been created with id "'+id+'"!');
            this.id     = id;
            this.initX  = initX;
            this.initY  = initY;
            this.radius = radius;

            this.vX     = 4;
            this.vY     = -3;

            this.rotationHelper = Billiard.Helper.RotationHelper;

            // !!! A Billiard.Ball object will be augmented with a mesh property during initialization !!!
        },

        translate: function() {
            this.mesh.position.x += this.vX;
            this.mesh.position.y += this.vY;
        },

        rotate: function() {
            this.rotationHelper.rotateAroundWorldAxisX(this.mesh, -this.vY / this.radius);
            this.rotationHelper.rotateAroundWorldAxisY(this.mesh, this.vX / this.radius);
        },

        handleCushionCollision: function(table) {
            var m = this.mesh,
                r = this.radius,
                halfWidth  = table.getPlayingFieldWidth()  / 2,
                halfHeight = table.getPlayingFieldHeight() / 2;

            if (m.position.x+r > halfWidth) {
                m.position.x = halfWidth - r;
                this.vX *= -1;
            }
            else if (m.position.x-r < -halfWidth) {
                m.position.x = -halfWidth + r;
                this.vX *= -1;
            }

            if (m.position.y+r > halfHeight) {
                m.position.y = halfHeight - r;
                this.vY *= -1;
            }
            else if (m.position.y-r < -halfHeight) {
                m.position.y = -halfHeight + r;
                this.vY *= -1;
            }
        }
    });
})(window, Hooray);
