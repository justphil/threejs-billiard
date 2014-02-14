(function(W, Hooray) {
    "use strict";

    var doLog = true;

    var log = function() {
        if (doLog) {
            console.log.apply(console, arguments);
        }
    };

    Hooray.define('', '', 'log', log);
})(window, Hooray);
