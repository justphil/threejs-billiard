module.exports = (function() {
    "use strict";

    var doLog = true;

    var log = function() {
        if (doLog) {
            console.log.apply(console, arguments);
        }
    };

    return {
        log: log
    }
})();
