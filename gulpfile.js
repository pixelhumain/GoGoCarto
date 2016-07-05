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
    .pipe(gulp.dest('web/assets/css'))
    .pipe(livereload());
	//.pipe(notify({ message: 'Sass task complete' }));
});

gulp.task('scriptsConstelisting', function() {
  return gulp.src(['web/assets/js/**/*.js', '!web/assets/js/libs/**/*.js', '!web/assets/js/index.js', '!web/assets/js/fournisseur-add-edit/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'))
    .on('error', notify.onError({ message: 'JS hint fail'}))
    .pipe(concat('constelisting.js'))
    .pipe(livereload())
    .pipe(gulp.dest('web/js'));
    //.pipe(rename({suffix: '.min'}))
    //.pipe(uglify())
    //.pipe(gulp.dest('dist/js'))
    //.pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('scriptsFournisseurAddEdit', function() {
  return gulp.src(['web/assets/js/fournisseur-add-edit/**/*.js','web/assets/js/commons.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'))
    .on('error', notify.onError({ message: 'JS hint fail'}))
    .pipe(concat('fournisseur-add-edit.js'))
    .pipe(livereload())
    .pipe(gulp.dest('web/js'));
    //.pipe(rename({suffix: '.min'}))
    //.pipe(uglify())
    //.pipe(gulp.dest('dist/js'))
    //.pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('scriptsLibs', function() {
  return gulp.src('web/assets/js/libs/**/*.js')
    .pipe(concat('libs.js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('web/js'))
    .pipe(livereload())
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

  livereload.listen();
  // Watch .scss files
  gulp.watch('web/assets/scss/**/*.scss', ['sass']);

  // Watch .js files
  gulp.watch(['web/assets/js/**/*.js', '!web/assets/js/libs/**/*.js', '!web/assets/js/index.js', '!web/assets/js/fournisseur-add-edit/**/*.js'], ['scriptsConstelisting']);
  
  gulp.watch(['web/assets/js/fournisseur-add-edit/**/*.js','web/assets/js/commons.js'], ['scriptsFournisseurAddEdit']);
  
  gulp.watch('web/assets/js/libs/**/*.js', ['scriptsLibs']);
  // Watch image files
  //gulp.watch('src/img/*', ['images']);


});

gulp.task('clean', function(cb) {
    del(['dist/css', 'dist/js', 'dist/img'], cb)
});

gulp.task('default', function() {
    gulp.start('styles', 'scripts', 'images', 'copy');
});




 
