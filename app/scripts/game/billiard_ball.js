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

            this.vX     = 1;
            this.vY     = 0;

            this.rotationHelper = Billiard.Game.RotationHelper;

            // !!! A Billiard.Ball object will be augmented with a mesh property during initialization !!!
        },

        translate: function() {
            this.mesh.position.x += this.vX;
            this.mesh.position.y += this.vY;
        },

        rotate: function() {
            this.rotationHelper.rotateAroundWorldAxisX(this.mesh, -this.vY / this.radius);
            this.rotationHelper.rotateAroundWorldAxisY(this.mesh, this.vX / this.radius);
        }
    });
})(window, Hooray);
