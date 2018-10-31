const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
var StringReplacePlugin = require("string-replace-webpack-plugin");

var optimization = {
  runtimeChunk: 'single',
  splitChunks: {
    cacheGroups: {
      node_vendors: {
        test: /[\\/]node_modules[\\/]/,
        chunks: 'async',
        priority: 1
      }
    }
  }
};

module.exports = {
  mode: 'development',
  entry: {
    index: './app/index.js'
  },
  optimization: optimization,
  devtool: 'inline-source-map',
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader']
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ['file-loader']
      },
      {
        test: /index\.html$/,
        use: [
          {
            loader: 'string-replace-loader',
            options: {
              multiple: [ {
                  search: '@@API_URL',
                  replace: 'http://localhost:9003/m1/',
                  strict: true,
                  flags: 'g'
                }
              ]
            }
          }
        ]
      },
      {
        test: /app\.js$/,
        use: [
          {
            loader: 'string-replace-loader',
            options: {
              multiple: [ {
                  search: '@@API_URL',
                  replace: 'http://localhost:9003/m1/',
                  strict: true
                }, {
                  search: '@@API_WS_URL',
                  replace: 'http://localhost:9003/m1/ws',
                  strict: true
                }, {
                  search: '@@BUILD_NR',
                  replace: '1',
                  strict: true
                }, {
                  search: '@@ENV',
                  replace: 'testest',
                  strict: true
                }
              ]
            }
          }
        ]
      },
      {
        test: /\.(html)$/,
        use: [
          { loader: 'html-loader' },
        ]
      }
    ]
  },
  node: {
    fs: 'empty'
  },
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      //filename: 'index.html',
      template: __dirname + '/app/index.html',
      inject: 'header'
    }),
    new StringReplacePlugin(),
    new CleanWebpackPlugin(['dist']),
    new ZipPlugin({
      filename: 'dist.zip'
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      "window.jQuery": "jquery"
    })
  ]
};
