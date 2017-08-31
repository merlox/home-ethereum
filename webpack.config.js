const path = require('path')
const htmlPlugin = require('html-webpack-plugin')

module.exports = {
   entry: path.join(__dirname, 'src/js', 'app.js'),
   output: {
      path: path.join(__dirname, 'dist'),
      filename: 'build.js'
   },
   module: {
      loaders: [{
         test: /\.jsx?$/,
         loader: 'babel-loader',
         exclude: /node_modules/,
         query: {
            presets: ['es2015', 'react', 'stage-2']
         }
      }, {
         test: /\.json$/,
         exclude: /node_modules/,
         loader: 'json-loader'
      }, {
         test: /\.styl$/,
         exclude: /node_modules/,
         include: /src/,
         use: ['style-loader', 'css-loader', 'stylus-loader']
      }]
   },
   plugins: [
      new htmlPlugin({
         title: "Dapp for descentralized home renting",
         template: './src/html/index.ejs',
         hash: true
      })
   ]
}
