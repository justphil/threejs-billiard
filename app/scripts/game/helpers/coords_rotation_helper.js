module.exports = (function() {
    "use strict";

    function rotateCoords(x, y, sin, cos, reverse) {
        return {
            x: (reverse) ? (x * cos + y * sin) : (x * cos - y * sin),
            y: (reverse) ? (y * cos - x * sin) : (y * cos + x * sin)
        };
    }

    return {
        rotateCoords: rotateCoords
    };

})();
