(function(W, Hooray) {
    "use strict";

    Hooray.defineClass('Billiard', '', 'Ball', {
        init: function(id, initX, initY, radius, mass, pubSub) {
            Hooray.log('A new Billiard.Ball instance has been created with id "'+id+'"!');

            this.id     = id;
            this.initX  = initX;
            this.initY  = initY;
            this.radius = radius;
            this.mass   = mass;

            this.momentOfInertiaSphere = (2/5) * this.mass * (this.radius * this.radius);
            //this.frictionCoefficientBillard = 0.2;
            //this.gravitationalConstant = 9.81;

            this.vX         = Math.round(Math.random() * 20);
            this.vY         = Math.round(Math.random() * 20);

            this.vAngular   = 0;
            this.vAngularZ  = 0;

            this.rotationHelper = Billiard.Helper.RotationHelper;
            this.coordsRotationHelper = Billiard.Helper.CoordsRotationHelper;

            this.pubSub = pubSub;

            // !!! A Billiard.Ball object will be augmented with a mesh property during initialization !!!
        },

        translate: function() {
            this.mesh.position.x += this.vX;
            this.mesh.position.y += this.vY;
        },

        rotate: function() {
            var generalFrictionFactor = 0;
            var friction = 0;
            var currentVelocity = this.getVelocity();
            var vAngle = this.getVelocityAngle();

            // check condition for perfect ball rotation/rolling
            if (this.isPerfectlyRotating()) {
                generalFrictionFactor = 0.011;

                // apply perfect ball rotation/rolling
                // aka angular velocity perfectly corresponds to distance travelled
                this.rotationHelper.rotateAroundWorldAxisX(this.mesh, -this.vY / this.radius);
                this.rotationHelper.rotateAroundWorldAxisY(this.mesh, this.vX / this.radius);
            }
            else {
                // here the ball is still sliding and due to sliding friction it progressively starts to rotate
                generalFrictionFactor = 0;

                // apply sliding friction
                //friction = this.frictionCoefficientBillard * this.mass * this.gravitationalConstant;
                friction = 0.055; // TODO: This friction should be calculated according to the physical rules!


                // due to sliding friction we need to apply the corresponding torque
                // apply torque, calculate the resulting angular acceleration and add it to angular velocity
                this.applyTorque(friction);

                this.rotationHelper.rotateAroundWorldAxisX(this.mesh, -this.vAngular * Math.sin(vAngle));
                this.rotationHelper.rotateAroundWorldAxisY(this.mesh, this.vAngular * Math.cos(vAngle));
            }

            friction = friction + (currentVelocity * generalFrictionFactor);
            this.applyAbsoluteFriction(friction, currentVelocity, vAngle, 0.05);
        },

        rotateZ: function() {
            // apply z rotation if available
            //var angularFriction = 0.0009;
            var angularFriction = 0.0025;
            if (this.vAngularZ !== 0) {
                this.rotationHelper.rotateAroundWorldAxisZ(this.mesh, this.vAngularZ);

                if (this.vAngularZ > 0) {
                    if ((this.vAngularZ - angularFriction) < 0) {
                        this.vAngularZ = 0;
                    }
                    else {
                        this.vAngularZ -= angularFriction;
                    }
                }
                else {
                    if ((this.vAngularZ + angularFriction) > 0) {
                        this.vAngularZ = 0;
                    }
                    else {
                        this.vAngularZ += angularFriction;
                    }
                }
            }
        },

        applyAbsoluteFriction: function(absoluteFriction, velocity, velocityAngle, stopThreshold) {
            var v       = (Hooray.isUndefined(velocity)) ? this.getVelocity() : velocity;
            var vAngle  = (Hooray.isUndefined(velocityAngle)) ? this.getVelocityAngle() : velocityAngle;
            var vBefore = v;
            var that    = this;


            if (v > absoluteFriction) {
                v -= absoluteFriction;

                if (Math.abs(v) < stopThreshold) {
                    v = 0;
                }
            }
            else {
                v = 0;
            }


            if (v > 0) {
                this.vX = Math.cos(vAngle) * v;
                this.vY = Math.sin(vAngle) * v;
            }
            else {
                this.vX = 0;
                this.vY = 0;

                if (v !== vBefore) {
                    this.pubSub.publish(
                        Billiard.Event.BALL_STOPPED_ROLLING,
                        {
                            id: that.id,
                            x: that.mesh.position.x,
                            y: that.mesh.position.y
                        }
                    );
                }
            }

            /*
            if (Math.abs(this.vX) < stopThreshold) {
                this.vX = 0;
            }

            if (Math.abs(this.vY) < stopThreshold) {
                this.vY = 0;
            }
            */
        },

        applyTorque: function(absoluteFriction) {
            var torque     = absoluteFriction * this.radius;
            this.vAngular += torque / this.momentOfInertiaSphere;
        },

        getVelocityAngle: function() {
            return Math.atan2(this.vY, this.vX);
        },

        getSquaredVelocity: function() {
            return this.vX * this.vX + this.vY * this.vY;
        },

        getVelocity: function(squaredVelocity) {
            var sv = (Hooray.isUndefined(squaredVelocity)) ? this.getSquaredVelocity() : squaredVelocity;
            return Math.sqrt(sv);
        },

        isPerfectlyRotating: function(velocity) {
            var v = (Hooray.isUndefined(velocity)) ? this.getVelocity() : velocity;
            // TODO: set vAngular to corresponding value if ball is perfectly rotating
            return this.vAngular * this.radius >= v;
        },

        handleCushionCollision: function(table) {
            var m = this.mesh,
                r = this.radius,
                halfWidth  = table.getPlayingFieldWidth()  / 2,
                halfHeight = table.getPlayingFieldHeight() / 2;

            if (m.position.x+r > halfWidth) {
                m.position.x = halfWidth - r;
                this.vX *= -1;
            }
            else if (m.position.x-r < -halfWidth) {
                m.position.x = -halfWidth + r;
                this.vX *= -1;
            }

            if (m.position.y+r > halfHeight) {
                m.position.y = halfHeight - r;
                this.vY *= -1;
            }
            else if (m.position.y-r < -halfHeight) {
                m.position.y = -halfHeight + r;
                this.vY *= -1;
            }
        },

        handleBallCollision: function(anotherBall) {
            var ball0 = this.mesh.position,
                ball1 = anotherBall.mesh.position;

            var dx = ball1.x - ball0.x,
                dy = ball1.y - ball0.y,
                dist = Math.sqrt(dx * dx + dy * dy);

            // check for collision based on radius
            if (dist < this.radius + anotherBall.radius) {
                var crh = this.coordsRotationHelper;

                // calculate angle, sine, and cosine
                var angle = Math.atan2(dy, dx),
                    sin = Math.sin(angle),
                    cos = Math.cos(angle),
                    e = 1,
                // rotate ball0's position
                    pos0 = {x: 0, y: 0}, //point
                // rotate ball1's position
                    pos1 = crh.rotateCoords(dx, dy, sin, cos, true),
                // rotate ball0's velocity
                    vel0 = crh.rotateCoords(this.vX, this.vY, sin, cos, true),
                // rotate ball1's velocity
                    vel1 = crh.rotateCoords(anotherBall.vX, anotherBall.vY, sin, cos, true);

                // apply conservation of momentum
                var tmp = 1 / (this.mass + anotherBall.mass);
                var newVxBall0 = (this.mass - e * anotherBall.mass) * vel0.x * tmp
                                    + (1 + e) * anotherBall.mass * vel1.x * tmp;

                var newVxBall1 = (1 + e) * this.mass * vel0.x * tmp
                                    + (anotherBall.mass - e * this.mass) * vel1.x * tmp;

                // apply friction due to oblique collision if it is an oblique collision
                if (this.isObliqueBallCollision(vel0.x, vel0.y, dx, dy)) {
                    //console.log('Oblique!');
                    var fiveSeventh = 5 / 7;

                    this.vAngularZ = -fiveSeventh * (vel0.y / this.radius);
                    anotherBall.vAngularZ = fiveSeventh * (vel1.y / anotherBall.radius);

                    //vel0.y = fiveSeventh * vel0.y;
                    //vel1.y = fiveSeventh * vel1.y;
                }

                // update position to avoid that objects become stuck together
                var absV = Math.abs(newVxBall0) + Math.abs(newVxBall1),
                    overlap = (this.radius + anotherBall.radius) - Math.abs(pos0.x - pos1.x);
                pos0.x += newVxBall0 / absV * overlap;
                pos1.x += newVxBall1 / absV * overlap;

                // rotate positions back
                var pos0F = crh.rotateCoords(pos0.x, pos0.y, sin, cos, false),
                    pos1F = crh.rotateCoords(pos1.x, pos1.y, sin, cos, false);

                // adjust positions to actual screen positions
                ball1.x = ball0.x + pos1F.x;
                ball1.y = ball0.y + pos1F.y;
                ball0.x = ball0.x + pos0F.x;
                ball0.y = ball0.y + pos0F.y;

                // rotate velocities back
                var vel0F = crh.rotateCoords(newVxBall0, vel0.y, sin, cos, false),
                    vel1F = crh.rotateCoords(newVxBall1, vel1.y, sin, cos, false);

                this.vX = vel0F.x;
                this.vY = vel0F.y;
                anotherBall.vX = vel1F.x;
                anotherBall.vY = vel1F.y;
            }
        },

        isObliqueBallCollision: function(vX0, vY0, vX1, vY1) {
            // calculate dot product of v0 and v1
            var dotProduct = vX0 * vX1 + vY0 * vY1;

            // calculate the amount of v0 and v1
            var amountV0 = Math.sqrt(vX0*vX0 + vY0*vY0);
            var amountV1 = Math.sqrt(vX1*vX1 + vY1*vY1);

            // calculate cos of the angle between v0 and v1
            var cosAngle = dotProduct / (amountV0 * amountV1);

            // calculate the angle
            var angle = Math.acos(cosAngle);

            //console.log('COS ANGLE', angle * 180 / Math.PI, cosAngle);

            // the collision is oblique if the angle is not a multiple of PI/2
            return (angle % (Math.PI/2)) !== 0;
        }
    });

})(window, Hooray);
