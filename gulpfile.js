// Include gulp
var gulp = require('gulp');
 // Include plugins
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
 // Minify JS
gulp.task('scripts', function() {
    return gulp.src('*.js')
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest(''));
});
 // Default Task
gulp.task('default', ['scripts']);