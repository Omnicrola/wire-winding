var gulp = require('gulp');
var vulcanize = require('gulp-vulcanize');
var concat = require('gulp-concat');

gulp.task('default', function()
);

gulp.task('vulcanize', function () {
    return gulp.src('src/index.html')
        .pipe(vulcanize({
            abspath: '',
            excludes: [],
            stripExcludes: false
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('scripts', function(){
    return gulp.src('src/js/*.js')
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/js'));
});