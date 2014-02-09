(function(W, T, Hooray) {
    "use strict";

    var Billiard = Hooray.Namespace('Billiard', 'Billiard');
    Billiard.GameRenderEngine = Hooray.Class({
        init: function(gameContainerId) {
            console.log('A new Billiard.Game instance has been created within "'+gameContainerId+'"!');

            // init gameContainer
            this.gameContainer = this.initGameContainer(gameContainerId);

            // init renderer
            this.renderer = this.initRenderer(this.gameContainer);
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

        start: function() {
            console.log('The Billiard.Game is about to start...');
        }
    });
})(window, THREE, Hooray);
