const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const env = process.env.NODE_ENV;

module.exports = () => {
  var config = {
    entry: {
      app: ['babel-polyfill', './src/store/client/index.js'],
      theme: ['theme']
    },

    output: {
      publicPath: '/',
      path: './public/',
      filename: 'assets/js/app-[chunkhash].js'
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
        filename: 'assets/js/theme-[chunkhash].js'
      }),
      new HtmlWebpackPlugin({
        template: 'public/assets/template.html',
        inject: 'body',
        filename: 'assets/index.html'
      })
    ]
  };

  if (env === 'production') {
    config.plugins.push(new webpack.BannerPlugin({banner: `Created: ${new Date().toUTCString()}`, raw: false, entryOnly: false}));

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

  return config;
}
