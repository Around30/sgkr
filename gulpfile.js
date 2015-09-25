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
var distVeiwPath = 'dist/view/';
var distCssPath = 'dist/css/';
var distJsPath = 'dist/js/';
var distImgPath = 'dist/img';
var jqueryPath = 'jquery/dist/jquery.js';
var angularPath = 'angular/angular.js';
var bootstrapPath = 'bootstrap-sass/assets/javascripts/bootstrap/*.js';
var bxSliderPath = 'bxslider/source/jquery.bxSlider.js';

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

gulp.task('css', function() {
  gulp.src([sassPath + '*.scss'])
  .pipe(plumber())
  .pipe(concat('main.scss'))
  .pipe(sass())
  .pipe(gulp.dest(distCssPath))
});

gulp.task('js', function() {
  return eventStream(
    gulp.src([componentsPath + jqueryPath, componentsPath + angularPath, componentsPath + bxSliderPath])
    .pipe(concat('vendor.js'))
    .pipe(uglify({
      preserveComments: 'some'
    }))
    .pipe(gulp.dest(distJsPath)),

    gulp.src([componentsPath + bootstrapPath])
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
  gulp.src([imagesPath + '**/*', '!' + '**/_*'])
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
      baseDir: ['dist']
      // baseDir: ['dist'],
      // routes: {
      //   '/bower_components': 'bower_components'
      // }
    }
  });

  gulp.watch([
    distVeiwPath + '**/*.html',
    distCssPath + '*.css',
    distJsPath + '*.js'
  ]).on('change', reload);

  gulp.watch([commmonPath + '*.ejs'], ['html']);
  gulp.watch([modulesPath + '**/*.ejs'], ['html']);
  gulp.watch([sassPath + '*.scss'], ['css']);
  gulp.watch([jsPath + '*.js'], ['js']);
});

gulp.task('build', function() {
  runSequence('html', 'css', 'js', 'img');
});

gulp.task('default', function() {

});
