var gulp = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-ruby-sass');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

var sass_paths = ['./theme/static/css/styles.scss',
                   './theme/static/css/_variables.scss',
                   './theme/static/css/_bootstrap.scss',
                 ];
var css_paths = ['./bower_components/jquery-minicolors/jquery.minicolors.css',
                   './theme/static/css/styles.css'
                 ];

gulp.task('js', ['plugins'], function () {
    gulp.src(['./theme/static/js/plugins.js',
              './theme/static/js/main.js'])
        .pipe(concat('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./theme/static/js'));

});

gulp.task('plugins', function () {
    gulp.src(["bower_components/jquery-minicolors/jquery.minicolors.js",
              "bower_components/jquery.lazyload/jquery.lazyload.js"])
        .pipe(concat("plugins.js"))
        .pipe(uglify())
        .pipe(gulp.dest('./theme/static/js'));
    gulp.src(["bower_components/jquery-minicolors/jquery.minicolors.png"])
        .pipe(gulp.dest('./theme/static/css'));
});

gulp.task('sass', function () {
    //Move all bootstrap files into css /bootstrap dir
    gulp.src(['./bower_components/bootstrap-sass-official/vendor/assets/stylesheets/bootstrap/*.scss'])
        .pipe(gulp.dest('./theme/static/css/bootstrap'));
    //Sass my files into styles.css
    gulp.src(['./theme/static/css/styles.scss'])
        .pipe(sass())
        .pipe(gulp.dest('./theme/static/css'));
});

gulp.task('css', function(){
    gulp.src(css_paths)
        .pipe(concat('all.css'))
        .pipe(gulp.dest('./theme/static/css'));
});

gulp.task('watch', function() {
    gulp.watch(sass_paths, ['sass']);
    gulp.watch(css_paths, ['css']);
});

gulp.task('default', [
    'js',
    'sass',
    'css'
]);
