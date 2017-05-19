const gulp         = require('gulp');

// webpack a go go
var webpack      = require('gulp-webpack');
var wpConfig     = require('./webpack.config');
var wpBundler    = webpack(wpConfig);

console.log(wpConfig.output);

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
    .pipe(wpBundler); 
});

gulp.task('watch', () => {

  browserSync.init({
    proxy: config.devUrl,
    //middleware for webpack
      middleware: [
      webpackDevMid(wpBundler, {
        publicPath: wpConfig.output.path,
        stats: { colors: true }
      }),
      webpackHotMid(wpBundler)
    ]
  });
  
  let reload = () => {
    browserSync.reload();
  };

  gulp.watch('./assets/scss/*', ['sass', reload]);
  gulp.watch('./assets/scss/**/*', ['sass', reload]);
  
//  gulp.watch('./assets/app/*', ['webpack',reload]);
//  gulp.watch('./assests/app/**/*', ['webpack',reload]); 
 
});

gulp.task('default', ['minify-css']);
