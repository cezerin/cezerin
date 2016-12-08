const path = require('path');
const webpack = require( 'webpack' );
const ExtractTextPlugin = require("extract-text-webpack-plugin");

var env = process.env.NODE_ENV;

var config = {
    entry: './src/admin/client/index.js',

    output: {
        path: './public/admin/assets',
        filename: 'js/bundle.js',
    },

    resolve: {
      alias:{
        src: path.resolve('./src/admin/client' ),
        layout: path.resolve('./src/admin/client/layout' ),
        modules: path.resolve('./src/admin/client/modules' ),
        lib: path.resolve('./src/admin/client/lib' )
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


if (env === 'production') {
  config.plugins.push(new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('production')
    }
  }))
}

module.exports = config;
