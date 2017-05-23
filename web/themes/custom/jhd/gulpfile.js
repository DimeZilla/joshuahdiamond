const gulp         = require('gulp');
const path         = require('path');
// webpack a go go
const webpack      = require('webpack-stream');
let wpConfig       = require('./webpack.config');

// browser sync action
const browserSync  = require('browser-sync').create();


// sass and css dependencies
const autoprefixer = require('autoprefixer');
const sass         = require('gulp-sass');
const sassGlob     = require('gulp-sass-glob');
const sourcemaps   = require('gulp-sourcemaps');
const flexibility  = require('postcss-flexibility');
const postcss      = require('gulp-postcss');
const cleanCSS     = require('gulp-clean-css');

// lets get ndoe exec so that we can clear cache when files change
const exec         = require('child_process').execSync;

// for our fonts
const flatten      = require('gulp-flatten');

// set your devUrl for browserSync
let config = {
  devUrl: 'joshuahdiamond.dev'
};

// Our Error handler
function onError(err) {
  console.error(err);
  this.emit('end');
}

// gettin sassy with our css
gulp.task('sass', () => {
  return gulp.src('./assets/scss/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/css'))
    .on('error', onError);
});

gulp.task('postcss', ['sass'], () => {
  var postcssProcessors = [
    autoprefixer({
      browsers: [
        'last 2 versions',
        'android 4',
        'opera 12',
        'ie 9'
      ]
    }),
    flexibility,
  ];

  return gulp.src('./dist/css/*.css')
    .pipe(postcss(postcssProcessors))
    .pipe(gulp.dest('./dist/css'))
    .on('error', onError);
});

gulp.task('minify-css', ['postcss'], () => {
  return gulp.src([
      './dist/css/*.css',
    ])
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('./dist/css'))
    .on('error', onError);
});


// ### Fonts
// `gulp fonts` - Grabs all the fonts and outputs them in a flattened directory
// structure. See: https://github.com/armed/gulp-flatten
gulp.task('fonts', () => {
  return gulp.src('./assets/fonts/**/*')
    // .pipe(flatten())
    .pipe(gulp.dest('./dist/fonts'))
    .pipe(browserSync.stream());
});

// Put your webpack on and lets fly
gulp.task('webpack', () => {
  return gulp.src('./assets/js/index.js')
    .pipe(webpack( wpConfig ))
      .on('error',onError)
    .pipe(gulp.dest( wpConfig.output.path ))
      .on('error', onError);
});


/*
 * this is not ready yet - we want to be able to run drush cache reload when
 * things change but I don't know what is going on
 function ourExec(cmd){
  return () => {
      exec(cmd, (err, stdin, stdout) => {
        console.error(err);
        console.log(stdin);
        console.log(stdout);
      });
      return true;
  }
}
*/
gulp.task('watch', () => {

  browserSync.init({
    proxy: config.devUrl
  });

  let reload = () => {
    browserSync.reload();
  };

  // if any of our sass assets change, lets reload
  gulp.watch('./assets/scss/*', ['sass']).on('change',reload);
  gulp.watch('./assets/scss/**/*', ['sass']).on('change',reload);

  // if any of our js assets, lets run webpack
  gulp.watch('./assets/js/*', ['webpack']).on('change',reload);
  gulp.watch('./assests/js/**/*', ['webpack']).on('change',reload);

  // if any of our templates change, lets also reload
  gulp.watch('./templates/*', reload);
  gulp.watch('./templates/**/*', reload);

  // if any php files change, lets fire a reload as well
  gulp.watch('./*.php', reload);
  gulp.watch('./**/*.php', reload);

  // if our configuration files change, lets clear cache and reload browserify
  // gulp.watch('./*.yml', ourExec('sh gulp_helpers/clearcache.sh')).on('change', reload);
  
  // compile and glaten our fonts
  gulp.watch('./assets/fonts/**/*', ['fonts']).on('change',reload);
});

gulp.task('default', ['minify-css']);
