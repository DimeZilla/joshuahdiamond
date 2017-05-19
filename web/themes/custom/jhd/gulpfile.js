const gulp         = require('gulp');
const path         = require('path');
// webpack a go go
const webpack    = require('webpack-stream');
let wpConfig     = require('./webpack.config');

// browser sync action
const webpackDevMid= require('webpack-dev-middleware');
const webpackHotMid= require('webpack-hot-middleware');
const browserSync  = require('browser-sync').create();


// sass and css dependencies
const autoprefixer = require('autoprefixer');
const sass         = require('gulp-sass');
const sassGlob     = require('gulp-sass-glob');
const sourcemaps   = require('gulp-sourcemaps');
const flexibility  = require('postcss-flexibility');
const postcss      = require('gulp-postcss');
const cleanCSS     = require('gulp-clean-css');


// lets run some nifty shell commands
const shell        = require('gulp-shell');

// set your devUrl for browserSync
let config = {
  devUrl: 'http://joshuahdiamond.dev'
};

// gettin sassy with our css
gulp.task('sass', () => {
  return gulp.src('./assets/scss/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/css'));
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
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('minify-css', ['postcss'], () => {
  return gulp.src([
      './dist/css/*.css',
    ])
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('./dist/css'));
});


// Put your webpack on and lets fly
gulp.task('webpack', () => {
  return gulp.src('./assets/app/index.js')
    .pipe(webpack( wpConfig ))
    .pipe(gulp.dest('dist/js/'));
});

/*const exec = require('child_process').execFile;
//maybe exec
gulp.task('cr', function(cb) {
  let ourShell = process.env.shell;

  // support for windows cygwin
  if(process.env.TERM == 'cygwin'){
    ourShell = '/cygwin64' + ourShell + '.exe ';
  }

  return exec(['drush cr'], {
      shell: path.resolve(ourShell),
      cwd: path.resolve(process.cwd())
    }, function(err, stdout, stderr){
      console.log(stdout, stderr);
      cb(err);
    });
});*/


gulp.task('watch', () => {

  browserSync.init({
    proxy: config.devUrl
  });

  let reload = () => {
    browserSync.reload();
  };

  // if any of our sass assets change, lets reload
  gulp.watch('./assets/scss/*', ['sass', reload]);
  gulp.watch('./assets/scss/**/*', ['sass', reload]);

  // if any of our js assets, lets run webpack
  gulp.watch('./assets/app/*', ['webpack',reload]);
  gulp.watch('./assests/app/**/*', ['webpack',reload]);

  // if any of our templates change, lets also reload
  gulp.watch('./templates/*', reload);
  gulp.watch('./templates/**/*', reload);

});

gulp.task('default', ['minify-css']);
