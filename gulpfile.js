/*
　■■■＼　　■＼　　　■＼　■＼　　■■■＼　■＼　■＼　■＼
　■＼＼■＼　■＼　　　■＼　■＼　■＼＼＼＼　■＼　■■＼■＼
　■■■＼　　■＼　　　■＼　■＼　■＼■■＼　■＼　■＼■■＼
　■＼＼　　　■＼　　　■＼　■＼　■＼＼■＼　■＼　■＼＼■＼
　■＼　　　　■■■＼　　■■＼　　　■■■＼　■＼　■＼　■＼
*/

var gulp = require('gulp');
var ejs = require('gulp-ejs');
var prettify = require('gulp-prettify');
var htmlPrettify = require('gulp-html-prettify');
var htmlhint = require('gulp-htmlhint');
var plumber = require('gulp-plumber');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var eventStream = require('event-stream').merge;
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var watch = require('gulp-watch');

/*
　■■■＼　　　■■＼　　■■■＼　■＼　■＼
　■＼＼■＼　■＼＼■＼　＼■＼＼　■＼　■＼
　■■■＼　　■＼　■＼　　■＼　　■■■■＼
　■＼＼　　　■■■■＼　　■＼　　■＼　■＼
　■＼　　　　■＼＼■＼　　■＼　　■＼　■＼
*/

var commmonPath = 'app/src/common/';
var modulesPath = 'app/src/modules/';
var sassPath = 'app/src/sass/';
var jsPath = 'app/src/js/';
var imagesPath = 'app/src/images/';
var componentsPath = 'bower_components/';
var distVeiwPath = 'dist/view';
var distCssPath = 'dist/css';
var distJsPath = 'dist/js';
var distImgPath = 'dist/img';

/*
　■■■＼　　■■＼　　　■■■＼　■＼　■＼
　＼■＼＼　■＼＼■＼　■＼＼＼＼　■＼■＼＼
　　■＼　　■＼　■＼　＼■■＼　　■■＼＼
　　■＼　　■■■■＼　　＼＼■＼　■＼■＼
　　■＼　　■＼＼■＼　■■■＼＼　■＼　■＼
*/

gulp.task('html', function() {
  gulp.src([modulesPath + '**/*.ejs'])
  .pipe(ejs())
  .pipe(prettify())
  .pipe(htmlPrettify({
    indent_size: 2
  }))
  .pipe(htmlhint())
  .pipe(gulp.dest(distVeiwPath))
});

gulp.task('css', function(done) {
  gulp.src([sassPath + '*.scss'])
  .pipe(plumber())
  .pipe(concat('main.scss'))
  .pipe(sass())
  .pipe(gulp.dest(distCssPath))
  .on('end', function() {
    gulp.src([componentsPath + 'normalize-css/normalize.css', 'dist/css/*.css'])
    .pipe(concat('main.css'))
    .pipe(gulp.dest(distCssPath))
    .on('end', done);
  });
});

gulp.task('js', function() {
  return eventStream(
    gulp.src([componentsPath + 'angular/angular.js', componentsPath + 'jquery/dist/jquery.js'])
    .pipe(concat('vendor.js'))
    .pipe(uglify({
      preserveComments: 'some'
    }))
    .pipe(gulp.dest(distJsPath)),

    gulp.src([componentsPath + 'bootstrap-sass/assets/javascripts/bootstrap/*.js'])
    .pipe(concat('plugins.js'))
    .pipe(uglify({
      preserveComments: 'some'
    }))
    .pipe(gulp.dest(distJsPath)),

    gulp.src([jsPath + '*.js'])
    .pipe(concat('main.js'))
    .pipe(uglify({
      preserveComments: 'some'
    }))
    .pipe(gulp.dest(distJsPath))
  )
});

gulp.task('img', function() {
  gulp.src([imagesPath + '**/*'])
  .pipe(cache(imagemin({
    progressive: true,
    interlaced: true
  })))
  .pipe(gulp.dest(distImgPath))
});

gulp.task('serve', ['build'], function () {
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
    distVeiwPath + '**/*.html',
    distCssPath + '*.css',
    distJsPath + '*.js'
  ]).on('change', reload);

  gulp.watch([commmonPath + '*.ejs'], ['ejs']);
  gulp.watch([modulesPath + 'view/**/*.ejs'], ['ejs']);
  gulp.watch([sassPath + '*.scss'], ['sass']);
  gulp.watch([jsPath + '*.js'], ['js']);
});

gulp.task('build', function() {
  runSequence('html', 'css', 'js', 'img');
});

gulp.task('default', function() {

});
