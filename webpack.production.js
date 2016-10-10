var path = require('path');
var webpack = require('webpack');
var config = require('./webpack.config.js');

config.plugins.push(
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('production')
    }
  }),
  new webpack.optimize.UglifyJsPlugin({
    compress:{
      warnings: true
    }
  })
);

module.exports = config;
