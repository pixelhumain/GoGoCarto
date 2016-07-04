var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del');

gulp.task('styles', function() {
  return gulp.src('web/assets/css/**/*.css')
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('web/assets/css'));
    //.pipe(notify({ message: 'Styles task complete' }));
});

gulp.task('sass', function () {
  return sass('web/assets/scss/**/*.scss')
    .on('error', sass.logError)
    .pipe(gulp.dest('web/assets/css'));
	//.pipe(notify({ message: 'Sass task complete' }));
});

gulp.task('scripts', function() {
  return gulp.src(['web/assets/js/**/*.js', '!web/assets/js/libs/**/*.js', '!web/assets/js/index.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'))
    .on('error', notify.onError({ message: 'JS hint fail'}))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('web/js'));
    //.pipe(rename({suffix: '.min'}))
    //.pipe(uglify())
    //.pipe(gulp.dest('dist/js'))
    //.pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('scriptsLibs', function() {
  return gulp.src('web/assets/js/libs/**/*.js')
    //.pipe(jshint())
    //.pipe(jshint.reporter('default'))
    .pipe(concat('libs.js'))
    //.pipe(gulp.dest('web/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('web/js'))
    .pipe(notify({ message: 'Scripts Libs task complete' }));
});

gulp.task('images', function() {
  return gulp.src('src/img/*')
    .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/img'))
    .pipe(notify({ message: 'Images task complete' }));
});

gulp.task('copy', function () {
    gulp.src('images/**/*')
    .pipe(gulp.dest('dist/img'));
    del('images');
    gulp.src('src/fonctions.inc')
    .pipe(gulp.dest('dist/'));
    return gulp.src('src/**/*.php')
    .pipe(gulp.dest('dist/'));
})

gulp.task('watch', function() {

  // Watch .scss files
  gulp.watch('web/assets/scss/**/*.scss', ['sass']);

  // Watch .js files
  gulp.watch('web/assets/js/**/*.js', ['scripts']);

  // Watch image files
  //gulp.watch('src/img/*', ['images']);


});

gulp.task('clean', function(cb) {
    del(['dist/css', 'dist/js', 'dist/img'], cb)
});

gulp.task('default', function() {
    gulp.start('styles', 'scripts', 'images', 'copy');
});




 
