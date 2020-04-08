const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
    mode: isProduction ? 'production' : 'development',
    entry: () => './src/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: isProduction ? 'app/[name].[hash].js' : 'app/[name].js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.vue$/,
                use: [ 'vue-loader' ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/templates/index.html'
        }),
        new VueLoaderPlugin()
    ],
    resolve: {
        alias: {
            '@app': path.resolve(__dirname, 'src/app'),
            '@css': path.resolve(__dirname, 'src/css'),
            '@components': path.resolve(__dirname, 'src/components'),
        },
        extensions: [ '*', '.js', '.vue', '.json' ]
    },
    optimization: {
        minimize: true
    },
    devtool: 'none',
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        watchContentBase: true,
        open: true,
        writeToDisk: true
    }
}