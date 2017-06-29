var gulp = require('gulp'),
    sass = require('gulp-sass'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    gzip = require('gulp-gzip'),
    del = require('del'),
    notifier = require('node-notifier');

function handleError(err) {
  console.log(err.toString());
  notifier.notify({
  'title': 'Gulp worflow',
  'message': 'Typescript error'
  });
  this.emit('end');
}

gulp.task("scriptsHome", function () {
   return gulp.src(['src/Biopen/CoreBundle/Resources/js/home.js'])
    .pipe(concat('home.js'))
    .pipe(gulp.dest('web/js'));
});

gulp.task('scriptsElementForm', function() {
  return gulp.src(['src/Biopen/GeoDirectoryBundle/Resources/js/element-form/**/*.js'])
    .pipe(concat('element-form.js'))
    //.pipe(livereload())
    .pipe(gulp.dest('web/js'));
});

gulp.task('scriptsLibs', function() {
  return gulp.src(['node_modules/GoGoCartoJs/dist/gogocarto.min.js',
                   'src/Biopen/GeoDirectoryBundle/Resources/js/libs/**/*.js', 
                   'web/bundles/fosjsrouting/js/router.js',
                   ])
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

gulp.task('prod_styles' ,function() {
  return gulp.src('web/assets/css/**/*.css')
    //.pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gzip())
    .pipe(gulp.dest('web/assets/css'));
    //.pipe(notify({ message: 'Styles task complete' }));
});


gulp.task('gzip_styles', ['prod_styles'], function() {
  return gulp.src('web/assets/css/**/*.css')
    //.pipe(rename({suffix: '.min'}))
    //.pipe(minifycss())
    .pipe(gzip())
    .pipe(gulp.dest('web/assets/css'));
    //.pipe(notify({ message: 'Styles task complete' }));
});

gulp.task('prod_js', function() {
  return gulp.src(['web/js/*.js'])
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    //.pipe(sourcemaps.init({loadMaps: true}))
    //.pipe(uglify().on('error', gulpUtil.log)) // notice the error event here
    //.pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('web/js'));
});

gulp.task('gzip_js', ['prod_js'],  function() {
  return gulp.src(['web/js/*.js'])
    .pipe(gzip())
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
  
  gulp.watch(['src/Biopen/GeoDirectoryBundle/Resources/js/element-form/**/*.js'], 
              ['scriptsElementForm']);
  
  gulp.watch(['src/Biopen/GeoDirectoryBundle/Resources/js/libs/**/*.js','../node_modules/GoGoCartoJs/dist/gogocarto.js'], ['scriptsLibs']);

  gulp.watch(['src/Biopen/CoreBundle/Resources/js/**/*js'], ['scriptsHome']);
  // Watch image files
  //gulp.watch('src/img/*', ['images']);


});

gulp.task('clean', function(cb) {
    del(['web/assets/css/*.css', 'web/js'], cb);
});

gulp.task('build', function() {
    gulp.start('clean','sass', 'scriptsLibs', 'scriptsHome', 'scriptsElementForm');
});

gulp.task('production', function() {
    gulp.start('gzip_styles', 'gzip_js');
});

