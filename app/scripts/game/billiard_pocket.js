module.exports = (function(Hooray, Logger) {
    "use strict";

    return Hooray.Class({
        init: function(id, x, y, radius) {
            Logger.log('A new Billiard.Pocket instance has been created!');
            this.id = id;
            this.x = x;
            this.y = y;
            this.radius = radius;

            /**
             * !!!
             * A Billiard.Pocket object will be augmented with the following properties during initialization:
             * * * mesh
             * !!!
             */
        },

        augment: function(prop, val) {
            this[prop] = val;
        }
    });

})(require('../basics/foundation'), require('../basics/log'));
