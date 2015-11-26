var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var nano = require('gulp-cssnano');

var compileDirectories = ['./public/css/**/*.scss', '!./public/css/bootstrap/**/*'];
var watchDirectories = ['./public/css/**/*.scss', './gulpfile.js'];
var outputDirectory = './public/css';

gulp.task('compile', function() {
    gulp.src('./public/css/styles.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(nano())
        .pipe(sourcemaps.write('../css'))
        .pipe(gulp.dest(outputDirectory));
});

gulp.task('watch', function() {
    return gulp.watch(watchDirectories, ['compile']);
});

gulp.task('default', ['compile']);