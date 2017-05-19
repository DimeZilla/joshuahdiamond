var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: './assets/app/index.js',
  /*plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],*/
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, './dist/js')
  }
};
