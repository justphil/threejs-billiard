(function(W, Hooray) {
    "use strict";

    var helperQuaternion        = new THREE.Quaternion(),
        normalizedYAxisVector   = new THREE.Vector3(0, 1, 0).normalize(),
        normalizedXAxisVector   = new THREE.Vector3(1, 0, 0).normalize();

    function rotateAroundWorldAxis(object, axis, radians) {
        helperQuaternion.setFromAxisAngle(axis, radians); // axis must be normalized, angle in radians
        object.quaternion.multiplyQuaternions(helperQuaternion, object.quaternion);
    }

    function rotateAroundWorldAxisY(object, radians) {
        rotateAroundWorldAxis(object, normalizedYAxisVector, radians);
    }

    function rotateAroundWorldAxisX(object, radians) {
        rotateAroundWorldAxis(object, normalizedXAxisVector, radians);
    }

    Hooray.define('Billiard', 'Helper.RotationHelper', 'rotateAroundWorldAxisY', rotateAroundWorldAxisY);
    Hooray.define('Billiard', 'Helper.RotationHelper', 'rotateAroundWorldAxisX', rotateAroundWorldAxisX);

})(window, Hooray);
