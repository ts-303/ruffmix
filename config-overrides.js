const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = function override(config, env) {
    config.plugins.push(
        new HtmlWebPackPlugin({
            template: path.resolve( __dirname, 'public/index.html' ),
            filename: 'index.html'
        }),
    );

    config.module.rules.push(
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
            
        }
    );

    config.entry = './src/index.js';

    config.output.path = path.resolve(__dirname, 'build');
    config.output.publicPath = '/';
    config.output.filename = 'bundle.js';

    config.module.noParse = /typescript/;

    return config
}