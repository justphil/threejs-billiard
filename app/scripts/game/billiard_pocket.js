(function(W, Hooray) {
    "use strict";

    Hooray.defineClass('Billiard', '', 'Pocket', {
        init: function(id, x, y, radius) {
            Hooray.log('A new Billiard.Pocket instance has been created!');
            this.id = id;
            this.x = x;
            this.y = y;
            this.radius = radius;

            /**
             * !!!
             * A Billiard.Pocket object will be augmented with the following properties during initialization:
             * * * mesh
             * !!!
             */
        },

        augment: function(prop, val) {
            this[prop] = val;
        }
    });

    Hooray.defineClass('Billiard', 'Pocket.DropState', 'Phase1', {
        init: function(ball, pocket) {
            Hooray.log('A new Billiard.Pocket.DropState.Phase1 instance has been created!');
            this.ball = ball;
            this.pocket = pocket;

            //this.ball.vX *= 0.5;
            //this.ball.vY *= 0.5;

            this.aX = 0;
            this.aY = 0;
            this.spring = 0.05;
            this.dropFriction = 0.9;

            this.scale = 0.03;
            this.minScale = 0.7;
        },

        proceed: function() {
            var ballPos = this.ball.mesh.position;

            var dx = this.pocket.mesh.position.x - ballPos.x,
                dy = this.pocket.mesh.position.y - ballPos.y,
                dist = Math.sqrt(dx * dx + dy * dy);

            if ( (dist + this.ball.radius) < this.pocket.radius ) {
                // the ball is now completely within the circle of the pocket
                //console.log('Completely within pocket!');
                if (this.ball.mesh.scale.x <= this.minScale) {

                }
            }

            this.aX = dx * this.spring;
            this.aY = dy * this.spring;

            this.ball.vX += this.aX;
            this.ball.vY += this.aY;

            this.ball.vX *= this.dropFriction;
            this.ball.vY *= this.dropFriction;

            ballPos.x += this.ball.vX;
            ballPos.y += this.ball.vY;

            this.ball.rotateByFraction(1);
            this.ball.rotateZ();

            if (this.ball.mesh.scale.x > this.minScale) {
                this.ball.mesh.scale.x -= this.scale;
                this.ball.mesh.scale.y -= this.scale;
                this.ball.mesh.scale.z -= this.scale;
            }
        }
    });

})(window, Hooray);
