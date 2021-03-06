const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const production = process.env.NODE_ENV === 'production'

module.exports = {
    mode: process.env.NODE_ENV || 'development',
    entry: {
      app: './src/index.jsx'
    },
    output: {
      filename: '[name].[hash].js',
      path: path.resolve(__dirname, 'public')
    },
    target: 'web',
    devServer: {
      host: "localhost",
      contentBase: './public',
      hot: true,
      port: 8080,
      historyApiFallback: true
    },
    resolve: {
      extensions: ['.js', '.jsx']
    },
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000, //seems to stablise HMR file change detection
      ignored: /node_modules/
    },
    module : {
        rules : [
          {
            test : /\.jsx?/,
            exclude: /node_modules/,
            loader : 'babel-loader',
          },
          {
            test: /\.(otf|png|jpg|gif|woff2)$/,
            loader: 'file-loader'
          },
          {
            test: /\.(css|less)$/,
            use: [ 'style-loader', 'css-loader?minimize','less-loader' ]
            
          }
        ]
      },
    devtool: process.env.NODE_ENV ? '' : 'inline-source-map',
    plugins: [
      new UglifyJsPlugin(),
      new CleanWebpackPlugin('public'),
      new webpack.NamedModulesPlugin(),
      new HtmlWebpackPlugin({
        title: 'Words Game',
        filename: 'index.html',
        favicon: 'src/images/atm.png'
      }),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
      //new BundleAnalyzerPlugin()
    ]
  }
