var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var proxy = require('proxy-middleware');
var url = require('url');
var config = require('../config.js');

gulp.task('serve', function() {
  var proxyOptions = url.parse('http://dev-api.partnr-up.com/api');
  proxyOptions.route = '/api';
  config.browsersync.server.middleware = [proxy(proxyOptions)]

  browserSync.init(config.browsersync);

  var sasswatcher = gulp.watch(config.src + 'sass/**/*', ['sass']);
  var buildwatcher = gulp.watch(config.src + 'js/**/*', ['build']);
  var htmlwatcher = gulp.watch('./index.html', ['rename']);

  htmlwatcher.on('change', function() {setTimeout(browserSync.reload, 500)});
  sasswatcher.on('change', function() {setTimeout(browserSync.reload, 1000)});
  buildwatcher.on('change', function() {setTimeout(browserSync.reload, 3000)});
});
