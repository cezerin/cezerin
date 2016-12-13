const webpack = require('webpack');
const ManifestPlugin = require('webpack-manifest-plugin');

var env = process.env.NODE_ENV;

var config = {
  entry: {
    app: './src/store/client/index.js',
    theme: ['theme']
  },

  output: {
    path: './public/assets/js/',
    filename: 'app-[chunkhash].js'
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }, {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin("theme", "theme-[chunkhash].js"),
    new ManifestPlugin({fileName: 'build-manifest.json'})
  ]
};

if (env === 'production') {
  config.plugins.push(new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('production')
    }
  }))

  config.plugins.push(new webpack.optimize.DedupePlugin())

  config.plugins.push(new webpack.BannerPlugin(`Created: ${new Date().toUTCString()}`)),

  config.stats = {
    colors: false,
    hash: false,
    version: false,
    timings: false,
    assets: false,
    chunks: false,
    modules: false,
    reasons: false,
    children: false,
    source: false,
    errors: false,
    errorDetails: false,
    warnings: false,
    publicPath: false
  }
}

module.exports = config;
