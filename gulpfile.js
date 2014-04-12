"use strict";

var gulp = require('gulp'),
  clean = require('gulp-clean'),
  concat = require('gulp-concat'),
  inject = require('gulp-inject'),
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify'),
  es = require('event-stream'),
  component = require('package.json');

var paths = {
  dist: 'dist',
  examples: 'example',
  libs: 'app/lib',
  debug: 'debug',
  src: [
    'app/scripts/basics/foundation.js',
    'app/scripts/basics/**/*.js',
    'app/scripts/game/helpers/coords_rotation_helper.js',
    'app/scripts/**/*.js',
    '!app/scripts/app.js'
  ]
};

/**
 *
 *
 * Clean Task
 *
 *
 */
gulp.task('clean', function () {
  return gulp.src([paths.dist, paths.examples, paths.debug], {read: false})
    .pipe(clean());
});

/**
 *
 *
 * Default Task
 *
 *
 */
gulp.task('default', ['clean'], function () {
  gulp.start(paths.dist, paths.examples);
});

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

gulp.task('dist', ['clean'], function () {
  gulp.start('lean-dist', 'fat-dist');
});

/**
 *
 *
 * Task for a runnable example (including index.html and app.js for bootstrapping)
 *
 *
 */
gulp.task('example', ['clean'], function () {
  gulp.start('prepare-example', 'copy-images-to-example');
});

/**
 *
 *
 * Helper tasks
 *
 *
 */

gulp.task('prepare-example', function () {
  var fatDist = fatDistributionStream()
    .pipe(gulp.dest(paths.examples + '/scripts'))
    .pipe(rename('../../scripts/'+component.name+'.fat.min.js'));

  var appJs = helperJsResourcesStream()
    .pipe(gulp.dest(paths.examples + '/scripts'))
    .pipe(rename('../../scripts/app.js'));

  var cssStream = gulp.src(['app/styles/**/*.css'])
    .pipe(concat('main.css'))
    .pipe(gulp.dest(paths.examples + '/styles'))
    .pipe(rename('../../styles/main.css'));

  return gulp.src('app/index.tpl.html')
    .pipe(inject(es.merge(fatDist, appJs, cssStream), {
      addRootSlash: false,
      sort: ensureAppJsLastLoadedComparator // ensure that app.js is the last file to include
    }))
    .pipe(rename('index.html'))
    .pipe(gulp.dest(paths.examples));
});

gulp.task('copy-images-to-example', function () {
  return gulp.src('app/images/**/*.jpg')
    .pipe(gulp.dest(paths.examples + '/images'));
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
  return gulp.src([paths.lib + '/**/*.js', '!'paths.lib + '/**/*.min.js'])
    .pipe(concat('deps-to-minify.min.js'));
}

function minifiedDependenciesStream() {
  return es.merge(
    preMinifiedDependenciesStream(),
    dependenciesToMinifyStream().pipe(uglify())
  ).pipe(concat('all-deps.min.js'));
}

function minifiedJsResourcesStream() {
  // To a certain extend we need to ensure a specific loading order.
  // We can do it better in the future by using e.g. Browserify.
  return gulp.src(paths.src)
    .pipe(concat(component.name+'.min.js'))
    .pipe(uglify());
}

function helperJsResourcesStream() {
  return gulp.src(['app/scripts/app.js'])
    .pipe(concat('app.js'));
}

function leanDistributionStream() {
  return minifiedJsResourcesStream();
}

function fatDistributionStream() {
  return es.merge(
    minifiedDependenciesStream(),
    minifiedJsResourcesStream()
  ).pipe(concat(component.name+'.fat.min.js'));
}

/**
 *
 *
 * Other helper functions
 *
 *
 */

function ensureAppJsLastLoadedComparator(a, b) {
  if (/app.js/.test(a.filepath)) {
    return 1;
  }
  else if (/app.js/.test(b.filepath)) {
    return -1;
  }
  else if (/app.js/.test(a.filepath) && /app.js/.test(b.filepath)) {
    return 0;
  }
  else {
    if (a.filepath < b.filepath)
      return -1;

    if (a.filepath > b.filepath)
      return 1;

    return 0;
  }
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

gulp.task('min-code', ['clean'], function () {
  return minifiedJsResourcesStream()
    .pipe(gulp.dest(paths.debug + '/min-code'));
});

gulp.task('deps-to-min', ['clean'], function () {
  return dependenciesToMinifyStream()
    .pipe(gulp.dest(paths.debug + '/deps-to-min'));
});
