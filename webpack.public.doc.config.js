
const webpack = require('webpack');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
module.exports = {
    entry: [
        './doc/src/main.webpack.js'
    ],
    output: {
        path: path.resolve(__dirname, 'build.doc'),
        filename: 'src/build.js'
    },
    module: {
        loaders: [
            {
                test: /\.(jsx|es6).js$/,
                loader: 'babel-loader',
                exclude: /(node_modules|dep)/
            },
            {
                test: /\.less$/,
                loader: 'style-loader!css-loader!less-loader'
            },
            {
                test: /\.(gif|jpg|png|woff|svg|eot|ttf|html)\??.*$/,
                loader: 'url-loader?limit=8096&name=[path][name].[ext]'
            }
        ]
    },
    plugins: [
        new UglifyJSPlugin()
    ],
    resolve: {
        extensions: ['.js'],
        alias: {
            // 'react': path.resolve(__dirname, 'dep/react-with-addons.min.js'),
            // 'react-dom': path.resolve(__dirname, 'dep/react-dom.min.js'),
            'preact': path.resolve(__dirname, 'dep/preact.dev.js'),
            'react': path.resolve(__dirname, 'dep/preact-compat.js'),
            'prop-types': path.resolve(__dirname, 'dep/prop-types.js'),
            'react-dom': path.resolve(__dirname, 'dep/preact-compat.js'),
            'fcui2': path.join(__dirname, 'src'),
            'js-formatter': path.join(__dirname, 'dep/formatterJS'),
            'markdown': path.join(__dirname, 'dep/markdown.min')
        }
    }
};