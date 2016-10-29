const path = require('path');
const webpack = require( 'webpack' );
const ExtractTextPlugin = require("extract-text-webpack-plugin");

var env = process.env.NODE_ENV;

var config = {
    entry: './admin/client/index.js',

    output: {
        path: './public/admin/assets',
        filename: 'js/bundle.js',
    },

    resolve: {
      alias:{
        src: path.resolve('./admin/client' ),
        layout: path.resolve('./admin/client/layout' ),
        modules: path.resolve('./admin/client/modules' ),
        lib: path.resolve('./admin/client/lib' )
      },
      extensions: ['', '.js', '.jsx', '.json']
    },

    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        },
        {
  				test: /\.json$/,
          exclude: /node_modules/,
  				loader: 'json-loader'
  			},
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract('css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'),
        },
      ]
    },

    plugins: [
       new ExtractTextPlugin("css/bundle.css"),
       new webpack.optimize.DedupePlugin()
   ]
};


if (env === 'production') {}

module.exports = config;
