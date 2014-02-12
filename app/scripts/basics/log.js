(function(W, Hooray) {
    "use strict";

    var log = true;

    Hooray.log = function() {
        if (log) {
            console.log.apply(console, arguments);
        }
    };
})(window, Hooray);
