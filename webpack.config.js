'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './build/index.js',
  output: {
    path: path.resolve(__dirname, 'build/dist'),
    filename: 'bundle.js',
    publicPath: '/assets/',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './client/src/index.html'
    }),
  ],
};