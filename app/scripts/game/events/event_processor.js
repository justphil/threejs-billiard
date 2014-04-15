module.exports = (function(Hooray, Logger, Events) {
    "use strict";

    return Hooray.Class({
        init: function(pubSub) {
            Logger.log('A new Billiard.Event.EventProcessor instance has been created!');
            this.pubSub = pubSub;
            this.registerHandlers(this.pubSub);
        },

        registerHandlers: function(pubSub) {
            pubSub.subscribe(Events.BALL_STOPPED_ROLLING, function(e) {
                Logger.log('[EventProcessor]', Events.BALL_STOPPED_ROLLING, e);
            })
        }
    });
})(require('../../basics/foundation'), require('../../basics/log'), require('./events'));
