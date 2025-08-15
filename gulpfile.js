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
  assets: 'src/assets/**/*',
  components: 'src/components/**/*',
  html: './index.html'
};

// Compila Sass & minifica CSS
function styles() {
  return gulp.src('src/scss/styles.scss')
    .pipe(sass({
      quietDeps: true,
      silenceDeprecations: ['import', 'global-builtin', 'color-functions']
    }).on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
}

// Minifica JS
function scripts() {
  return gulp.src(paths.js)
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.stream());
}

// Copia assets
function assets() {
  return gulp.src(paths.assets)
    .pipe(gulp.dest('dist/assets'))
    .pipe(browserSync.stream());
}

// Copia componentes
function components() {
  return gulp.src(paths.components)
    .pipe(gulp.dest('dist/components'))
    .pipe(browserSync.stream());
}

// Build e serve
const build = gulp.series(styles, scripts, assets, components);

function serve() {
  browserSync.init({
    server: {
      baseDir: './'
    },
    port: 3000,
    ui: {
      port: 3001
    },
    open: true
  });

  gulp.watch(paths.scss, styles);
  gulp.watch(paths.js, scripts);
  gulp.watch(paths.assets, assets);
  gulp.watch(paths.components, components);
  gulp.watch(paths.html).on('change', browserSync.reload);
}
const run = gulp.series(build, serve);

exports.styles = styles;
exports.scripts = scripts;
exports.build = build;
exports.serve = gulp.series(build, serve);
exports.run = run;
exports.default = run;