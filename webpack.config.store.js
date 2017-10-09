const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const env = process.env.NODE_ENV;

module.exports = () => {
  var config = {
    entry: {
      app: ['babel-polyfill', './src/store/client/index.js'],
      theme: ['theme']
    },

    output: {
      publicPath: '/',
      path: path.resolve(__dirname, 'theme'),
      filename: 'assets/js/bundle-app-[chunkhash].js'
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
        }, {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
              use: [
                  {
                      loader: "css-loader",
                      options: {
                          modules: false,
                          importLoaders: true
                      }
                  }
              ]
          })
        },
        {
          test: /\.scss$/,
          use: ExtractTextPlugin.extract({
              use: [{
                  loader: "css-loader"
              }, {
                  loader: "sass-loader"
              }]
          })
        }
      ]
    },

    plugins: [
      new ExtractTextPlugin("assets/css/bundle-theme-[chunkhash].css"),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'theme',
        minChunks: Infinity,
        filename: 'assets/js/bundle-theme-[chunkhash].js'
      }),
      new HtmlWebpackPlugin({
        template: 'theme/index.html',
        inject: 'body',
        filename: 'assets/index.html'
      }),
      new ScriptExtHtmlWebpackPlugin({
        defaultAttribute: 'defer'
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
