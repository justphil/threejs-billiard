(function(W, Hooray) {
    "use strict";

    Hooray.PubSub = Hooray.Class({
        init: function() {
            this.topics = {};
        },

        subscribe: function(topic, callbackFn) {
            var t = this.topics[topic];

            if (Hooray.isUndefined(t)) {
                t = [];
                this.topics[topic] = t;
            }

            t.push(callbackFn);

            return this;
        },

        unsubscribe: function(topic, callbackFn) {
            var t = this.topics[topic],
                i;

            if (!Hooray.isUndefined(t)) {
                i = t.length;

                while (i--) {
                    if (t[i] === callbackFn) {
                        t.splice(i, 1);
                    }
                }
            }

            return this;
        },

        publish: function(topic) {
            var t = this.topics[topic],
                i;

            if (!Hooray.isUndefined(t)) {
                i = t.length;

                while (i--) {
                    t[i].apply(this, arguments);
                }
            }

            return this;
        }
    });
})(window, Hooray);
