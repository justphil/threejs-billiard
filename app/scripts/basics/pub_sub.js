module.exports = (function(Hooray) {
    "use strict";

    return Hooray.Class({
        init: function() {
            // hash of arrays of callback functions
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
            var t       = this.topics[topic],
                that    = this,
                args    = Array.prototype.slice.call(arguments),
                i;

            if (!Hooray.isUndefined(t)) {
                i = t.length;

                while (i--) {
                    // prevent mutable variable i to be accessible from closure by using IIFE
                    (function() {
                        var callbackFn = t[i];
                        setTimeout(function() {
                            callbackFn.apply(that, args.slice(1));
                        }, 0);
                    })();
                }
            }

            return this;
        },

        /* _NOT_INTENDED_FOR_USE_ function for test purposes */
        __getTopics: function() {
            // return shallow copy of the internal data structure
            var obj = {},
                topic;

            for (topic in this.topics) {
                if (this.topics.hasOwnProperty(topic)) {
                    obj[topic] = this.topics[topic];
                }
            }

            return obj;
        }
    });
})(require('./foundation'));
