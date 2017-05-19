var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: './assets/app/index.js',
  /*plugins: [
     new webpack.optimize.OccurrenceOrderPlugin(),
     new webpack.NoEmitOnErrorsPlugin(),
     new webpack.HotModuleReplacementPlugin()
  ],*/
  module: {
    loaders: [
      {
        exclude: [/(node_modules|bower_components)/],
        loader: 'babel-loader',
        options: {
          presets: ['env', 'es2015']
        }
      }
    ]
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, './dist/js'),
    publicPath: path.resolve(__dirname, './dist/js')
  }
};
