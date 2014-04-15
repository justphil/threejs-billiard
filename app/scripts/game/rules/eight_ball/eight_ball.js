module.exports = (function(Hooray, Logger) {
    "use strict";

    return Hooray.Class({
        init: function() {
            Logger.log('A new Billiard.Rules.EightBall instance has been created!');

            this.radius = 20;

            this.ballIdTpl = 'images/ball#.jpg';
            var rack = this._getRack();
            this.balls = this._getRackPositions(rack);

            this.mass = 1;


            /*this.balls = {
             'images/ball0.jpg' : {x: -480 + (0*2+1)*this.radius, y: 0},
             'images/ball1.jpg' : {x: -480 + (1*2+1)*this.radius, y: 0},
             'images/ball2.jpg' : {x: -480 + (2*2+1)*this.radius, y: 0},
             'images/ball3.jpg' : {x: -480 + (3*2+1)*this.radius, y: 0},
             'images/ball4.jpg' : {x: -480 + (4*2+1)*this.radius, y: 0},
             'images/ball5.jpg' : {x: -480 + (5*2+1)*this.radius, y: 0},
             'images/ball6.jpg' : {x: -480 + (6*2+1)*this.radius, y: 0},
             'images/ball7.jpg' : {x: -480 + (7*2+1)*this.radius, y: 0},
             'images/ball8.jpg' : {x: -480 + (8*2+1)*this.radius, y: 0},
             'images/ball9.jpg' : {x: -480 + (9*2+1)*this.radius, y: 0},
             'images/ball10.jpg': {x: -480 + (10*2+1)*this.radius, y: 0},
             'images/ball11.jpg': {x: -480 + (11*2+1)*this.radius, y: 0},
             'images/ball12.jpg': {x: -480 + (12*2+1)*this.radius, y: 0},
             'images/ball13.jpg': {x: -480 + (13*2+1)*this.radius, y: 0},
             'images/ball14.jpg': {x: -480 + (14*2+1)*this.radius, y: 0},
             'images/ball15.jpg': {x: -480 + (15*2+1)*this.radius, y: 0}


             // 'images/ball14.jpg': {x: -480 + this.radius, y: 18},
             // 'images/ball15.jpg': {x:  480 - this.radius, y: -18}
             };*/
        },

        _id: function(n) {
            if (Hooray.isUndefined(this.ballIdTpl)) {
                throw new Error('this.ballIdTpl is not defined!');
            }

            return this.ballIdTpl.replace('#', n);
        },

        _getRack: function() {
            var t = this;

            return [
                [t._id(1),  t._id(9), t._id(11), t._id(3), t._id(14)],
                [t._id(10), t._id(8), t._id(13), t._id(6)],
                [t._id(2),  t._id(7), t._id(5)],
                [t._id(15), t._id(12)],
                [t._id(4)]
            ];
        },

        _getRackPositions: function(rack) {
            var balls = {};

            var rackRotation = -30 * (Math.PI / 180);
            var offsetX = 150,
                offsetY = 0,
                rackOffsetX = 0,
                rackOffsetY = 0,
                ballId, x, y;

            for (var i = 0; i < rack.length; i++) {
                rackOffsetX = i * Math.cos(-1 * rackRotation) * (this.radius + 1) * 2;
                rackOffsetY = i * Math.sin(-1 * rackRotation) * (this.radius + 1) * 2;

                for (var j = 0; j < rack[i].length; j++) {
                    ballId = rack[i][j];

                    if (!i && !j) {
                        // add white ball additionally to rack balls
                        balls[this._id(0)] = {
                            x: -300,
                            y: 0
                        };
                    }

                    x = offsetX + rackOffsetX + Math.cos(rackRotation) * (this.radius + 1) * 2 * j;
                    y = offsetY + rackOffsetY + Math.sin(rackRotation) * (this.radius + 1) * 2 * j;

                    balls[ballId] = {
                        x: x,
                        y: y
                    };
                }
            }

            return balls;
        },

        /* Public Interface */
        getBalls: function() {
            // return a cloned object
            var obj = {},
                prop;

            for (prop in this.balls) {
                if (this.balls.hasOwnProperty(prop)) {
                    obj[prop] = this.balls[prop];
                }
            }

            return obj;
        },

        getBallRadius: function() {
            return this.radius;
        },

        getBallMass: function() {
            return this.mass;
        }
    });

})(require('../../../basics/foundation'), require('../../../basics/log'));
