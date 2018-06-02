const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = env => {
  var production = env && env.production;
  var enableSourcemap = true; // Gives componentDidMountProblems
  
  var config = {
    entry: {
      index: './src/index.tsx',
    },
    stats: {modules: false},
    target: 'web',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
      ]
    },
    resolve: {
      extensions: [ '.tsx', '.ts', '.js' ]
    },
    output: {
      filename: '[name].[hash].js',
    },
    plugins: [
      // Copy index.html, parse template tags
      new HtmlWebpackPlugin({
        inject: false,
        template: './src/index.html',
        filename: 'index.html'
      })
    ],
  };

  if (production) {
    // prod
    Object.assign(config, {
      mode: 'production',
    });
    
    config.plugins.push(
      // Set NODE_ENV to production for optimized react builds
      new webpack.DefinePlugin({
        'process.env': { 'NODE_ENV': JSON.stringify('production') },
      }),
      // Remove build dir
      new CleanWebpackPlugin(['dist/*']),
      // Extract css to file
      new MiniCssExtractPlugin({
        filename: "[name].[contenthash].css",
      }),
      // Minify js
      new UglifyJsPlugin(),
      // Copy images to build dir
      new CopyWebpackPlugin([{from: 'resources'}]),
    );
  } else {
    // dev
    config.plugins.push(
      // Hot module replacement
      new webpack.HotModuleReplacementPlugin(),
    );
    
    Object.assign(config, {
      mode: 'development',
      devtool: 'cheap-module-source-map',
      devServer: {
        contentBase: path.join(__dirname, '/resources/'),
        // publicPath: '/compiled/',
        overlay: {
          errors: true,
          warnings: false,
          open: true,
        },
        stats: {modules: false},
        hot: true,
        host: '0.0.0.0',
        // https: true,
      }
    });
  }

  return config;
}
