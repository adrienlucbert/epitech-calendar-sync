const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const isProduction = process.env.NODE_ENV === 'production'
const CopyPlugin = require('copy-webpack-plugin')

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
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [ 'file-loader' ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/templates/index.html'
        }),
        new VueLoaderPlugin(),
        new CopyPlugin([
            { from: 'src/manifest.json', to: 'manifest.json' }
        ])
    ],
    resolve: {
        alias: {
            '@app': path.resolve(__dirname, 'src/app'),
            '@css': path.resolve(__dirname, 'src/css'),
            '@assets': path.resolve(__dirname, 'src/assets'),
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