const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './client/src/index.html',
  filename: 'index.html',
  inject: 'body'
})

module.exports = {
  entry: './client/src/index.js',
  output: {
    path: path.resolve('dist'),
    publicPath: "/",
    filename: 'index_bundle.js'
  },
  module: {
    loaders: [
      { test: /\.js$/, include: path.join(__dirname, './client/src'), loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.(scss|css)$/, loaders: ['style-loader', 'css-loader', 'sass-loader'] },
      { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' }
    ]
  },
  plugins: [HtmlWebpackPluginConfig],
  devServer: {
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000/',
        secure: false
      }
    }
  }
};
