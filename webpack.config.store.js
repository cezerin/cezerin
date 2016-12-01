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
    },

    plugins: []
};

if (env === 'production') {
  config.plugins.push(new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('production')
    }
  }))
}

module.exports = config;
