<<<<<<< HEAD
var gulp = require('gulp'),
    sass = require('gulp-sass'),
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
    del = require('del'),
    gulpUtil = require('gulp-util');


gulp.task('prod_styles', function() {
  return gulp.src('web/assets/css/**/*.css')
    //.pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('web/assets/css'));
    //.pipe(notify({ message: 'Styles task complete' }));
});

gulp.task('sass', function () {
  return sass('web/assets/scss/**/*.scss')
    .on('error', sass.logError)
    .pipe(gulp.dest('web/assets/css'))
});

gulp.task('prod_js', function() {
  return gulp.src(['web/js/index.js','web/js/constelisting.js','web/js/fournisseur-add-edit.js'])
    //.pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    //.pipe(minify())
    //.pipe(sourcemaps.init({loadMaps: true}))
    //.pipe(uglify().on('error', gulpUtil.log)) // notice the error event here
    //.pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('web/js'));;
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
});

gulp.task('scriptsIndex', function() {
  return gulp.src(['web/assets/js/index.js','web/assets/js/commons.js','web/assets/js/components/inputAddress.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'))
    .on('error', notify.onError({ message: 'JS hint fail'}))
    .pipe(concat('index.js'))
    .pipe(livereload())
    .pipe(gulp.dest('web/js'));
});

gulp.task('scriptsLibs', function() {
  return gulp.src('web/assets/js/libs/**/*.js')
    .pipe(concat('libs.js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('web/js'))
    .pipe(livereload());
    //.pipe(notify({ message: 'Scripts Libs task complete' }));
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

  gulp.watch(['web/assets/js/index.js','web/assets/js/commons.js','web/assets/js/components/inputAddress.js'], ['scriptsIndex']);
  // Watch image files
  //gulp.watch('src/img/*', ['images']);


});

gulp.task('clean', function(cb) {
    del(['dist/css', 'dist/js', 'dist/img'], cb)
});

gulp.task('build', function() {
    gulp.start('sass', 'scriptsLibs', 'scriptsIndex', 'scriptsFournisseurAddEdit','scriptsConstelisting');
});

gulp.task('production', function() {
    gulp.start('prod_styles', 'prod_js');
});




 
=======
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
    del = require('del'),
    gulpUtil = require('gulp-util'),
    minify = require('gulp-minify');


gulp.task('prod_styles', function() {
  return gulp.src('web/assets/css/**/*.css')
    //.pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('web/assets/css'));
    //.pipe(notify({ message: 'Styles task complete' }));
});

gulp.task('sass', function () {
  return sass('web/assets/scss/**/*.scss')
    .on('error', sass.logError)
    .pipe(gulp.dest('web/assets/css'))
});

gulp.task('prod_js', function() {
  return gulp.src(['web/js/index.js','web/js/constelisting.js','web/js/element-add-edit.js'])
    //.pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    //.pipe(minify())
    //.pipe(sourcemaps.init({loadMaps: true}))
    //.pipe(uglify().on('error', gulpUtil.log)) // notice the error event here
    //.pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('web/js'));;
});

gulp.task('scriptsConstelisting', function() {
  return gulp.src(['web/assets/js/**/*.js', '!web/assets/js/libs/**/*.js', '!web/assets/js/index.js', '!web/assets/js/element-add-edit/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'))
    .on('error', notify.onError({ message: 'JS hint fail'}))
    .pipe(concat('constelisting.js'))
    .pipe(livereload())
    .pipe(gulp.dest('web/js'));
});

gulp.task('scriptsElementAddEdit', function() {
  return gulp.src(['web/assets/js/element-add-edit/**/*.js','web/assets/js/commons.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'))
    .on('error', notify.onError({ message: 'JS hint fail'}))
    .pipe(concat('element-add-edit.js'))
    .pipe(livereload())
    .pipe(gulp.dest('web/js'));
});

gulp.task('scriptsIndex', function() {
  return gulp.src(['web/assets/js/index.js','web/assets/js/commons.js','web/assets/js/components/inputAddress.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'))
    .on('error', notify.onError({ message: 'JS hint fail'}))
    .pipe(concat('index.js'))
    .pipe(livereload())
    .pipe(gulp.dest('web/js'));
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
  gulp.watch(['web/assets/js/**/*.js', '!web/assets/js/libs/**/*.js', '!web/assets/js/index.js', '!web/assets/js/element-add-edit/**/*.js'], ['scriptsConstelisting']);
  
  gulp.watch(['web/assets/js/element-add-edit/**/*.js','web/assets/js/commons.js'], ['scriptsElementAddEdit']);
  
  gulp.watch('web/assets/js/libs/**/*.js', ['scriptsLibs']);

  gulp.watch(['web/assets/js/index.js','web/assets/js/commons.js','web/assets/js/components/inputAddress.js'], ['scriptsIndex']);
  // Watch image files
  //gulp.watch('src/img/*', ['images']);


});

gulp.task('clean', function(cb) {
    del(['dist/css', 'dist/js', 'dist/img'], cb)
});

gulp.task('build', function() {
    gulp.start('sass', 'scriptsLibs', 'scriptsIndex', 'scriptsElementAddEdit','scriptsConstelisting');
});

gulp.task('production', function() {
    gulp.start('prod_styles', 'prod_js');
});




 
>>>>>>> refactoring
