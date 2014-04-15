module.exports = (function(Hooray, Logger) {
    "use strict";

    return Hooray.Class({
        init: function(playingFieldWidth, playingFieldHeight) {
            Logger.log('A new Billiard.Table.Default instance has been created!');
            this.playingFieldWidth  = playingFieldWidth;
            this.playingFieldHeight = playingFieldHeight;
            this.backgroundTexture  = 'images/table_default.png';

            var pocketRadius = 24;
            this.pockets = {
                top: {
                    x: 0,
                    y: (playingFieldHeight / 2) - pocketRadius,
                    radius: pocketRadius
                },

                topLeft: {
                    x: -(playingFieldWidth / 2) + pocketRadius,
                    y: (playingFieldHeight / 2) - pocketRadius,
                    radius: pocketRadius
                },

                topRight: {
                    x: (playingFieldWidth / 2) - pocketRadius,
                    y: (playingFieldHeight / 2) - pocketRadius,
                    radius: pocketRadius
                },

                bottom: {
                    x: 0,
                    y: -(playingFieldHeight / 2) + pocketRadius,
                    radius: pocketRadius
                },

                bottomLeft: {
                    x: -(playingFieldWidth / 2) + pocketRadius,
                    y: -(playingFieldHeight / 2) + pocketRadius,
                    radius: pocketRadius
                },

                bottomRight: {
                    x: (playingFieldWidth / 2) - pocketRadius,
                    y: -(playingFieldHeight / 2) + pocketRadius,
                    radius: pocketRadius
                }
            };
        },

        getPlayingFieldWidth: function() {
            return this.playingFieldWidth;
        },

        getPlayingFieldHeight: function() {
            return this.playingFieldHeight;
        },

        getBackgroundTexture: function() {
            return this.backgroundTexture;
        },

        getPockets: function() {
            return this.pockets;
        }
    });

})(require('../../basics/foundation'), require('../../basics/log'));
