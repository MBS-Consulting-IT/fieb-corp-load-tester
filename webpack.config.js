const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const settings = require('./env/settings')

const proxyConfig = [
  settings.rest,
  settings.soap
].reduce((config, wsConfig) => {
  config[wsConfig.proxyPath] = `${settings.urlBase}${wsConfig.url}`
  return config
}, {})

module.exports = {
  mode: 'development',
  entry: './src/app.js',
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'main.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html'
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    index: './public/index.html',
    compress: true,
    port: 9000,
    proxy: proxyConfig
  }
}
