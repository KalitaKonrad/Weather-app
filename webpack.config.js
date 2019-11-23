const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require('path');
//const packageJSON = require("./package.json");

module.exports = {
  entry: "./src/app.js",
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'app.bundle.js'
  },
  
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: {minimize: true}
          }
        ]
      },
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      hash: true,
      template: path.join(__dirname, 'src', 'index.html')
    }),
  ]
}