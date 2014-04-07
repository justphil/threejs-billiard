module.exports = function(grunt) {
    "use strict";

    grunt.initConfig({
        concat: {
            dist: {
                files: {
                    'dist/scripts/threejs-billiard.min.js': [
                        'app/scripts/basics/foundation.js',
                        'app/scripts/basics/{,*/}*.js'
                    ]
                }
            }
        }
    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('default', [
        'concat'
    ]);
};
