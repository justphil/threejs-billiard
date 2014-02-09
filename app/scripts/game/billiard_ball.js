(function(W, T, Hooray) {
    "use strict";

    var Billiard = Hooray.Namespace('Billiard', 'Billiard');
    Billiard.Ball = Hooray.Class({
        init: function() {
            console.log('A new Billiard.Ball instance has been created!');
        }
    });
})(window, THREE, Hooray);
