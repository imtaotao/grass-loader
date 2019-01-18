const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const path = require('path')

module.exports = {
	entry: __dirname + "/index.js",
  output: {
    path: resolve('dist'),
    filename: "bundle.js",
  },
  resolve: {
    extensions: ['.js', '.json', '.css', '.grs'],
  },
  mode: process.env.NODE_ENV,
  devtool: 'source-map',
  devServer: {
      contentBase: __dirname,
      historyApiFallback: true,
      inline: true,
      hot: true,
      stats: "errors-only",
  },
  module: {
    rules: [{
      test: /(\.js|\.grs)$/,
      use: [
        {
          loader: __dirname +'/src',
          options: {
            needGrass: true,
          },
        }
      ],
      exclude: /node_modules/,
  	}, {
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: "style-loader",
        use: [{
            loader: "css-loader",
            options: {
              modules: true,
            },
        }],
      }),
		}],
	},
	plugins: [
    new webpack.BannerPlugin('grass demo'),
    new HtmlWebpackPlugin({
      template: __dirname + "/index.html"
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new ExtractTextPlugin("style.css"),
    new webpack.HotModuleReplacementPlugin(),
	]
}

function resolve (dir) {
  return path.resolve(__dirname, dir)
}