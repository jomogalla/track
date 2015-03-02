var gulp = require('gulp'),
  less = require('gulp-less'),
  concat = require('gulp-concat'),
  embedlr = require('gulp-embedlr'),
  refresh = require('gulp-livereload'),
  express = require('express'),
  livereload = require('connect-livereload'),
  jshint = require('gulp-jshint'),
  livereloadport = 35729,
  serverport = 5000,
  appDir = 'app/',
  vendorDir = 'node_modules/',
  es = require('event-stream'),
  plugins = require('gulp-load-plugins')({ lazy: false }),
  environment = 'production';
 
//We only configure the server here and start it only when running the watch task
var server = express();
//Add livereload middleware before static-middleware
server.use(livereload({
  port: livereloadport
}));
server.use(express.static('./build'));
 
// less all the files
gulp.task('less', function(){
  gulp.src('app/css/app.less')
    .pipe(plugins.less())
    // .pipe(plugins.concat('app.css'))
    .pipe(gulp.dest('build'));
    // .pipe(refresh());
});

// move all the fonts over (even though i am not using any right now)
gulp.task('fonts', function(){
  gulp.src('node_modules/bootstrap/dist/fonts/*')
    .pipe(gulp.dest('build/fonts'));
});
 
// move the index over before injection
gulp.task('copy-index', function(){
  return gulp.src('app/index.html')
    .pipe(gulp.dest('build'));
});

// move & inject all the scripts
gulp.task('scripts', ['copy-index'], function(){
  vendorSrc = [
    vendorDir + 'jquery/dist/jquery.js',
    vendorDir + 'angular/angular.js',
    vendorDir + 'angular-bootstrap/dist/ui-bootstrap-tpls.js',
    vendorDir + 'angular-route/angular-route.js',
    vendorDir + 'angular-cookies/angular-cookies.js',
    vendorDir + 'angular-loading-bar/build/loading-bar.js',
    vendorDir + 'moment/moment.js',
    vendorDir + 'angular-moment/angular-moment.js'
  ];

  appSrc = [
    'app/app.js',
    '!app/**/*test.js',
    'app/**/*.js'
  ];

  templateSrc = [
    '!app/index.html',
    'app/**/*.html'
  ];

  var vendorStream = gulp.src(vendorSrc)
    .pipe(concat('vendor.js'))
    .pipe(environment === 'production' ? plugins.concat('vendor.js') : plugins.util.noop())
    .pipe(environment === 'production' ? plugins.uglify() : plugins.util.noop())
    .pipe(gulp.dest('build/js/'));


  var appStream = gulp.src(appSrc)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(environment === 'production' ? plugins.concat('app.js') : plugins.util.noop())
    .pipe(environment === 'production' ? plugins.uglify() : plugins.util.noop())
    .pipe(gulp.dest('build/js/'));

  var templateStream = gulp.src(templateSrc)
    .pipe(plugins.angularTemplatecache('templates.js', { standalone: true }))
    .pipe(gulp.dest('build/js/'));

  return gulp.src('build/index.html')
    .pipe(plugins.inject(es.merge(vendorStream), { name: 'vendor', relative: true }))
    .pipe(plugins.inject(es.merge(appStream), { name: 'app', relative: true }))
    .pipe(plugins.inject(es.merge(templateStream), { name: 'templates', relative: true }))
    .pipe(gulp.dest('build'))
    .pipe(refresh());
});

// hint all the js files
gulp.task('hint', function() {
  return gulp.src(['!./app/vendorJS/*','app/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});
 
//move all the html files over
gulp.task('html', function(){
  gulp.src(['!app/index.html','app/**/*.html'])
    .pipe(gulp.dest('build'))
    .pipe(refresh());
});
 
//Convenience task for running a one-off build
gulp.task('build', function() {
  // gulp.run('html', 'hint', 'js', 'vendorJS', 'css', 'less', 'fonts');
  gulp.run('less', 'scripts');
});
 
gulp.task('serve', function() {
  //Set up static fileserver, which serves files in the build dir
  server.listen(serverport);
 
  //Set up livereload server
  refresh.listen(livereloadport);
});
 
gulp.task('watch', function() {
   //Add watching on css-files
  gulp.watch('app/css/*.less', ['less']);
  
  //Add watching on js-files & index.html
  gulp.watch(['app/vendorJS/*.js', 'app/**/*.js'], ['scripts']);
 
  //Add watching on html-files
  // gulp.watch(['!app/index.html','app/**/*.html'], ['html']);
});
 
gulp.task('default', function () {
  gulp.run('build', 'serve', 'watch');
});