var gulp = require('gulp');
var config = require('../config.js').browserify;
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var angularTemplates = require('gulp-angular-templates');
var ngHtml2Js = require('browserify-ng-html2js');


gulp.task('build', ['sass', 'rename'], function() {
  var b = browserify({
    entries: config.src,
    debug: config.debug
  });

  b.transform(ngHtml2Js({
    extension: 'html',
    baseDir: 'src/js',
    requireAngular: true,
    module: 'templates'
  }));

  if(config.debug) {
    return b.bundle()
      .pipe(source(config.destName))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
      .on('error', gutil.log)
      .pipe(sourcemaps.write(config.src))
      .pipe(gulp.dest(config.dest));
  } else {
    return b.bundle()
          .pipe(source(config.destName))
          .pipe(buffer())
          .pipe(sourcemaps.init({loadMaps: false}))
          .pipe(uglify())
          .on('error', gutil.log)
          .pipe(sourcemaps.write(config.src))
          .pipe(gulp.dest(config.dest));
  }
});
