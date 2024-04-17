const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const CURRENT_WORKING_DIR = process.cwd()
const PRODUCTION = process.env.NODE_ENV;


module.exports = {
    name: "browser",
    mode: (PRODUCTION ? 'production' : 'development'),
    devtool: (PRODUCTION ? undefined : 'eval-source-map'),
    target: "node",
    entry: [
        path.join(CURRENT_WORKING_DIR, 'bin/api-ouitube')
    ],
    output: {
        path: path.join(CURRENT_WORKING_DIR, '/build'),
        filename: 'e-commerce-server.js',
        publicPath: path.join(CURRENT_WORKING_DIR, '/public'),
        libraryTarget: "commonjs2"
    },
    externals: [nodeExternals()],
    module: {
        rules: [
            
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader'
                ]
            },
            {
                test: /\.(ttf|eot|svg|gif|jpg|png)(\?[\s\S]+)?$/,
                use: [
                    {
                      loader: 'file-loader',
                      options: {
                        name : '[name].[ext]',
                        outputPath : 'assets/images'
                      }
                    }
                  ]
            }
        ]
    }

}
