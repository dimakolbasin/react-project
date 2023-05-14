const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TeaserWebpackPlugin = require('terser-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const isDev = process.env.NODE_ENV === 'development'

const fileName = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`

const plugins = () => {
  const config = [
    new HtmlWebpackPlugin({
      template: './index.html',
      minify: {
        collapseWhitespace: !isDev
      }
    }),
    new MiniCssExtractPlugin({
      filename: fileName('css')
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/favicon.ico'),
          to: path.resolve(__dirname, 'dist')
        }
      ]
    }),
    new CleanWebpackPlugin()
  ]

  // if (!isDev) config.push(new BundleAnalyzerPlugin())

  return config
}

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all'
    }
  }
  if (!isDev) config.minimizer = [
    new OptimizeCssAssetsWebpackPlugin(),
    new TeaserWebpackPlugin()
  ]
  return config
}

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: [
    '@babel/polyfill',
    './index.js'
  ],
    output: {
        filename: fileName('js'),
        path: path.resolve(__dirname, 'dist'),
        clean: true
    },
  resolve: {
    extensions: ['.js', '.jsx', '.css', '.scss'],
    alias: {
      src: path.resolve(__dirname, 'src'),
      '@models': path.resolve(__dirname, 'src/models')
    },
  },
  optimization: optimization(),
  plugins: plugins(),
    module: {
        rules: [
          {
            test: /\.(tsx|jsx|js|ts)$/i,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  '@babel/preset-env',
                  '@babel/preset-typescript',
                  '@babel/preset-react'
                ],
                plugins: [
                  '@babel/plugin-proposal-class-properties'
                ]
              }
            }
          },
          {
            test: /\.js$/i,
            exclude: /node_modules/,
            use: [isDev ? 'eslint-loader' : 'eslint-loader']
          },
          {
              test: /\.(sc|sa)ss$/i,
              use: [
                  MiniCssExtractPlugin.loader,
                  'css-loader',
                  'sass-loader',
              ],
          },
          {
            test: /\.css$/i,
            use: [
              MiniCssExtractPlugin.loader,
              'css-loader'
            ],
          },
          {
              test: /\.(ttf|woff|woff2|eot)$/i,
              use: [
                'file-loader'
              ],
          },
        ],
    },
    devtool: isDev ? 'source-map' : 'eval',
    devServer: {
      port: 3000,
      hot: isDev,
      devMiddleware: {
        writeToDisk: true,
      }
    }
}
