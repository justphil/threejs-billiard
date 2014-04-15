module.exports = (function(Hooray, Logger, THREE, Q, Detector, AssetLoader, RotationHelper) {
    "use strict";

    return Hooray.Class({
        init: function(gameContainerId) {
            Logger.log('A new Billiard.GameRenderEngine instance has been created within "'+gameContainerId+'"!');

            // init gameContainer
            this.gameContainer = this.initGameContainer(gameContainerId);

            // init asset loader
            this.assetLoader = new AssetLoader();

            // init renderer
            this.renderer = this.initRenderer(this.gameContainer);

            // init scene
            this.scene = new THREE.Scene();

            // create a camera, position it and add it to the scene
            this.camera = this.initCamera(this.gameContainer, this.scene);

            // init light
            this.light = this.initLight(this.scene);
        },

        // TODO: refactor this function
        initGameRenderEngine: function(table, balls, cues, pockets) {
            var that = this;
            var ballId, cueId, pocketId, geometry, material, sphere, plane, pocket, line, circle;

            var promises = [];

            // TODO: load table texture
            geometry = new THREE.PlaneGeometry(table.getPlayingFieldWidth(), table.getPlayingFieldHeight());
            material = new THREE.MeshBasicMaterial({color: 0x008000});
            plane = new THREE.Mesh(geometry, material);
            plane.position.z = -20;
            that.scene.add(plane);

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
                        RotationHelper.rotateAroundWorldAxisY(sphere, -Math.PI/2);

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
                        else {
                            for (cueId in cues) {
                                if (cues.hasOwnProperty(cueId)) {
                                    cues[cueId].otherBalls.push(balls[ballId]);
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
                    geometry = new THREE.PlaneGeometry( 480, 6 );
                    material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
                    plane = new THREE.Mesh( geometry, material );
                    plane.position.z = 20;

                    that.scene.add( plane );

                    // augment the cue with the created mesh
                    cues[cueId].augment('mesh', plane);

                    // augment the cue with the gameContainer DOM element
                    cues[cueId].augment('gameContainer', that.gameContainer);

                    if (!Hooray.isUndefined(cues[cueId].targetGuide)) {
                        // add general target guide line
                        material = new THREE.LineDashedMaterial({
                            color: 0xffffff,
                            linewidth: 2,
                            dashSize: 8,
                            gapSize: 6
                        });
                        geometry = new THREE.Geometry();
                        geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
                        geometry.vertices.push( new THREE.Vector3( 0, 150, 0 ) );
                        geometry.vertices.push( new THREE.Vector3( 150, 150, 0 ) );
                        // this is important to get a dashed line
                        geometry.computeLineDistances();

                        line = new THREE.Line(geometry, material);
                        that.scene.add(line);

                        cues[cueId].targetGuide.augment('mesh', line);

                        // add target guide line for visualizing collision reaction of another ball
                        material = new THREE.LineBasicMaterial( { color: 0xffffff } );
                        geometry = new THREE.Geometry();
                        geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
                        geometry.vertices.push( new THREE.Vector3( 0, 150, 0 ) );
                        line = new THREE.Line(geometry, material);
                        line.position.z = 20;
                        that.scene.add(line);
                        cues[cueId].targetGuide.augment('meshAnotherBallReactionLine', line);

                        // add target guide circle
                        material = new THREE.LineBasicMaterial( { color: 0xffffff } );
                        geometry = new THREE.CircleGeometry( 20, 48 );
                        // Remove center vertex
                        geometry.vertices.shift();
                        circle = new THREE.Line( geometry, material );
                        circle.position.z = 20;

                        that.scene.add(circle);

                        cues[cueId].targetGuide.augment('meshCircle', circle);
                    }
                }
            }

            // TODO: load pocket textures in the future
            for (pocketId in pockets) {
                if (pockets.hasOwnProperty(pocketId)) {
                    material = new THREE.MeshBasicMaterial({color: 0xff4306});
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
            var gameContainer = document.getElementById(gameContainerId);
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

            Logger.log(
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

})(
    require('../basics/foundation'),
    require('../basics/log'),
    require('three'),
    require('q'),
    require('detector'),
    require('../infrastructure/asset_loader'),
    require('./helpers/rotation_helper')
);
