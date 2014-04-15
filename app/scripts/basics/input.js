module.exports = (function() {
    "use strict";

    function capture(element) {
        var mouse               = {x: 0, y: 0, event: null},
            body_scrollLeft     = document.body.scrollLeft,
            element_scrollLeft  = document.documentElement.scrollLeft,
            body_scrollTop      = document.body.scrollTop,
            element_scrollTop   = document.documentElement.scrollTop,
            offsetLeft          = element.offsetLeft,
            offsetTop           = element.offsetTop;

        element.addEventListener('mousemove', function(event) {
            var x, y;

            if (event.pageX || event.pageY) {
                x = event.pageX;
                y = event.pageY;
            }
            else {
                x = event.clientX + body_scrollLeft + element_scrollLeft;
                y = event.clientY + body_scrollTop + element_scrollTop;
            }

            x -= offsetLeft;
            y -= offsetTop;

            mouse.x = x;
            mouse.y = y;
            mouse.event = event;
        }, false);

        return mouse;
    }

    function registerClickHandler(element, handler) {
        element.addEventListener('click', handler);
    }

    function browserCoordsToThreeCoords(x, y, gameContainerWidth, gameContainerHeight) {
        var obj = {};

        obj.x = x  - (gameContainerWidth / 2);
        obj.y = -y + (gameContainerHeight / 2);

        return obj;
    }

    return {
        capture: capture,
        registerClickHandler: registerClickHandler,
        browserCoordsToThreeCoords: browserCoordsToThreeCoords
    }
})();
