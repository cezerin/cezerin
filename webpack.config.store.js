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
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }, {
        test: /\.json$/,
        exclude: /node_modules/,
        use: ['json-loader']
      }
    ]
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'theme',
      minChunks: Infinity,
      filename: 'theme-[chunkhash].js'
    }),

    new ManifestPlugin({
      fileName: 'build-manifest.json'
    })
  ]
};

if (env === 'production') {
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
