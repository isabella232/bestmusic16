'use strict';

var webpack = require('webpack');
var glob_entries = require('webpack-glob-entries');

module.exports = {
    entry: {
        app: './www/js/app.js',
        analytics: './www/js/analytics.js'
    },
    output: {
        path: './www/js/rendered',
        filename: '[name].min.js'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }, {
            test: /\.json$/,
            loader: 'json-loader'
        }]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                join_vars: false,
                dead_code: false,
                unused: false
            }
        })
    ]
}