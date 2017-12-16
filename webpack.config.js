const {resolve} = require('path');
const url = require('url');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (options = {}) => ({
    entry: {
        panorama: './src/lib/panorama.js',
        main: './src/main.js'
    },
    output: {
        path: resolve(__dirname, 'dist'),
        filename: options.dev ? '[name].js' : '[name].js?[chunkhash]',
        chunkFilename: '[id].js?[chunkhash]',
        publicPath: options.dev ? '/dev/' : '/dist/'
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
            names: ['panorama']
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html'
        })
    ],
    resolve: {},
    devServer: {
        host: '127.0.0.1',
        port: 8080,
        quiet: false,
        stats: {colors: true},
        historyApiFallback: {
            index: url.parse(options.dev ? '/dev/' : '').pathname
        }
    },
    devtool: '#source-map'
})
