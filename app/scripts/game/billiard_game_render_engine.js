(function(W, T, Hooray) {
    "use strict";

    var Billiard = Hooray.Namespace('Billiard', 'Billiard');
    Billiard.GameRenderEngine = Hooray.Class({
        init: function(gameContainerId) {
            Hooray.log('A new Billiard.Game instance has been created within "'+gameContainerId+'"!');

            // init gameContainer
            this.gameContainer = this.initGameContainer(gameContainerId);

            // init renderer
            this.renderer = this.initRenderer(this.gameContainer);

            // create a new scene
            this.scene = new THREE.Scene();

            // create a camera, position it and add it to the scene
            this.camera = this.initCamera(this.gameContainer, this.scene);
        },

        initGameContainer: function(gameContainerId) {
            var gameContainer = W.document.getElementById(gameContainerId);
            return {
                domElement: gameContainer,
                width: gameContainer.offsetWidth,
                height: gameContainer.offsetHeight
            };
        },

        initRenderer: function(gameContainer) {
            var renderer = Detector.webgl ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();
            renderer.setSize(gameContainer.width, gameContainer.height);
            gameContainer.domElement.appendChild(renderer.domElement);

            return renderer;
        },

        initCamera: function(gameContainer, scene) {
            var width   = gameContainer.width,
                height  = gameContainer.height,
                left    = width / -2,
                right   = width / 2,
                top     = height / 2,
                bottom  = height / -2,
                near    = 1,
                far     = 1000,
                camera  = new THREE.OrthographicCamera(
                    left, right,
                    top, bottom,
                    near, far
                );

            camera.position.z = 400;
            scene.add(this.camera);

            Hooray.log(
                'Initializing camera! [left, right, top, bottom, near, far]',
                left, right, top, bottom, near, far
            );

            return camera;
        },

        start: function() {
            Hooray.log('The Billiard.Game is about to start...');
        }
    });
})(window, THREE, Hooray);
