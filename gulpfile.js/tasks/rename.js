var gulp = require('gulp');
var config = require('../config.js').rename;

gulp.task('rename', function() {
  config.files.forEach(function(obj) {
    gulp.src(obj.name)
      .pipe(gulp.dest(obj.dest));
  });
});
