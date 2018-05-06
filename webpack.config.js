const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
    mode:'development',
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
            use: [ 'style-loader', 'css-loader','less-loader' ]
          }
        ]
      },
    devtool: 'inline-source-map',
    plugins: [
      new CleanWebpackPlugin('public'),
      new webpack.NamedModulesPlugin(),
      new HtmlWebpackPlugin({
        title: 'My App',
        filename: 'index.html'
      }),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
    ]
  };
