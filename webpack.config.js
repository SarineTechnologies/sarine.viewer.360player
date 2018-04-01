const path = require('path');

module.exports = {
    entry: {
        'sarine.viewer.360player.polyfill.min': 'babel-polyfill'
    },
    output: {
        publicPath: 'dist/',
        path: path.join(__dirname, 'web/dist'),
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            }
        ],
    },
    devtool: 'eval source-map',
    devServer: {
        host: '127.0.0.1',
        port: 4200,
        // stats: 'minimal',
        inline: true,
        overlay: true,
        contentBase: path.join(__dirname, '/web')
    }
};
