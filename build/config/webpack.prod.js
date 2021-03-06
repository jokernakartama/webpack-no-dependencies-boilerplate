var path = require('path')
var webpack = require('webpack')
var merge = require('webpack-merge')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var MiniCssExtractPlugin = require('mini-css-extract-plugin')
var TerserPlugin = require('terser-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var webpackConfig = require('./webpack.common')
var loaders = require('../loaders')
var config = require('./build.config')
// paths
var rootDir = path.join(__dirname, '../../')
var buildPath = path.join(rootDir, 'dist')
var sourcePath = path.join(rootDir, 'src')

var rules = [
  { test: /\.css$/, use: loaders(['css', 'postcss', 'import-glob'], true) },
  { test: /\.scss$/, use: loaders(['css', 'postcss', 'sass', 'import-glob'], true) },
  { test: /\.sass$/, use: loaders(['css', 'postcss', 'sass', 'import-glob'], true) },
  { test: /\.styl$/, use: loaders(['css', 'postcss', 'stylus', 'import-glob'], true) }
]

var plugins = [
 new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: '"production"',
    },
  }),
  new HtmlWebpackPlugin({
    template: path.join(sourcePath, 'index.html'),
    path: buildPath,
    filename: 'index.html',
    inject: true,
    minify: {
      removeComments: true,
      collapseWhitespace: false
    }
  }),
  // copy static files
  new CopyWebpackPlugin([
    {
      from: path.resolve(rootDir, 'static'),
      to: config.assetsSubDirectory,
      ignore: ['.*']
    }
  ]),
  new MiniCssExtractPlugin({
    // Options similar to the same options in webpackOptions.output
    filename: path.posix.join(config.assetsSubDirectory, 'css/[name].[hash].css'),
    chunkFilename: path.posix.join(config.assetsSubDirectory, 'css/[name].[chunkhash].css')
  })
]

module.exports =  merge(webpackConfig, {
  devtool: false,
  mode: 'production',
  output: {
    path: config.assetsRoot,
    publicPath: '/',
    filename: path.posix.join(config.assetsSubDirectory, 'js/[name].[hash].js'),
    chunkFilename: path.posix.join(config.assetsSubDirectory, 'js/[name].[chunkhash].js')
  },
  module: {
    rules
  },
  plugins,
  optimization: {
    splitChunks: {
      cacheGroups: {
        polyfills: {
          test: /[\\/]node_modules[\\/](core-js|regenerator-runtime)[\\/]/,
          name: 'polyfills',
          chunks: 'all'
        },
        vendors: {
          test: /[\\/]node_modules[\\/](?!(core-js|regenerator-runtime)[\\/])/,
          name: 'vendors',
          chunks: 'all'
        },
      }
    },
    noEmitOnErrors: true,
    minimizer: [
      new TerserPlugin({
        sourceMap: true,
        terserOptions: {
          output: {
            comments: false,
          },
        },
        extractComments: false
      })
    ]
  }
})
