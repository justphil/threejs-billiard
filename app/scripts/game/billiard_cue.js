(function(W, Hooray) {
    "use strict";

    Hooray.defineClass('Billiard', '', 'Cue', {
        init: function(playerId) {
            this.id     = 'cue_' + playerId;
            Hooray.log('A new Billiard.Cue instance has been created with id "'+this.id+'"!');

            /**
             * !!!
             * A Billiard.Cue object will be augmented with the following properties during initialization:
             * * * mesh
             * * * gameContainerDomElement
             * !!!
             */
        },

        update: function() {
            if (this.mouse) {
                // impl update logic
            }
            else {
                if (this.gameContainerDomElement) {
                    this.mouse = Hooray.Input.Mouse.capture(this.gameContainerDomElement);
                }
            }
        }
    });

})(window, Hooray);
