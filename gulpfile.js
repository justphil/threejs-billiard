"use strict";

var gulp        = require('gulp'),
    clean       = require('gulp-clean'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglify'),
    rename      = require('gulp-rename'),
    inject      = require('gulp-inject'),
    streamify   = require('gulp-streamify'),
    browserify  = require('browserify'),
    source      = require('vinyl-source-stream'),
    series      = require('stream-series'),
    component   = require('./package.json');

var paths = {
    umdName:        'ThreeJsBilliard',
    entryPoint:     './app/scripts/' + component.name + '.js',
    startHelper:    './app/helpers/start-' + component.name + '.js',
    dist:           './dist',
    example:        './example',
    lib:            './app/lib',
    images:         './app/images',
    debug:          './debug'
};

/**
 *
 *
 * Clean Task
 *
 *
 */
gulp.task('clean', function () {
    return gulp.src([paths.dist, paths.example, paths.debug], {read: false})
        .pipe(clean());
});

/**
 *
 *
 * Default Task
 *
 *
 */
gulp.task('default', ['clean', 'dist', 'example']);

/**
 *
 *
 * Distribution Tasks
 *
 *
 */
gulp.task('lean-dist', ['clean'], function () {
    return leanDistributionStream()
        .pipe(gulp.dest(paths.dist));
});

gulp.task('fat-dist', ['clean'], function () {
    return fatDistributionStream()
        .pipe(gulp.dest(paths.dist));
});

gulp.task('dist', ['clean', 'lean-dist', 'fat-dist']);

/**
 *
 *
 * Task for a runnable example (including index.html and app.js for bootstrapping)
 *
 *
 */
gulp.task('example', ['clean', 'prepare-example', 'copy-images-to-example']);

/**
 *
 *
 * Helper tasks
 *
 *
 */

gulp.task('prepare-example', function () {
    var fatDist = fatDistributionStream()
        .pipe(gulp.dest(paths.example + '/scripts'))
        .pipe(rename('../../scripts/' + component.name + '.fat.min.js'));

    var appJs = helperJsResourcesStream()
        .pipe(gulp.dest(paths.example + '/scripts'))
        .pipe(rename('../../scripts/app.js'));

    var cssStream = gulp.src(['app/styles/**/*.css'])
        .pipe(concat('main.css'))
        .pipe(gulp.dest(paths.example + '/styles'))
        .pipe(rename('../../styles/main.css'));

    return gulp.src('app/index.tpl.html')
        .pipe(inject(series(cssStream, fatDist, appJs), {
            addRootSlash: false
        }))
        .pipe(rename('index.html'))
        .pipe(gulp.dest(paths.example));
});

gulp.task('copy-images-to-example', function () {
    return gulp.src(paths.images + '/**/*.jpg')
        .pipe(gulp.dest(paths.example + '/images'));
});

/**
 *
 *
 * Helper functions that return streams
 *
 *
 */

function preMinifiedDependenciesStream() {
    return gulp.src([paths.lib + '/**/*.min.js'])
        .pipe(concat('pre-minified-deps.min.js'));
}

function dependenciesToMinifyStream() {
    return gulp.src([paths.lib + '/**/*.js', '!' + paths.lib + '/**/*.min.js'])
        .pipe(concat('deps-to-minify.min.js'));
}

function minifiedDependenciesStream() {
    /**
     * We have to ensure that Q is copied before Three.js because Three.js sets "use strict" globally
     * and unfortunately this hurts Q. :-/ (Need to create a PR for Three.js to fix it!)
     */
    return series(
        dependenciesToMinifyStream().pipe(uglify()),
        preMinifiedDependenciesStream()
    ).pipe(concat('all-deps.min.js'));
}

function browserifiedBundleStream() {
    return browserify(paths.entryPoint).bundle({standalone: paths.umdName}) // bundle it as an UMD module
        .pipe(source(component.name + '.js'));
}

function minifiedJsResourcesStream() {
    return browserifiedBundleStream()
        .pipe(streamify(uglify())) // use streamify() to make uglify() support streams
        .pipe(rename(component.name + '.min.js'));
}

function helperJsResourcesStream() {
    return gulp.src([paths.startHelper])
        .pipe(concat('app.js'));
}

function leanDistributionStream() {
    return minifiedJsResourcesStream();
}

function fatDistributionStream() {
    return series(
        minifiedDependenciesStream(),
        minifiedJsResourcesStream()
    ).pipe(streamify(concat(component.name + '.fat.min.js')));
}

/**
 *
 *
 * Debug Tasks
 *
 *
 */

gulp.task('pre-min-deps', ['clean'], function () {
    return preMinifiedDependenciesStream()
        .pipe(gulp.dest(paths.debug + '/pre-min-deps'));
});

gulp.task('min-deps', ['clean'], function () {
    return minifiedDependenciesStream()
        .pipe(gulp.dest(paths.debug + '/min-deps'));
});

gulp.task('browserify-code', ['clean'], function () {
    return browserifiedBundleStream()
        .pipe(gulp.dest(paths.debug + '/browserify-code'));
});

gulp.task('min-code', ['clean'], function () {
    return minifiedJsResourcesStream()
        .pipe(gulp.dest(paths.debug + '/min-code'));
});

gulp.task('deps-to-min', ['clean'], function () {
    return dependenciesToMinifyStream()
        .pipe(gulp.dest(paths.debug + '/deps-to-min'));
});
