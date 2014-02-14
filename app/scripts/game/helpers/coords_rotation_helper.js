(function(W, Hooray) {
    "use strict";

    function rotateCoords(x, y, sin, cos, reverse) {
        return {
            x: (reverse) ? (x * cos + y * sin) : (x * cos - y * sin),
            y: (reverse) ? (y * cos - x * sin) : (y * cos + x * sin)
        };
    }

    Hooray.define('Billiard', 'Helper.CoordsRotationHelper', 'rotateCoords', rotateCoords);

})(window, Hooray);
