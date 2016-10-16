var path = require('path');
var webpack = require('webpack');

var config = module.exports = {
  context: __dirname,
  entry: {
    'app': './src/js/app.js'
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/public/js'
  },
  resolve: {
    extensions: ['', '.js'],
    modulesDirectories: [ 'node_modules'],
    root: [path.resolve('./src/js')]
  },
  module: {
    loaders: [
      {
        test: /(\.js|\.jsx)$/,
        exclude: /(node_modules)/,
        loader: 'babel', // 'babel-loader' is also a legal name to reference
        query: {
          presets: ['es2015', 'stage-2']
        }
      }
    ]
  },
  plugins: []
};
