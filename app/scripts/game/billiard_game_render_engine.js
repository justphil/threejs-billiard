(function(W, Hooray) {
    "use strict";

    Hooray.defineClass('Billiard', '', 'GameRenderEngine', {
        init: function(gameContainerId) {
            Hooray.log('A new Billiard.GameRenderEngine instance has been created within "'+gameContainerId+'"!');

            // init gameContainer
            this.gameContainer = this.initGameContainer(gameContainerId);

            // init asset loader
            this.assetLoader = new Billiard.AssetLoader();

            // init renderer
            this.renderer = this.initRenderer(this.gameContainer);

            // init scene
            this.scene = new THREE.Scene();

            // create a camera, position it and add it to the scene
            this.camera = this.initCamera(this.gameContainer, this.scene);

            // init light
            this.light = this.initLight(this.scene);
        },

        initGameRenderEngine: function(balls, cues, pockets) {
            var that = this;
            var ballId, cueId, pocketId, geometry, material, sphere, plane, pocket;
            var rh = Billiard.Helper.RotationHelper;

            var promises = [];

            // load ball textures
            var ballTexturesPromise = this.assetLoader.getMaps(Object.keys(balls)).then(function(mapHash) {
                // create three.js sphere that represents a ball and add it to the scene
                for (ballId in balls) {
                    if (balls.hasOwnProperty(ballId)) {
                        geometry = new THREE.SphereGeometry(balls[ballId].radius, 24, 24);
                        material = new THREE.MeshPhongMaterial({
                            map: mapHash[ballId]
                            //shininess: 52
                            //color: 0x00FF00
                        });
                        sphere = new THREE.Mesh(geometry, material);
                        sphere.position.x = balls[ballId].initX;
                        sphere.position.y = balls[ballId].initY;

                        // adjust rotation because the textures has got a particular offset
                        rh.rotateAroundWorldAxisY(sphere, -Math.PI/2);

                        that.scene.add(sphere);

                        // augment the ball with the created mesh
                        balls[ballId].mesh = sphere;

                        // TODO: this must be solved in a better way
                        // augment cues with ball0 property
                        if (ballId === 'images/ball0.jpg') {
                            for (cueId in cues) {
                                if (cues.hasOwnProperty(cueId)) {
                                    cues[cueId].augment('ball0', balls[ballId]);
                                }
                            }
                        }
                    }
                }
            });
            promises.push(ballTexturesPromise);

            // TODO: load cue textures in the future
            for (cueId in cues) {
                if (cues.hasOwnProperty(cueId)) {
                    geometry = new THREE.PlaneGeometry( 6, 480 );
                    material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
                    plane = new THREE.Mesh( geometry, material );

                    plane.position.z = 20;
                    //plane.rotation.z = Math.PI / 4;

                    that.scene.add( plane );

                    // augment the cue with the created mesh
                    cues[cueId].augment('mesh', plane);

                    // augment the cue with the gameContainer DOM element
                    cues[cueId].augment('gameContainer', that.gameContainer);
                }
            }

            // TODO: load pocket textures in the future
            for (pocketId in pockets) {
                if (pockets.hasOwnProperty(pocketId)) {
                    material = new THREE.MeshBasicMaterial({color: 0xffff00});
                    geometry = new THREE.CircleGeometry(pockets[pocketId].radius, 32);
                    pocket = new THREE.Mesh(geometry, material);
                    pocket.position.x = pockets[pocketId].x;
                    pocket.position.y = pockets[pocketId].y;
                    that.scene.add(pocket);

                    // augment the pocket with the created mesh
                    pockets[pocketId].augment('mesh', pocket);
                }
            }

            return Q.all(promises).then(function() {
                return function() {
                    that.render();
                };
            });
        },

        render: function() {
            this.renderer.render(this.scene, this.camera);
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
            scene.add(camera);

            Hooray.log(
                'Initializing camera! [left, right, top, bottom, near, far]',
                left, right, top, bottom, near, far
            );

            return camera;
        },

        initLight: function(scene) {
            var light = new THREE.DirectionalLight(0xFFFFFF, 1);

            light.position.set(0, 0, 1);
            scene.add(light);

            return light;
        }
    });

})(window, Hooray);
