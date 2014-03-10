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

        update: function(mousePos) {
            this.mesh.position.x = mousePos.x;
            this.mesh.position.y = mousePos.y;
        }
    });

})(window, Hooray);
