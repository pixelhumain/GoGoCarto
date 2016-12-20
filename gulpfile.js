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
    //livereload = require('gulp-livereload'),
    del = require('del'),
    gulpUtil = require('gulp-util');
    // ts = require("gulp-typescript");

//var coreTsProject = ts.createProject("web/assets/js/core.tsconfig.json");


gulp.task('prod_styles', function() {
  return gulp.src('web/assets/css/**/*.css')
    //.pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('web/assets/css'));
    //.pipe(notify({ message: 'Styles task complete' }));
});

gulp.task('sass', function () {
  return gulp.src('web/assets/scss//**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('web/assets/css'));
});

gulp.task('prod_js', function() {
  return gulp.src(['web/js/home/**/*.js','web/js/directory.js','web/js/element-form.js'])
    //.pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    //.pipe(minify())
    //.pipe(sourcemaps.init({loadMaps: true}))
    //.pipe(uglify().on('error', gulpUtil.log)) // notice the error event here
    //.pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('web/js'));
});



gulp.task('scriptsDirectory', function() {
  // return coreTsProject.src()
  //       .pipe(coreTsProject())
  //       .pipe(gulp.dest('web/js'));

  return gulp.src(['web/assets/js/**/*.js', '!web/assets/js/libs/**/*.js', '!web/assets/js/home/**/*.js', '!web/assets/js/element-form/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'))
    .on('error', notify.onError({ message: 'JS hint fail'}))
    .pipe(concat('directory.js'))
    //.pipe(livereload())
    .pipe(gulp.dest('web/js'));
});

gulp.task('typescript', function() {
  return coreTsProject.src()
        .pipe(coreTsProject())
        .pipe(gulp.dest('web/js'));
  // return gulp.src('web/assets/js/index.ts')
  //       .pipe(ts({
  //           noImplicitAny: true,
  //           out: 'output.js'
  //       }))
  //       .pipe(gulp.dest('built/local'));
});

gulp.task('scriptsElementForm', function() {
  return gulp.src(['web/assets/js/element-form/**/*.js','web/assets/js/commons.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'))
    .on('error', notify.onError({ message: 'JS hint fail'}))
    .pipe(concat('element-form.js'))
    //.pipe(livereload())
    .pipe(gulp.dest('web/js'));
});

gulp.task('scriptsHome', function() {
  return gulp.src(['web/assets/js/home/**/*.js','web/assets/js/commons.js','web/assets/js/components/search-bar.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'))
    .on('error', notify.onError({ message: 'JS hint fail'}))
    .pipe(concat('home.js'))
    //.pipe(livereload())
    .pipe(gulp.dest('web/js'));
});

gulp.task('scriptsLibs', function() {
  return gulp.src(['web/assets/js/libs/**/*.js', '!web/assets/js/libs/materialize/unused/**/*.js'])
    .pipe(concat('libs.js'))
    .pipe(rename({suffix: '.min'}))
    //.pipe(uglify())
    .pipe(gulp.dest('web/js'));
    //.pipe(livereload());
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
});

gulp.task('watch', function() {

  //livereload.listen();
  // Watch .scss files
  gulp.watch('web/assets/scss/**/*.scss', ['sass']);

  // Watch .js files
  gulp.watch(['web/assets/js/**/*.js', '!web/assets/js/libs/**/*.js', '!web/assets/js/home/**/*.js', '!web/assets/js/element-form/**/*.js'], ['scriptsDirectory']);
  
  gulp.watch(['web/assets/js/element-form/**/*.js','web/assets/js/commons.js'], ['scriptsElementForm']);
  
  gulp.watch('web/assets/js/libs/**/*.js', ['scriptsLibs']);

  gulp.watch(['web/assets/js/home/**/*.js','web/assets/js/commons.js','web/assets/js/components/search-bar.js'], ['scriptsHome']);
  // Watch image files
  //gulp.watch('src/img/*', ['images']);


});

gulp.task('clean', function(cb) {
    del(['dist/css', 'dist/js', 'dist/img'], cb);
});

gulp.task('build', function() {
    gulp.start('sass', 'scriptsLibs', 'scriptsHome', 'scriptsElementForm','scriptsDirectory');
});

gulp.task('production', function() {
    gulp.start('prod_styles', 'prod_js');
});

