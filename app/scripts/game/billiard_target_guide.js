(function(W, Hooray) {
    "use strict";

    Hooray.defineClass('Billiard', '', 'TargetGuide', {
        init: function(controlRadius) {
            Hooray.log('A new Billiard.TargetGuide instance has been created!');

            this.controlRadius = controlRadius;

            /**
             * !!!
             * A Billiard.TargetGuide object will be augmented with the following properties during initialization:
             * * * mesh
             * !!!
             */
        },

        augment: function(prop, val) {
            this[prop] = val;
        },

        update: function(ball0Pos, endX, endY) {
            //this.mesh.position.x = ball0Pos.x;
            //this.mesh.position.y = ball0Pos.y;

            this.mesh.geometry.vertices[0].x = ball0Pos.x;
            this.mesh.geometry.vertices[0].y = ball0Pos.y;
            this.mesh.geometry.vertices[1].x = endX;
            this.mesh.geometry.vertices[1].y = endY;
            this.mesh.geometry.verticesNeedUpdate = true;

            //console.log('huhu', this.mesh.geometry.vertices);
        }
    });

})(window, Hooray);
