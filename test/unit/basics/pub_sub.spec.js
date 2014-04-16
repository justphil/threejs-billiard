"use strict";

describe('[Hooray PubSub]', function() {

    var pubSub,
        testTopic = 'test',
        PubSub = require('../../../app/scripts/basics/pub_sub');

    beforeEach(function() {
        pubSub = new PubSub();
    });

    describe('Public API', function() {
        it('should contain a subscribe() function', function() {
            expect(pubSub.subscribe()).toBeDefined();
        });

        it('should contain a unsubscribe() function', function() {
            expect(pubSub.unsubscribe()).toBeDefined();
        });

        it('should contain a publish() function', function() {
            expect(pubSub.publish()).toBeDefined();
        });
    });

    describe('subscribe()', function() {
        it('should properly subscribe the passed callback to the passed topic', function() {
            var callbackFn = function() {},
                anotherCallbackFn = function() {},
                aanotherCallbackFn = function() {},
                anotherTopic = testTopic + 'test',
                topics;

            // subscribe a callback to a topic
            pubSub.subscribe(testTopic, callbackFn);

            topics = pubSub.__getTopics();
            expect(Object.keys(topics)).toEqual([testTopic]);
            expect(topics[testTopic].length).toBe(1);
            expect(topics[testTopic][0]).toBe(callbackFn);

            // subscribe another callback to the same topic
            pubSub.subscribe(testTopic, anotherCallbackFn);

            topics = pubSub.__getTopics();
            expect(Object.keys(topics)).toEqual([testTopic]);
            expect(topics[testTopic].length).toBe(2);
            expect(topics[testTopic][1]).toBe(anotherCallbackFn);

            // subscribe a callback to another topic
            pubSub.subscribe(anotherTopic, aanotherCallbackFn);

            topics = pubSub.__getTopics();
            expect(Object.keys(topics).length).toBe(2);
            expect(topics[anotherTopic].length).toBe(1);
            expect(topics[anotherTopic][0]).toBe(aanotherCallbackFn);
        });
    });

    describe('unsubscribe()', function() {
        it('should properly subscribe the passed callback to the passed topic', function() {
            var callbackFn = function() {},
                anotherCallbackFn = function() {},
                aanotherCallbackFn = function() {},
                anotherTopic = testTopic + 'test',
                topics;

            // subscribe callbacks to topics
            pubSub.subscribe(testTopic, callbackFn);
            pubSub.subscribe(testTopic, anotherCallbackFn);
            pubSub.subscribe(anotherTopic, aanotherCallbackFn);

            topics = pubSub.__getTopics();

            expect(topics[testTopic].length).toBe(2);
            expect(topics[anotherTopic].length).toBe(1);

            // unsubscribe one of them
            pubSub.unsubscribe(testTopic, callbackFn);
            topics = pubSub.__getTopics();
            expect(topics[testTopic].length).toBe(1);
            expect(topics[anotherTopic].length).toBe(1);

            // and another one
            pubSub.unsubscribe(anotherTopic, aanotherCallbackFn);
            topics = pubSub.__getTopics();
            expect(topics[testTopic].length).toBe(1);
            expect(topics[anotherTopic].length).toBe(0);

            // and one without a matching callbackFn
            pubSub.unsubscribe(testTopic, callbackFn);
            topics = pubSub.__getTopics();
            expect(topics[testTopic].length).toBe(1);
            expect(topics[anotherTopic].length).toBe(0);
        });
    });

    describe('publish()', function() {
        it('should properly publish an event on a topic', function() {
            var result = 0,
                callbackFn = function(a, b, c) {
                    result = a + b + c;
                };

            runs(function() {
                pubSub.subscribe(testTopic, callbackFn);
                pubSub.publish(testTopic, 1, 2, 3);
            });

            waitsFor(function() {
                return result > 0;
            }, 'The result should be greater than 0.', 1000);

            runs(function() {
                expect(result).toBe(6);
            });
        });
    });

});
