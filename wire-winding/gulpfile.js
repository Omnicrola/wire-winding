var gulp = require('gulp');
var vulcanize = require('gulp-vulcanize');
var concat = require('gulp-concat');
var useref = require('gulp-useref');

var outputFolder = './dist';
gulp.task('default', ['copy-index', 'vulcanize', 'scripts', 'copy-webcomponents']);

gulp.task('vulcanize', function () {
    return gulp.src([
        'src/index.html'
    ])
        .pipe(vulcanize({
            abspath: '',
            excludes: [],
            stripExcludes: false
        }))
        .pipe(gulp.dest(outputFolder));
});

gulp.task('copy-webcomponents', function () {
    return gulp.src([
        'bower_components/webcomponentsjs/webcomponents-lite.min.js',
        'bower_components/polymer/polymer.html',
        'bower_components/platform/platform.js'
    ])
        .pipe(gulp.dest(outputFolder + '/components'));
});

gulp.task('copy-index', function () {
    return gulp.src('./index.html')
        .pipe(gulp.dest(outputFolder));
});

gulp.task('scripts', function () {
    return gulp.src('src/js/*.js')
        .pipe(concat('main.js'))
        .pipe(gulp.dest(outputFolder + '/js'));
});