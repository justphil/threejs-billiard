(function(W, Hooray) {
    "use strict";

    var helperQuaternion        = new THREE.Quaternion(),
        normalizedYAxisVector   = new THREE.Vector3(0, 1, 0).normalize(),
        normalizedXAxisVector   = new THREE.Vector3(1, 0, 0).normalize();

    function rotateAroundWorldAxis(object, axis, radians) {
        helperQuaternion.setFromAxisAngle(axis, radians); // axis must be normalized, angle in radians
        object.quaternion.multiplyQuaternions(helperQuaternion, object.quaternion);
    }


    var RotationHelper = Hooray.Namespace('Billiard.Helper.RotationHelper', 'Billiard');
    RotationHelper.rotateAroundWorldAxisY = function(object, radians) {
        rotateAroundWorldAxis(object, normalizedYAxisVector, radians);
    };

    RotationHelper.rotateAroundWorldAxisX = function(object, radians) {
        rotateAroundWorldAxis(object, normalizedXAxisVector, radians);
    };
})(window, Hooray);
