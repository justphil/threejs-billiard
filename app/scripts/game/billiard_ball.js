module.exports = (function(Hooray, Logger, Events, DropState_Phase1, RotationHelper, CollisionHelper) {
    "use strict";

    return Hooray.Class({
        init: function(id, initX, initY, radius, mass, pubSub) {
            Logger.log('A new Billiard.Ball instance has been created with id "'+id+'"!');

            this.id     = id;
            this.initX  = initX;
            this.initY  = initY;
            this.radius = radius;
            this.mass   = mass;

            this.momentOfInertiaSphere = (2/5) * this.mass * (this.radius * this.radius);
            //this.frictionCoefficientBillard = 0.2;
            //this.gravitationalConstant = 9.81;

            this.vX         = 0; // Math.round(-20 + Math.random() * 40);
            this.vY         = 0; // Math.round(-20 + Math.random() * 40);

            // needed for animating the ball when it drops into a pocket
            this.pocketDropState = null;

            /*if (id === 'images/ball0.jpg') {
             this.mass = 5;
             this.vX = 24;
             this.vY = 0;
             }*/


            this.vAngular   = 0;
            this.vAngularZ  = 0;

            this.pubSub = pubSub;

            // !!! A Billiard.Ball object will be augmented with a mesh property during initialization !!!
        },

        translateByFraction: function(fraction) {
            this.mesh.position.x += fraction * this.vX;
            this.mesh.position.y += fraction * this.vY;
        },

        rotateByFraction: function(fraction) {
            var generalFrictionFactor = 0;
            var friction = 0;
            var currentVelocity = this.getVelocity();
            var vAngle = this.getVelocityAngle();

            // check condition for perfect ball rotation/rolling
            if (this.isPerfectlyRotating() || this.pocketDropState) {
                generalFrictionFactor = 0.011;

                // apply perfect ball rotation/rolling
                // aka angular velocity perfectly corresponds to distance travelled
                RotationHelper.rotateAroundWorldAxisX(this.mesh, (-this.vY * fraction) / this.radius);
                RotationHelper.rotateAroundWorldAxisY(this.mesh, (this.vX * fraction) / this.radius);
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

                RotationHelper.rotateAroundWorldAxisX(this.mesh, -this.vAngular * Math.sin(vAngle));
                RotationHelper.rotateAroundWorldAxisY(this.mesh, this.vAngular * Math.cos(vAngle));
            }

            return friction + (currentVelocity * generalFrictionFactor);
        },

        rotateZ: function() {
            // apply z rotation if available
            //var angularFriction = 0.0009;
            var angularFriction = 0.002;
            if (this.vAngularZ !== 0) {
                RotationHelper.rotateAroundWorldAxisZ(this.mesh, this.vAngularZ);

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
                        Events.BALL_STOPPED_ROLLING,
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

        isAboutToDropInto: function(pocket) {
            var returnVal = false;

            var ballPos,
                pocketPos,
                dx,
                dy,
                dist;

            // check if there is a collision with the pocket

            // TODO: use simple rectangular collision check and afterwards check by calculating the distance
            ballPos     = this.mesh.position;
            pocketPos   = pocket.mesh.position;
            dx          = pocketPos.x - ballPos.x;
            dy          = pocketPos.y - ballPos.y;
            dist        = Math.sqrt(dx * dx + dy * dy);

            if (dist < pocket.radius) {
                /*
                 this.containingPocket = pocket;
                 this.vX *= 0.1;
                 this.vY *= 0.1;
                 */

                console.log('Ball "' + this.id + '" is about to drop into pocket "' + pocket.id + '".');

                this.pocketDropState = new DropState_Phase1(this, pocket);

                returnVal = true;
            }

            return returnVal;
        },

        dispatchPocketDrop: function() {
            this.pocketDropState.proceed();
        },

        applyBallCollisionReaction: function(anotherBall) {
            var ball0 = this.mesh.position,
                ball1 = anotherBall.mesh.position;

            // x1, y1, vX1, vY1, r1, m1,
            // x2, y2, vX2, vY2, r2, m2,
            // coefficientOfRestitution
            var collisionReactionalChanges = CollisionHelper.calculateBallCollisionReaction(
                ball0.x, ball0.y, this.vX, this.vY, this.radius, this.mass,
                ball1.x, ball1.y, anotherBall.vX, anotherBall.vY, anotherBall.radius, anotherBall.mass,
                1
            );

            // apply changes
            this.vAngularZ = collisionReactionalChanges.vAngularZ1;
            anotherBall.vAngularZ = collisionReactionalChanges.vAngularZ2;

            this.vX = collisionReactionalChanges.vX1;
            this.vY = collisionReactionalChanges.vY1;
            anotherBall.vX = collisionReactionalChanges.vX2;
            anotherBall.vY = collisionReactionalChanges.vY2;
        },

        predictCollisionWith: function(anotherBall) {
            var thisBallPos     = this.mesh.position,
                anotherBallPos  = anotherBall.mesh.position;

            return CollisionHelper.getCollisionTime(
                thisBallPos.x, thisBallPos.y, this.vX, this.vY, this.radius,
                anotherBallPos.x, anotherBallPos.y, anotherBall.vX, anotherBall.vY, anotherBall.radius
            );
        }
    });

})(
        require('../basics/foundation'),
        require('../basics/log'),
        require('./events/events'),
        require('./drop_states/phase1'),
        require('./helpers/rotation_helper'),
        require('./helpers/collision_helper')
);
