const HtmlWebPackPlugin = require("html-webpack-plugin");
//const path = require('path');
//const packageJSON = require("./package.json");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "./dist/app.bundle.js"
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
      filename: "./dist/index.html"
    }),
  ]
}