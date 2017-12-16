const {resolve} = require('path');
const url = require('url');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (options = {}) => ({
    entry: {
        Opanorama: './src/Opanorama.js'
    },
    output: {
        path: resolve(__dirname, 'dist'),
        filename:  `[name].js${options.dev ?'':'?[chunkhash]'}`
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: ['env']
                  }
                }
                
            }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            names: ['Opanorama']
        })
    ],
    devServer: {
        host: '127.0.0.1',
        port: 8080,
        quiet: false,
        stats: {colors: true},
        historyApiFallback: {
            index: '/'
        }
    },
    devtool: '#source-map'
})