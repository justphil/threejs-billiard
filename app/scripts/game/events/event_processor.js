(function(W, Hooray) {
    "use strict";

    Hooray.defineClass('Billiard', 'Event', 'EventProcessor', {
        init: function(pubSub) {
            Hooray.log('A new Billiard.Event.EventProcessor instance has been created!');
            this.pubSub = pubSub;
            this.registerHandlers(this.pubSub);
        },

        registerHandlers: function(pubSub) {
            pubSub.subscribe(Billiard.Event.BALL_STOPPED_ROLLING, function(e) {
                Hooray.log('[EventProcessor]', Billiard.Event.BALL_STOPPED_ROLLING, e);
            })
        }
    });

})(window, Hooray);
