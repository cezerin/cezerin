const webpack = require( 'webpack' );

var env = process.env.NODE_ENV;

var config = {
    entry: './store/client/index.js',

    output: {
        path: './public/assets',
        filename: 'js/bundle.js'
    },

    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }
      ]
    }
};

module.exports = config;
