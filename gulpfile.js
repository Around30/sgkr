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
var sass = require('gulp-sass');
var filter = require('gulp-filter');
var autoprefixer = require('gulp-autoprefixer');
var eventStream = require('event-stream').merge;
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');
var wiredep = require('wiredep').stream;
var useref = require('gulp-useref'),
    assets = useref.assets({searchPath: 'dist'});
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync'),
    reload = browserSync.reload;
var watch = require('gulp-watch');

/*
　■■■＼　　　■■＼　　■■■＼　■＼　■＼
　■＼＼■＼　■＼＼■＼　＼■＼＼　■＼　■＼
　■■■＼　　■＼　■＼　　■＼　　■■■■＼
　■＼＼　　　■■■■＼　　■＼　　■＼　■＼
　■＼　　　　■＼＼■＼　　■＼　　■＼　■＼
*/



/*
　■■■＼　　■■＼　　　■■■＼　■＼　■＼
　＼■＼＼　■＼＼■＼　■＼＼＼＼　■＼■＼＼
　　■＼　　■＼　■＼　＼■■＼　　■■＼＼
　　■＼　　■■■■＼　　＼＼■＼　■＼■＼
　　■＼　　■＼＼■＼　■■■＼＼　■＼　■＼
*/

gulp.task('ejs', function() {
  gulp.src(['app/src/modules/**/*.ejs'])
  .pipe(ejs())
  .pipe(prettify())
  .pipe(htmlPrettify({
    indent_size: 2
  }))
  .pipe(htmlhint())
  .pipe(gulp.dest('dist'))
});

gulp.task('sass', function(done) {
  gulp.src(['app/src/sass/main.scss'])
  .pipe(plumber())
  .pipe(sass())
  .pipe(filter('sass/main.css'))
  .pipe(autoprefixer())
  .pipe(gulp.dest('dist/css'))
  .on('end', function() {
    gulp.src(['bower_components/normalize-css/normalize.css', 'dist/css/*.css'])
    .pipe(concat('main.css'))
    .pipe(gulp.dest('dist/css'))
    .on('end', done);
  });
});

gulp.task('js', function() {
  return eventStream(
    gulp.src(['bower_components/angular/angular.js', 'bower_components/jquery/dist/jquery.js'])
    .pipe(concat('vendor.js'))
    .pipe(uglify({
      preserveComments: 'some'
    }))
    .pipe(gulp.dest('dist/js')),

    gulp.src(['bower_components/bootstrap-sass/assets/javascripts/bootstrap/*js'])
    .pipe(concat('plugins.js'))
    .pipe(uglify({
      preserveComments: 'some'
    }))
    .pipe(gulp.dest('dist/js')),

    gulp.src(['app/src/js/*js'])
    .pipe(concat('main.js'))
    .pipe(uglify({
      preserveComments: 'some'
    }))
    .pipe(gulp.dest('dist/js'))
  )
});

gulp.task('wiredep', function () {
  gulp.src('dist/*.html')
    .pipe(wiredep({
      exclude: ['bootstrap-sass'],
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(assets)
    .pipe(assets.restore())
    .pipe(useref())
    .pipe(gulp.dest('dist'))
});

gulp.task('serve', function () {
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
    'dist/**/*.html',
    'dist/css/*css',
    'dist/js/*js'
  ]).on('change', reload);

  gulp.watch(['app/src/common/*.ejs'], ['ejs']);
  gulp.watch(['app/src/modules/**/*.ejs'], ['ejs']);
  gulp.watch(['app/src/sass/*.scss'], ['sass']);
  gulp.watch(['app/src/js/*.js'], ['js']);
});

gulp.task('build', function() {
  runSequence('ejs', 'sass', 'js', 'wiredep');
});

gulp.task('default', function() {

});
