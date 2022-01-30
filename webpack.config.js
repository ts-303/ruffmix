const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        filename: 'bundle.js',
    },
    devServer: {
        historyApiFallback: true
     },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                include: path.resolve(__dirname, 'src'),
                exclude: /node_modules/,
                use: [{
                    loader: 'babel-loader',
                    exclude: /node_modules/,
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }],
                test: /\.html$/,
                use: [{
                    loader: 'html-loader',
                }],
                test: /\.(png|jpg|svg|gif)$/,
                use: [{
                    loader: 'file-loader'
                }],
                test: /\.css$/,
                use: [{
                    loader: 'style-loader'
                }],
                test: /\.css$/,
                use: [{
                    loader: 'css-loader',
                }],
            }
        ]
    },
    plugins: [
            new HtmlWebPackPlugin({
                template: path.resolve( __dirname, 'public/index.html' ),
                filename: 'index.html'
            }),
    ],

}