var gulp = require('gulp');
var ejs = require('gulp-ejs');
var prettify = require('gulp-prettify');
var htmlPrettify = require('gulp-html-prettify');
var htmlhint = require('gulp-htmlhint');
var sass = require('gulp-sass');
var wiredep = require('wiredep').stream;
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var watch = require('gulp-watch');

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
  gulp.src('app/src/common/_*.ejs')
    .pipe(wiredep({
      exclude: ['bootstrap-sass'],
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app/src/common'));
});

gulp.task('serve', ['ejs', 'sass'], function () {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['dist'],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch([
    'dist/**/*.html'
  ]).on('change', reload);

  gulp.watch(['app/src/common/_*.ejs'], ['ejs']);
  gulp.watch(['app/src/modules/**/*.ejs'], ['ejs']);
});

gulp.task('build', function() {
  runSequence('ejs', 'sass');
});

gulp.task('default', function() {

});
