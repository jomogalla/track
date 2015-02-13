var gulp = require('gulp'),
  less = require('gulp-less'),
  // browserify = require('gulp-browserify'),
  concat = require('gulp-concat'),
  embedlr = require('gulp-embedlr'),
  refresh = require('gulp-livereload'),
  lrserver = require('tiny-lr')(),
  express = require('express'),
  livereload = require('connect-livereload'),
  jshint = require('gulp-jshint'),
  livereloadport = 35728,
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
  gulp.src('app/css/*.css')
    .pipe(gulp.dest('build'))
    .pipe(refresh(lrserver));
});
gulp.task('less', function(){
  gulp.src('app/css/*.less')
    .pipe(less())
    .pipe(gulp.dest('build'))
    .pipe(refresh(lrserver));
});
gulp.task('fonts', function(){
  gulp.src('bootstrap/fonts/*')
    .pipe(gulp.dest('build/fonts'));
});
 
//Task for processing js with browserify
gulp.task('js', function(){
  gulp.src('app/**/*.js')
   // .pipe(concat('bundle.js'))
   .pipe(gulp.dest('build'))
   .pipe(refresh(lrserver));
 
});

// gulp.task('vendorJS', function(){
//   gulp.src('app/vendorJS/*.js')
//     .pipe(plugins.concat('vendor.js'))
//     .pipe(gulp.dest('build'))
//     .pipe(refresh(lrserver));
// });

gulp.task('hint', function() {
  return gulp.src(['!./app/vendorJS/*','app/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});
 
//Task for moving html-files to the build-dir
//added as a convenience to make sure this gulpfile works without much modification
gulp.task('html', function(){
  gulp.src(['app/index.html','app/**/*.html'])
    .pipe(gulp.dest('build'))
    .pipe(refresh(lrserver));
});
 
//Convenience task for running a one-off build
gulp.task('build', function() {
  gulp.run('html', 'hint', 'js', 'css', 'less', 'fonts');
});
 
gulp.task('serve', function() {
  //Set up your static fileserver, which serves files in the build dir
  server.listen(serverport);
 
  //Set up your livereload server
  lrserver.listen(livereloadport);
});
 
gulp.task('watch', function() {
 
  //Add watching on css-files
  gulp.watch('app/css/*.css', function() {
    gulp.run('css');
  });

  //Add watching on css-files
  gulp.watch('app/css/*.less', function() {
    gulp.run('less');
  });
  
  //Add watching on js-files
  gulp.watch(['!app/vendorJS/*.js'
              ,'app/**/*.js'], function() {
    gulp.run('hint');
    gulp.run('js');
  });

  // // Add watching on vendor JS
  // gulp.watch('app/vendor/*.js', function() {
  //   gulp.run('vendorJS');
  // });
 
  //Add watching on html-files
  gulp.watch(['app/index.html','app/**/*.html'], function () {
    gulp.run('html');
  });
});
 
gulp.task('default', function () {
  gulp.run('build', 'serve', 'watch');
});