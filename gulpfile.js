'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var uncss = require('gulp-uncss');
var nano = require('gulp-cssnano');
var sitemap = require('sitemapper');
var gulpif = require('gulp-if');

var compileDirectories = ['./public/css/**/*.scss', '!./public/css/bootstrap/**/*'];
var watchDirectories = ['./public/css/**/*.scss', './gulpfile.js'];
var outputDirectory = './public/css';

var runUncss = function() {
    if (process.argv.indexOf("--no-uncss") > -1) {
        return false;
    } else {
        return true;
    }
}();

gulp.task('compile', function(done) {
    // Try and load the URLs from the sitemap.xml file so that uncss can
    // remove any unused rules
    // If the server is not running at this address the uncss stage will
    // not doing anything and all CSS rules will be kept intact
    sitemap.getSites('http://localhost:2368/sitemap.xml', function(err, sites) {
        if (err) {
            done(err);
        } else {
            gulp.src('./public/css/styles.scss')
                .pipe(sourcemaps.init())
                .pipe(sass().on('error', sass.logError))
                .pipe(autoprefixer({
                    browsers: ['last 2 versions'],
                    cascade: false
                }))
                .pipe(gulpif(runUncss, uncss({
                    html: sites
                })))
                .pipe(nano())
                .pipe(sourcemaps.write('../css'))
                .pipe(gulp.dest(outputDirectory));
                done();
        }
    });
});

gulp.task('watch', function() {
    return gulp.watch(watchDirectories, ['compile']);
});

gulp.task('default', ['compile']);