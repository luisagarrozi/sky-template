const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();

// Paths
const paths = {
  scss: 'src/scss/**/*.scss',
  js: 'src/js/**/*.js',
  html: './index.html'
};

// Compile Sass & minify CSS
function styles() {
  return gulp.src('src/scss/styles.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
}

// Minify JS
function scripts() {
  return gulp.src(paths.js)
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.stream());
}

// Serve & watch
function serve() {
  browserSync.init({
    server: {
      baseDir: './'
    }
  });

  gulp.watch(paths.scss, styles);
  gulp.watch(paths.js, scripts);
  gulp.watch(paths.html).on('change', browserSync.reload);
}

exports.styles = styles;
exports.scripts = scripts;
exports.serve = gulp.series(styles, scripts, serve);
exports.default = gulp.series(styles, scripts, serve);