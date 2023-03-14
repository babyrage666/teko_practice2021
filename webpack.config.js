const { resolve } = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'development';
const development = environment === 'development';
const DIST_DIR = resolve(__dirname, './dist');
const SRC_DIR = resolve(__dirname, './src');
const STATIC_DIR = resolve(__dirname, './static');

const mockUser = {
  login: 'admin',
  password: 'admin',
  fullName: 'Testov Test',
  token: 'testToken',
};

const config = {
  cache: true,
  mode: environment,
  context: SRC_DIR,
  devtool: development ? 'cheap-module-eval-source-map' : 'source-map',

  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      SRC_DIR,
      'node_modules',
    ],
  },

  entry: {
    main: './index.jsx',
  },

  output: {
    path: DIST_DIR,
    publicPath: '/',
    filename: 'js/[name].js',
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        },
      }
    }
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: SRC_DIR,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
        ],
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          { loader: development ? 'style-loader' : MiniCssExtractPlugin.loader },
          {
            loader: 'css-loader',
            options: {
              sourceMap: false,
              // modules: { localIdentName: '[name]-[local]-[hash:base64:4]' },
              importLoaders: 3,
            }
          },
          { loader: 'postcss-loader', options: { sourceMap: 'inline' } },
          { loader: 'resolve-url-loader' },
          { loader: 'sass-loader', options: { sourceMap: true } },
        ]
      },
      {
        test: /\.svg$/,
        issuer: /\.jsx?$/,
        exclude: [/node_modules/],
        use: [
          { loader: '@svgr/webpack', options: { svgoConfig: { plugins: [ { prefixIds: false }, { removeUselessDefs: false }, { cleanupIDs: false }, ] } } },
        ],
      },
      {
        test: /\.svg$/i,
        issuer: /\.s?css$/,
        exclude: [/node_modules/],
        use: [
          { loader: 'file-loader', options: { name: '[path][name].[ext]' } },
          { loader: 'svgo-loader', options: { plugins: [{ removeTitle: true }] } },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|ico|zip|pdf)$/i,
        loader: 'file-loader',
        options: {
          name() {
            if (development) {
              return '[path][name].[ext]'
            }

            return '[path][name].[hash:6].[ext]'
          }
        }
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin(['dist'], {
      root: __dirname,
      verbose: true,
    }),
    new CopyWebpackPlugin(
      [
        { from: STATIC_DIR, to: DIST_DIR },
      ]
    ),
    new HtmlWebpackPlugin({
      template: 'index.ejs',
      templateParameters: {
        environment,
      },
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: 'report.html',
      defaultSizes: 'parsed',
      openAnalyzer: false,
      generateStatsFile: false,
      logLevel: 'info',
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(environment),
    }),
    // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ],

  devServer: {
    contentBase: DIST_DIR,
    hot: true,
    port: 3030,
    host: '0.0.0.0',
    historyApiFallback: true,
    before: (app) => {
      app.use(bodyParser());
      app.get('/users/me', (req, res) => {
        setTimeout(() => {
          if (req.get('Authorization') === `Bearer ${mockUser.token}`) {
            res.json({
              id: mockUser.login,
              fullName: mockUser.fullName,
            });
          } else {
            res.status(401).send({ code: 401, description: 'Unauthorized' });
          }
        }, 600);
      });
      app.post('/auth/login', (req, res) => {
        setTimeout(() => {
          if (req.body.login === mockUser.login && req.body.password === mockUser.password) {
            res.json({
              token: mockUser.token,
              expires: Date.now() + 1000 * 60 * 60,
            });
          } else {
            res.status(401).send({ code: 401, description: 'Incorrect username or password' });
          }
        }, 600);
      });
    },
  },
};

if (development) {
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin()
  );

  config.module.rules.push(
    {
      test: /\.jsx?$/,
      use: 'react-hot-loader/webpack',
      include: /node_modules/
    }
  );
}

if (!development) {
  config.plugins.push(
    new MiniCssExtractPlugin({
      filename: 'css/[name].[hash].css',
      chunkFilename: '[id].[hash].css',
    })
  );
}

module.exports = config;
