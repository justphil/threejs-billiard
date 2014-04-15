module.exports = (function() {
    "use strict";

    /* Simple helpers */
    function isFunction(value) {
        return typeof value === 'function';
    }

    function isObject(value) {
        return typeof value === 'object';
    }

    function isUndefined(value) {
        return typeof value === 'undefined';
    }

    /* Simple class system */
    function Class(configObj, superClassConstructor) {
        if (isUndefined(configObj)) {
            configObj = {};
        }

        var constructor = isFunction(configObj.init) ? configObj.init : function() {},
            isSuperClassConstructor = isFunction(superClassConstructor),
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
            if (configObj.hasOwnProperty(prop) && isFunction(configObj[prop]) && prop !== 'init') {
                constructor.prototype[prop] = configObj[prop];
            }
        }

        wrapper.prototype = constructor.prototype;

        return wrapper;
    }

    // just to clarify the class extension possibility
    function extendClass(superClassConstructor, configObj) {
        return Class(configObj, superClassConstructor);
    }

    return {
        isFunction: isFunction,
        isObject: isObject,
        isUndefined: isUndefined,
        Class: Class,
        extendClass: extendClass
    };
})();
