const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const webpackMerge = require('webpack-merge');

const modeConfig = env => require(`./build-utils/webpack.${env}`)(env);

module.exports = (
  { mode, presets } = {
    mode: 'production',
    presets: []
  }
) => {
  return webpackMerge(
    {
      entry: './src/index.ts',
      mode,
      devtool: 'source-map',
      module: {
        rules: [
          {
            test: /\.ts$/,
            use: ['babel-loader'],
            enforce: 'pre'
          },
          {
            test: /\.js$/,
            exclude: /node_modules\/(?!(lit-html|@polymer)\/).*/,
            use: ['babel-loader', 'source-map-loader']
          },
          {
            test: /\.(png|jpg|bmp)$/,
            use: [
              {
                loader: 'file-loader',
                options: {
                  emitFile: true
                }
              }
            ]
          }
        ]
      },
      resolve: {
        extensions: ['.ts', '.js']
      },
      output: {
        filename: '[name].js',
        sourceMapFilename: '[file].map',
        path: path.resolve(__dirname, 'dist')
      },
      optimization: {
        splitChunks: {
          chunks: 'all'
        }
      },
      plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebPackPlugin({
          title: 'PGOS',
          template: './src/index.html'
        })
      ],
      devServer: {
        contentBase: './dist',
        port: 9000,
        historyApiFallback: {
          index: '/'
        }
      }
    },
    modeConfig(mode)
  );
};
