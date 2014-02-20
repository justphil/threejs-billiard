(function(W, Hooray) {
    "use strict";

    Hooray.defineClass('Billiard', 'Rules', 'EightBall', {
        init: function() {
            Hooray.log('A new Billiard.Rules.EightBall instance has been created!');

            this.radius = 20;

            this.mass = 1;

            this.balls = {
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


                /*'images/ball14.jpg': {x: -480 + this.radius, y: 15},
                'images/ball15.jpg': {x:  480 - this.radius, y: -15}*/
            };
        },

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

})(window, Hooray);
