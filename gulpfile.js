var gulp = require('gulp'),
  // sass = require('gulp-sass'),
  // browserify = require('gulp-browserify'),
  concat = require('gulp-concat'),
  embedlr = require('gulp-embedlr'),
  refresh = require('gulp-livereload'),
  lrserver = require('tiny-lr')(),
  express = require('express'),
  livereload = require('connect-livereload')
  livereloadport = 35729,
  serverport = 5000;
 
//We only configure the server here and start it only when running the watch task
var server = express();
//Add livereload middleware before static-middleware
server.use(livereload({
  port: livereloadport
}));
server.use(express.static('./build'));
 
// Task for sass using libsass through gulp-sass
gulp.task('css', function(){
  gulp.src('app/css/*.css*')
    .pipe(gulp.dest('build'))
    .pipe(refresh(lrserver));
});
 
//Task for processing js with browserify
gulp.task('js', function(){
  gulp.src('app/src/*.js')
   // .pipe(concat('bundle.js'))
   .pipe(gulp.dest('build'))
   .pipe(refresh(lrserver));
 
});
 
//Task for moving html-files to the build-dir
//added as a convenience to make sure this gulpfile works without much modification
gulp.task('html', function(){
  gulp.src('app/**/*.html')
    .pipe(gulp.dest('build'))
    .pipe(refresh(lrserver));
});
 
//Convenience task for running a one-off build
gulp.task('build', function() {
  gulp.run('html', 'js', 'css');
});
 
gulp.task('serve', function() {
  //Set up your static fileserver, which serves files in the build dir
  server.listen(serverport);
 
  //Set up your livereload server
  lrserver.listen(livereloadport);
});
 
gulp.task('watch', function() {
 
  //Add watching on sass-files
  gulp.watch('app/css/*.css', function() {
    gulp.run('css');
  });
  
  //Add watching on js-files
  gulp.watch('app/src/*.js', function() {
    gulp.run('js');
  });
 
  //Add watching on html-files
  gulp.watch('app/**/*.html', function () {
    gulp.run('html');
  });
});
 
gulp.task('default', function () {
  gulp.run('build', 'serve', 'watch');
});