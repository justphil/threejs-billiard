(function (W) {
    "use strict";

    var HOORAY = 'Hooray',
        Hooray = {};

    /* Simple helpers */
    Hooray.isFunction = function(value) {
        return typeof value === 'function';
    };

    Hooray.isObject = function(value) {
        return typeof value === 'object';
    };

    Hooray.isUndefined = function(value) {
        return typeof value === 'undefined';
    };

    Hooray.Namespace = function (nsString, parentNs) {
        var parts   = nsString.split('.'),
            parent  = (parentNs) ? W[parentNs] : Hooray,
            global  = (parentNs) ? parentNs : HOORAY,
            i;

        if (Hooray.isUndefined(parent)) {
            parent = {};
            W[parentNs] = parent;
        }

        if (parts[0] === global) {
            parts = parts.slice(1);
        }

        for (i = 0; i < parts.length; i++) {
            if (Hooray.isUndefined(parent[parts[i]])) {
                parent[parts[i]] = {};
            }
            parent = parent[parts[i]];
        }

        return parent;
    };

    /* Simple class system */
    Hooray.Class = function(configObj, superClassConstructor) {
        if (Hooray.isUndefined(configObj)) {
            configObj = {};
        }

        var constructor = Hooray.isFunction(configObj.init) ? configObj.init : function() {},
            isSuperClassConstructor = Hooray.isFunction(superClassConstructor),
            wrapper,
            prop;

        wrapper = function() {
            var obj;

            if (!(this instanceof constructor)) {
                //console.log('new-operator forgotten!');
                obj = Object.create(constructor.prototype);
            }
            else {
                //console.log('new-operator provided!');
                obj = this;
            }

            if (isSuperClassConstructor) {
                superClassConstructor.apply(obj, arguments);
            }

            constructor.apply(obj, arguments);
            return obj;
        };

        if (isSuperClassConstructor) {
            constructor.prototype = Object.create(superClassConstructor.prototype);
            constructor.prototype.constructor = constructor;
        }

        for (prop in configObj) {
            if (configObj.hasOwnProperty(prop) && Hooray.isFunction(configObj[prop]) && prop !== 'init') {
                constructor.prototype[prop] = configObj[prop];
            }
        }

        wrapper.prototype = constructor.prototype;

        return wrapper;
    };

    Hooray.Class.extend = function(superClassConstructor, configObj) {
        return Hooray.Class(configObj, superClassConstructor);
    };

    /* Register Hooray */
    if (W[HOORAY]) {
        throw new Error(
            '!!! The namespace "' + HOORAY + '" has already been set! This will probably lead to strange behaviour !!!'
        );
    }
    else {
        W[HOORAY] = Hooray;
    }
})(window);
