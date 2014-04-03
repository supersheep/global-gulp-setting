var gulp = require("gulp");
var minifycss = require("gulp-minify-css");
var uglify = require("gulp-uglify");
var imagemin = require("gulp-imagemin");
var rename = require("gulp-rename");
var cache = require('gulp-cache');
var jshint = require('gulp-jshint');
var absoluteimage = require("gulp-absolute-image");
var ftp = require('gulp-ftp');
var path = require('path');
var util = require('util');
var fs = require('fs');
var cwd = process.env.WORKSPACE || process.cwd();
var pkg = require(path.join(cwd,"./package.json"));

var ftpconfig = eval('(' + fs.readFileSync( path.join(__dirname,'.ftppass'),'utf-8') + ')');

gulp.task("scripts", function(){
    gulp.src([".cortex/built/**/*.js","!.cortex/built/**/*.min.js"])
        .pipe(jshint('/Users/spud/.gulp/.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('.cortex/built'));
});

gulp.task("css",function(){
    gulp.src(['.cortex/built/**/*.css','!.cortex/built/**/*.min.css'])
        .pipe(absoluteimage({
            root_dir: ".cortex/built",
            root_path: util.format("mod/%s/%s",pkg.name,pkg.version),
            hosts: ["i1.static.dp","i2.static.dp","i3.static.dp"]
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('.cortex/built'));
});

gulp.task("image",function(){
    gulp.src([".cortex/built/**/*.{gif,jpg,png}"])
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest('.cortex/built'));
});

gulp.task("upload",function(){
    gulp.src('.cortex/built/**/*')
        .pipe(ftp(ftpconfig));
});

gulp.task('default', ['scripts','css','image','upload']);