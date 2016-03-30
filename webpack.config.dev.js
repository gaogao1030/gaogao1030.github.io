const webpack = require('webpack');
const path = require('path');
const config = require("config");
const host = config.get("host");
const port = config.get("port");

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    `webpack-hot-middleware/client?path=${host}:${port}/__webpack_hmr`,'./app'
  ],
  output: {
   path: path.join(__dirname,'/dist'),
   filename: "app.bundle.js",
   publicPath: `${host}:${port}`
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      'process.env.isDev': true
    })
  ],
  module: {
    perLoaders: [{
      test: /\.js$/,
      include: __dirname,
      loader: 'jshint-loader'
    },{
      test: /\.scss?$/,
      loaders: ['style','css','sass'],
      include: __dirname
    }]
  },
  jshint: { "esnext": true}
};
