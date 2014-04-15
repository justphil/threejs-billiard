module.exports = (function(THREE, CoordsRotationHelper) {
    "use strict";

    var helperVectors = {
        p0: new THREE.Vector2(0, 0),
        pf: new THREE.Vector2(0, 0),
        q0: new THREE.Vector2(0, 0),
        qf: new THREE.Vector2(0, 0),
        tmp1: new THREE.Vector2(0, 0),
        tmp2: new THREE.Vector2(0, 0)
    };

    function getCollisionTime(x1, y1, vX1, vY1, r1, x2, y2, vX2, vY2, r2) {
        var a, b, c, t1, t2;
        var tmp1 = helperVectors.tmp1,
            tmp2 = helperVectors.tmp2,
            tmp1Length, tmp2Length, rSum, helper;

        // ball 1
        var p0 = helperVectors.p0;
        p0.set(x1, y1);

        var pf = helperVectors.pf;
        pf.set(x1 + vX1, y1 + vY1);

        var dp = pf.sub(p0);

        // ball 2
        var q0 = helperVectors.q0;
        q0.set(x2, y2);

        var qf = helperVectors.qf;
        qf.set(x2 + vX2, y2 + vY2);

        var dq = qf.sub(q0);


        // calculate a for the pq-formula
        tmp1.subVectors(dq, dp);
        tmp1Length = tmp1.length();
        a = tmp1Length * tmp1Length;

        // calculate b for the pq-formula
        tmp2.subVectors(q0, p0);
        tmp2.multiplyScalar(2);
        b = tmp2.dot(tmp1);

        // calculate c for the pq-formula
        tmp2.subVectors(q0, p0);
        tmp2Length = tmp2.length();
        rSum = r1 + r2;
        c = (tmp2Length * tmp2Length) - ( rSum * rSum );

        // calculate solution according to pq-formula
        var bSquared = b * b;
        var fourAC = 4 * a * c;
        var diff = bSquared - fourAC;

        if (diff >= 0) {
            helper = Math.sqrt(diff);
            t1 = (-b + helper) / (2 * a);
            t2 = (-b - helper) / (2 * a);
            return Math.min(t1, t2);
        }
        else {
            return null;
        }
    }

    function calculateBallCollisionReaction(x1, y1, vX1, vY1, r1, m1, x2, y2, vX2, vY2, r2, m2, coefficientOfRestitution) {
        var returnObj = {};

        var dx = x2 - x1,
            dy = y2 - y1;

        // calculate angle, sine, and cosine
        var angle = Math.atan2(dy, dx),
            sin = Math.sin(angle),
            cos = Math.cos(angle),
            e = coefficientOfRestitution,
        // rotate ball0's velocity
            vel0 = CoordsRotationHelper.rotateCoords(vX1, vY1, sin, cos, true),
        // rotate ball1's velocity
            vel1 = CoordsRotationHelper.rotateCoords(vX2, vY2, sin, cos, true);

        // apply conservation of momentum
        var tmp = 1 / (m1 + m2);
        var newVxBall0 = (m1 - e * m2) * vel0.x * tmp + (1 + e) * m2 * vel1.x * tmp;
        var newVxBall1 = (1 + e) * m1 * vel0.x * tmp + (m2 - e * m1) * vel1.x * tmp;

        // apply friction due to oblique collision if it is an oblique collision
        var obliquenessDetectionVx, obliquenessDetectionVy;
        if (vel0.x === 0 && vel0.y === 0) {
            obliquenessDetectionVx = vel1.x;
            obliquenessDetectionVy = vel1.y;
        }
        else {
            obliquenessDetectionVx = vel0.x;
            obliquenessDetectionVy = vel0.y;
        }

        if (isObliqueBallCollision(obliquenessDetectionVx, obliquenessDetectionVy, dx, dy)) {
            var fiveSeventh = 5 / 7;

            returnObj.vAngularZ1 = -fiveSeventh * (vel0.y / r1);
            returnObj.vAngularZ2 = fiveSeventh * (vel1.y / r2);

            vel0.y = fiveSeventh * vel0.y;
            vel1.y = fiveSeventh * vel1.y;
        }
        else {
            returnObj.vAngularZ1 = 0;
            returnObj.vAngularZ2 = 0;
        }

        // rotate velocities back
        var vel0F = CoordsRotationHelper.rotateCoords(newVxBall0, vel0.y, sin, cos, false),
            vel1F = CoordsRotationHelper.rotateCoords(newVxBall1, vel1.y, sin, cos, false);

        returnObj.vX1 = vel0F.x;
        returnObj.vY1 = vel0F.y;
        returnObj.vX2 = vel1F.x;
        returnObj.vY2 = vel1F.y;

        return returnObj;
    }

    function isObliqueBallCollision(vX0, vY0, vX1, vY1) {
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

    return {
        getCollisionTime: getCollisionTime,
        calculateBallCollisionReaction: calculateBallCollisionReaction
    };

})(require('three'), require('./coords_rotation_helper'));
