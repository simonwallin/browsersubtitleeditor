var webpack = require('webpack');
var path = require('path');

var config = {
  entry: __dirname + '/client/entry.jsx',
  output: {
    path: __dirname + '/public/javascripts',
    filename: 'bundle.js'
  },
  module : {
    loaders : [
      {
        test : /\.jsx?/,
        loader : 'babel-loader',
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass']
      }
    ]
  },
};

module.exports = config;
