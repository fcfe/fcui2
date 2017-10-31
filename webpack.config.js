
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    devtool: 'source-map',
    entry: './doc/index.js',
    output: {
        filename: 'bundle.js',
        path: __dirname + '/build'
    },
    resolve: {
        extensions: ['.jsx', '.js'],
        alias: {
            'fcui2': path.join(__dirname, 'src'),
            'fcui2$': path.join(__dirname, 'src/index.js')
        }
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)?$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract(['css-loader', 'less-loader'])
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname, 'index.ejs'),
        }),
        new ExtractTextPlugin('style.css')
    ]
};
