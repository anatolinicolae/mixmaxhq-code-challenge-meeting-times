const HtmlWebPackPlugin = require('html-webpack-plugin');
const path = require('path');
const htmlPlugin = new HtmlWebPackPlugin({
  template: './client/index.html',
  filename: './index.html',
});
module.exports = {
  entry: './client/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
  },
  plugins: [htmlPlugin],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
