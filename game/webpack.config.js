const path = require('path');
const webpack = require('webpack');

module.exports = {
  context: __dirname,
  entry: './src/fireworks',
  output: {
    path: path.resolve('./build/'),
    filename: '[name].js',
    publicPath: '/static/bundles/',
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
      },
      {
        test: /\.s?css$/,
        loaders: ['style', 'css', 'sass'],
      }
    ],
  },

  plugins: [
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false,
    //   },
    //   output: {
    //     comments: false,
    //   },
    // }),
  ],
};
