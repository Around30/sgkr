var gulp = require('gulp');
var ejs = require('gulp-ejs');
var prettify = require('gulp-prettify');
var htmlPrettify = require('gulp-html-prettify');
var htmlhint = require('gulp-htmlhint');
var sass = require('gulp-sass');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');

gulp.task('ejs', function() {
  gulp.src(['app/src/modules/**/*.ejs', '!app/src/common/_*.ejs'])
  .pipe(ejs())
  .pipe(prettify())
  .pipe(htmlPrettify({
    indent_size: 2
  }))
  .pipe(htmlhint())
  .pipe(gulp.dest('dist'))
});

gulp.task('sass', function() {
  gulp.src(['app/src/styles/main.scss'])
  .pipe(sass())
  .pipe(gulp.dest('dist/css'))
})

gulp.task('wiredep', function () {
  var wiredep = require('wiredep').stream;

  gulp.src('app/src/styles/*.scss')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/
    }))
    .pipe(gulp.dest('app/src/styles'));

  gulp.src('app/src/modules/**/*.ejs')
    .pipe(wiredep({
      exclude: ['bootstrap-sass-official'],
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app/src'));
});

gulp.task('serve', ['sass'], function () {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['dist'],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  })
});

gulp.task('build', function() {
  runSequence('ejs', 'sass');
});
