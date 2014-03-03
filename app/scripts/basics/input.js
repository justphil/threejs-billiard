(function(W, Hooray) {
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

    Hooray.define('', 'Input.Mouse', 'capture', capture);
})(window, Hooray);
