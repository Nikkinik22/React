const path = require('path');
const {HotModuleReplacementPlugin} = require('webpack');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');


const NODE_ENV = process.env.NODE_ENV;
const IS_DEV = NODE_ENV === 'development';
const IS_PROD = NODE_ENV === 'production';

const GLOBAL_CSS_REGEXP = /\.global\.css$/;
function setupDevtools() {
    if (IS_DEV) return 'eval';
    if (IS_PROD) return false;
}

module.exports = {
    mode: NODE_ENV ? NODE_ENV : 'development',
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        alias: {
         'react-dom': IS_DEV ? '@hot-loader/react-dom' : 'react-dom',
        }
    },
    entry: [
        path.resolve(__dirname, '../src/client/index.jsx'),
        'webpack-hot-middleware/client?path=http://localhost:3001/static/__webpack_hmr',
    ],
    output: {
        path: path.resolve(__dirname, '../dist/client'),
        filename: 'client.js',
        publicPath: '/static/',
    },
    module: {
        rules: [
            {
                test: /\.[tj]sx?$/,
                use: ['ts-loader'],
            },
            {
                test: /\.css$/,
                use:[
                    {
                        loader: 'style-loader',
                        options: {
                            esModule: false,
                        },
                    },
                    {
                        loader:'css-loader',
                        options: {
                            esModule: false,
                            modules: {
                                mode: 'local',
                                localIdentName:'[name]__[local]--[hash:base64:5]',
                            },
                        },
                    },
                ],
                exclude: GLOBAL_CSS_REGEXP,
            },
        ]
    },
    devtool: setupDevtools(),
    plugins: IS_DEV
        ? [
        new HotModuleReplacementPlugin(),
        new CleanWebpackPlugin(),
    ]
        : [],
}