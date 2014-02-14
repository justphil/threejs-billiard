(function(W, Hooray) {
    "use strict";

    Hooray.defineClass('Billiard', 'Table', 'Default', {
        init: function(playingFieldWidth, playingFieldHeight) {
            Hooray.log('A new Billiard.Table.Default instance has been created!');
            this.playingFieldWidth  = playingFieldWidth;
            this.playingFieldHeight = playingFieldHeight;
            this.backgroundTexture  = 'images/table_default.png';
        },

        getPlayingFieldWidth: function() {
            return this.playingFieldWidth;
        },

        getPlayingFieldHeight: function() {
            return this.playingFieldHeight;
        },

        getBackgroundTexture: function() {
            return this.backgroundTexture;
        }
    });

})(window, Hooray);
