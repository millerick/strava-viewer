'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './build/index.js',
  output: {
    path: path.resolve(__dirname, 'build/dist'),
    filename: 'bundle.js',
    publicPath: '/assets/',
  },
  module: {
    rules: [{
      test: /\.scss$/,
      use: [
        require.resolve("style-loader"),
        require.resolve("css-loader"),
        require.resolve("sass-loader"),
      ],
    }],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './client/src/index.html'
    }),
  ],
};
