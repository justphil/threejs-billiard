(function(W, Hooray) {
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
        var anotherHelper = bSquared - fourAC;

        if (anotherHelper >= 0) {
            helper = Math.sqrt( anotherHelper );
            t1 = (-b + helper) / (2 * a);
            t2 = (-b - helper) / (2 * a);
            return Math.min(t1, t2);
        }
        else {
            return null;
        }
    }

    Hooray.define('Billiard', 'Helper.CollisionHelper', 'getCollisionTime', getCollisionTime);
})(window, Hooray);
