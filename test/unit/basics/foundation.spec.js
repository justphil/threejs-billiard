"use strict";

describe('[Hooray Foundation]', function() {

    describe('Public API', function() {
        it('should define a public Hooray namespace', function() {
            expect(Hooray).toBeDefined();
        });

        it('should contain a isFunction() function', function() {
            expect(Hooray.isFunction).toBeDefined();
        });

        it('should contain a isObject() function', function() {
            expect(Hooray.isObject).toBeDefined();
        });

        it('should contain a isUndefined() function', function() {
            expect(Hooray.isUndefined).toBeDefined();
        });

        it('should contain a Namespace() function', function() {
            expect(Hooray.Namespace).toBeDefined();
        });

        it('should contain a defineClass() function', function() {
            expect(Hooray.defineClass).toBeDefined();
        });

        it('should contain a extendClass() function', function() {
            expect(Hooray.extendClass).toBeDefined();
        });
    });

    describe('isFunction()', function() {
        it('should properly identify the passed param as a function', function() {
            expect(Hooray.isFunction(function() {})).toBe(true);
            expect(Hooray.isFunction(new Function())).toBe(true);
            expect(Hooray.isFunction({})).toBe(false);
            expect(Hooray.isFunction([])).toBe(false);
            expect(Hooray.isFunction('test')).toBe(false);
            expect(Hooray.isFunction(false)).toBe(false);
            expect(Hooray.isFunction(3)).toBe(false);
            expect(Hooray.isFunction()).toBe(false);
        });
    });

    describe('isObject()', function() {
        it('should properly identify the passed param as an object', function() {
            expect(Hooray.isObject({})).toBe(true);
            expect(Hooray.isObject([])).toBe(true);
            expect(Hooray.isObject(new String('test'))).toBe(true);
            expect(Hooray.isObject(new Number(3))).toBe(true);
            expect(Hooray.isObject(new Boolean(true))).toBe(true);
            expect(Hooray.isObject('test')).toBe(false);
            expect(Hooray.isObject(false)).toBe(false);
            expect(Hooray.isObject(3)).toBe(false);
            expect(Hooray.isObject()).toBe(false);
        });
    });

    describe('isUndefined()', function() {
        it('should properly identify whether the passed param is undefined', function() {
            var x,
                y = 3;

            expect(Hooray.isUndefined()).toBe(true);
            expect(Hooray.isUndefined(x)).toBe(true);
            expect(Hooray.isUndefined(y)).toBe(false);
            expect(Hooray.isUndefined([])).toBe(false);
            expect(Hooray.isUndefined({})).toBe(false);
            expect(Hooray.isUndefined(function() {})).toBe(false);
        });
    });

    describe('Namespace()', function() {
        var testNamespace = 'testNamespace';

        afterEach(function() {
            delete window[testNamespace];
            delete Hooray[testNamespace];
        });

        it('should properly create new parent namespaces', function() {
            expect(window[testNamespace]).toBeUndefined();
            var c = Hooray.Namespace('a.b.c', testNamespace);

            expect(window[testNamespace].a).toBeDefined();
            expect(window[testNamespace].a.b).toBeDefined();
            expect(window[testNamespace].a.b.c).toBeDefined();
            expect(window[testNamespace].a.b.c).toBe(c);
        });

        it('should properly create new namespaces within Hooray', function() {
            expect(Hooray[testNamespace]).toBeUndefined();
            var c = Hooray.Namespace(testNamespace + '.a.b.c');

            expect(Hooray[testNamespace].a).toBeDefined();
            expect(Hooray[testNamespace].a.b).toBeDefined();
            expect(Hooray[testNamespace].a.b.c).toBeDefined();
            expect(Hooray[testNamespace].a.b.c).toBe(c);
        });

        it('should not overwrite already created namespaces', function() {
            expect(Hooray[testNamespace]).toBeUndefined();
            var c1 = Hooray.Namespace(testNamespace);

            expect(Hooray[testNamespace]).toBeDefined();

            var c2 = Hooray.Namespace(testNamespace);

            expect(c1).toBe(c2);
            expect(c2).toBe(Hooray.Namespace(testNamespace));
        });
    });

    describe('defineClass()', function() {
        var globalNamespace = 'test';
        var Person;

        beforeEach(function() {
            Person = undefined;
            delete window[globalNamespace];
        });

        it('should be able to create plain classes (without providing a config object)', function() {
            Person = Hooray.defineClass(globalNamespace, '', 'Person');
            var p = new Person();
            expect(typeof p).toBe('object');
            expect(p instanceof Person).toBe(true);
        });

        it('should be able to create classes with a constructor (init)', function() {
            Person = Hooray.defineClass(globalNamespace, '', 'Person', {
                init: function(name, age) {
                    this.name = name;
                    this.age = age;
                }
            });
            var p = new Person('test', 123);
            expect(p.name).toBe('test');
            expect(p.age).toBe(123);
        });

        it('should be able to create classes with instance methods', function() {
            Person = Hooray.defineClass(globalNamespace, '', 'Person', {
                getName: function() {
                    return 'test';
                },
                getAge: function() {
                    return 123;
                }
            });
            var p = new Person();

            // make sure that the functions are defined on the prototype
            expect(Object.getOwnPropertyNames(p).length).toBe(0);
            expect(Object.getPrototypeOf(p).getName).toBeDefined();
            expect(Object.getPrototypeOf(p).getAge).toBeDefined();
            expect(p.getName()).toBe('test');
            expect(p.getAge()).toBe(123);
        });

        it('should be able to extend classes', function() {
            Person = Hooray.defineClass(globalNamespace, '', 'Person', {
                init: function(name, age) {
                    this.name = name;
                    this.age = age;
                },
                getName: function() {
                    return this.name;
                },
                getAge: function() {
                    return this.age;
                }
            });

            var Employee = Hooray.extendClass(globalNamespace, '', 'Employee', Person, {
                init: function(name, age, salary) {
                    this.salary = salary;
                },
                getSalary: function() {
                    return this.salary;
                }
            });

            var e = new Employee('test', 123, 48000);

            // e should be an instance of Person and Employee
            expect(e instanceof Employee).toBe(true);
            expect(e instanceof Person).toBe(true);

            // instance properties (object state) should be defined on the object
            expect(Object.getOwnPropertyNames(e).length).toBe(3); // name, age, salary

            // instance methods should be defined on the prototype
            expect(Object.getPrototypeOf(e).getName).toBeDefined();
            expect(Object.getPrototypeOf(e).getAge).toBeDefined();
            expect(Object.getPrototypeOf(e).getSalary).toBeDefined();
            expect(e.getName()).toBe('test');
            expect(e.getAge()).toBe(123);
            expect(e.getSalary()).toBe(48000);
        });
    });

});
