var gulp = require('gulp');
var ejs = require('gulp-ejs');
var stylus = require('gulp-stylus');
var prettify = require('gulp-prettify');
var htmlPrettify = require('gulp-html-prettify');
var htmlhint = require('gulp-htmlhint');
var runSequence = require('run-sequence');

gulp.task('ejs', function () {
    gulp.src(['app/src/modules/**/*.ejs', '!app/src/common/_*.ejs'])
        .pipe(ejs())
        .pipe(prettify())
        .pipe(htmlPrettify({
            indent_size: 2
        }))
        .pipe(htmlhint())
        .pipe(gulp.dest('htdocs'))
});

gulp.task('stylus', function () {
    gulp.src(['app/styl/**/*.styl'])
        .pipe(stylus())
        .pipe(gulp.dest('htdocs/css'))
});

gulp.task('build', function () {
    runSequence('ejs', 'stylus');
});
