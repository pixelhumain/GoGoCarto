var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    ts = require("gulp-typescript"),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    gzip = require('gulp-gzip');
    //livereload = require('gulp-livereload'),
    del = require('del'),
    gutil = require('gulp-util'),
    babel = require('gulp-babel');

var gulp = require("gulp");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var tsify = require("tsify");
var uglify = require('gulp-uglify');
const notifier = require('node-notifier');

function handleError(err) {
  console.log(err.toString());
  notifier.notify({
  'title': 'Gulp worflow',
  'message': 'Typescript error'
  });
  this.emit('end');
}

gulp.task("scriptsHome", function () {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['src/Biopen/CoreBundle/Resources/js/home.ts'],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .transform('babelify', {
        presets: ['es2015'],
        extensions: ['.ts']
    })
    .bundle()
    .on('error', handleError)
    .pipe(source('home.js'))
    .pipe(gulp.dest("web/js"));
});

gulp.task("scriptsDirectory", function () {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['src/Biopen/GeoDirectoryBundle/Resources/js/directory/app.module.ts'],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .transform('babelify', {
        presets: ['es2015'],
        extensions: ['.ts']
    })
    .bundle()
    .on('error', handleError)
    .pipe(source('directory.js'))
    .pipe(gulp.dest("web/js"));
});

gulp.task('scriptsElementForm', function() {
  return gulp.src(['src/Biopen/GeoDirectoryBundle/Resources/js/element-form/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'))
    .on('error', notify.onError({ message: 'JS hint fail'}))
    .pipe(concat('element-form.js'))
    //.pipe(livereload())
    .pipe(gulp.dest('web/js'));
});


gulp.task('scriptsLibs', function() {
  return gulp.src(['src/Biopen/GeoDirectoryBundle/Resources/js/libs/**/*.js', '!src/Biopen/GeoDirectoryBundle/Resources/js/libs/materialize/unused/**/*.js'])
    .pipe(concat('libs.js'))
    // .pipe(rename({suffix: '.min'}))
    // .pipe(uglify())
    .pipe(gulp.dest('web/js'));
    //.pipe(livereload());
    //.pipe(notify({ message: 'Scripts Libs task complete' }));
});


gulp.task('sass', function () {
  return gulp.src(['src/Biopen/GeoDirectoryBundle/Resources/scss/**/*.scss',
                  'src/Biopen/CoreBundle/Resources/scss/**/*.scss'])
    .pipe(sass()
    .on('error', sass.logError))    
    .pipe(gulp.dest('web/assets/css'));
});

gulp.task('prod_styles', function() {
  return gulp.src('web/assets/css/**/*.css')
    //.pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gzip())
    .pipe(gulp.dest('web/assets/css'));
    //.pipe(notify({ message: 'Styles task complete' }));
});

gulp.task('prod_js', function() {
  return gulp.src(['web/js/*.js'])
    //.pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gzip())
    //.pipe(minify())
    //.pipe(sourcemaps.init({loadMaps: true}))
    //.pipe(uglify().on('error', gulpUtil.log)) // notice the error event here
    //.pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('web/js'));
});


gulp.task('images', function() {
  return gulp.src('web/assets/img/*')
    .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest('web/assets/imgMin'))
    .pipe(notify({ message: 'Images task complete' }));
});


gulp.task('watch', function() {

  //livereload.listen();
  // Watch .scss files
  gulp.watch(['src/Biopen/GeoDirectoryBundle/Resources/scss/**/*.scss',
              'src/Biopen/CoreBundle/Resources/scss/**/*.scss'], 
              ['sass']);

  // Watch .js files
  gulp.watch(['src/Biopen/GeoDirectoryBundle/Resources/js/directory/**/*.ts', 
              'src/Biopen/GeoDirectoryBundle/Resources/js/commons/**/*.ts'], 
              ['scriptsDirectory']);
  
  gulp.watch(['src/Biopen/GeoDirectoryBundle/Resources/js/element-form/**/*.js'], 
              ['scriptsElementForm']);
  
  gulp.watch('src/Biopen/GeoDirectoryBundle/Resources/js/libs/**/*.js', ['scriptsLibs']);

  gulp.watch(['src/Biopen/CoreBundle/Resources/js/**/*.ts'], ['scriptsHome']);
  // Watch image files
  //gulp.watch('src/img/*', ['images']);


});

gulp.task('clean', function(cb) {
    del(['web/assets/css', 'web/js'], cb);
});

gulp.task('build', function() {
    gulp.start('clean','sass', 'scriptsLibs', 'scriptsHome', 'scriptsElementForm','scriptsDirectory');
});

gulp.task('production', function() {
    gulp.start('build','prod_styles', 'prod_js');
});

