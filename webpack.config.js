const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHTMLWebpackPlugin = require('script-ext-html-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

module.exports = env => {
  const envObj = Object.keys(env)
    .reduce((acc, val) => {
      acc[`process.env.${val}`] = JSON.stringify(env[val]);
      return acc;
    }, {});

  return {
    mode: env.ENV == 'prod' ? 'production' : 'development',
    devtool: env.ENV == 'prod' ? false : 'cheap-eval-source-map',
    entry: {
      main: './src/front/index.js',
    },
    output: {
      filename: '[name].[contenthash].js',
      chunkFilename: '[name].[contenthash].js',
      path: path.resolve(__dirname, 'dist'),
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          include: [
            path.resolve(__dirname, 'src/front/'),
          ],
          exclude: /(node_modules|\.test\.js$)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    'useBuiltIns': 'usage',
                    'corejs': '3.6.4',
                  },
                ],
                [
                  '@babel/preset-react',
                  {
                    'useBuiltIns': true,
                    'development': env.ENV == "dev",
                  },
                ],
              ],
              plugins: [
                '@babel/plugin-proposal-class-properties'
              ],
              cacheDirectory: true,
            },
          },
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: {
                modules: true,
                sourceMap: env.ENV == "dev",
              },
            },
          ],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                outputPath: 'images/',
                publicPath: 'images/',
              },
            },
          ],
        },
      ],
    },
    optimization: {
      minimizer: [
        new TerserWebpackPlugin({
          parallel: true,
          sourceMap: env.ENV == "dev",
        }),
      ],
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
      },
    },
    plugins: [
      new webpack.DefinePlugin(envObj),
      new CleanWebpackPlugin(),
      new HTMLWebpackPlugin({
        template: './src/front/index.html',
        title: 'Clean Tablet',
        favicon: './src/assets/icons/favicon-16x16.png'
      }),
      new ScriptExtHTMLWebpackPlugin({
        defaultAttribute: 'async',
      }),
      new webpack.HashedModuleIdsPlugin(),
    ],
    devServer: {
      port: 4200,
      contentBase: path.join(__dirname, 'dist'),
      index: 'index.html',
    },
  }
};
