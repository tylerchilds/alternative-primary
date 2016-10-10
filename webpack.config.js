var path = require('path');
var webpack = require('webpack');

var config = module.exports = {
  // the base path which will be used to resolve entry points
  context: __dirname,
  // the main entry point for our application's frontend JS
  entry: {
    'app': './src/js/app.js'
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/public/js'
  }
};

config.resolve = {
  // tell webpack which extensions to auto search when it resolves modules. With this,
  // you'll be able to do `require('./utils')` instead of `require('./utils.js')`
  extensions: ['', '.js'],
  // by default, webpack will search in `web_modules` and `node_modules`. Because we're using
  // Bower, we want it to look in there too
  modulesDirectories: [ 'node_modules'],
  root: [path.resolve('./src/js')]
};

config.module = {
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
}
