const webpack = require("webpack");
const path = require("path");
const nodeExternals = require("webpack-node-externals");
const StartServerPlugin = require("start-server-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin')

const production = process.env.NODE_ENV === 'production'

module.exports = {
    mode: process.env.NODE_ENV || 'development',
    entry: production? './src/server/index' : [ "webpack/hot/poll?1000", "./src/server/index" ],
    watch: production? false : true,
    target: "node",
    externals: [ nodeExternals({ whitelist: [ "webpack/hot/poll?1000" ] }) ],
    module: {
        rules: [
            { test: /\.js?$/, use: "babel-loader", exclude: /node_modules/ },
        ],
    },
    plugins: production? [
        new webpack.NamedModulesPlugin(),
    ]
    :[
        new CleanWebpackPlugin('devServer'),
        new StartServerPlugin("server.js"),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            "process.env": { BUILD_TARGET: JSON.stringify("server") },
        }),
    ],
    output: { path: path.join(__dirname, production? "public" : "devServer"), filename: "server.js" },
};