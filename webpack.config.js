const path = require('path');
const webpack = require('webpack');
module.exports = {
  entry: './src/index',
  output: {
    libraryTarget: 'umd',
    library: 'skype-js',
    path: __dirname,
    filename: 'dist/browser_bundle.js',
  },
  target: 'node-webkit',
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      include: path.join(__dirname, 'src'),
    },
    {
      test: /\.json$/,
      loaders: ['json'],
    }],
  },
  plugins: [
    new webpack.DefinePlugin({ 'global.GENTLY': false }), // for formidable module
  ],
};
