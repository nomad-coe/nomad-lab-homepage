/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const fs = require('fs');
const glob = require('glob');
const yaml = require('js-yaml');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const loremIpsum = require("lorem-ipsum").loremIpsum;

const files = glob.sync('./src/!(_)*.html')
const pages = files.filter(file => !file.endsWith('.part.html')).map(file => file.substring(6, file.length - 5))
const partials = files.filter(file => file.endsWith('.part.html')).map(file => file.substring(6, file.length - 10))

const partialsDict = partials.reduce((result, partial) => {
  result[partial] = fs.readFileSync(`./src/${partial}.part.html`, { encoding: 'utf-8' })
  return result;
}, {})

const faqData = yaml.load(fs.readFileSync('src/faqs.yaml', 'utf8'));

const mainMenus = [
  {
    title: 'Solutions',
    id: 'services-menu',
    items: {
      'NOMAD': 'nomad.html',
      'NOMAD Oasis': 'nomad-oasis.html',
      'Encyclopedia': '#',
      'AI Toolkit': '#'
    }
  },
  {
    title: 'Learn',
    id: 'documentation-menu',
    items: {
      'Tutorials': 'tutorials.html',
      'Documentation': 'https://nomad-lab.eu/prod/v1/docs/',
      'Get help': 'help.html'
    }
  },
  {
    title: 'Get involved',
    id: 'support-menu',
    items: {
      'Try the latest features': 'installations.html',
      'Source code': 'source-code.html',
      'Work with us': '#'
    }
  },
  {
    title: 'About',
    id: 'about-menu',
    items: {
      'Home': 'index.html',
      'Related Projects': 'projects.html',
      'News': '#',
      'Events': '#',
      'Press materials': '#',
      'Terms of use': '#'
    }
  }
]

const footerMenus = {
  'Solutions': {
    'NOMAD': 'nomad.html',
    'NOMAD Oasis': 'nomad-oasis.html',
    'Encyclopedia': '#',
    'AI Toolkit': '#'
  },
  'Learn': {
    'Tutorials': 'tutorials.html',
    'Documentation': 'https://nomad-lab.eu/prod/v1/docs/',
    'FAQ': 'help.html#faq',
    'Forum': 'https://matsci.org/c/nomad/32',
    'Open an issue': 'https://github.com/nomad-coe/nomad/issues'
  },
  'Get involved': {
    'NOMAD at GitHub': 'https://github.com/nomad-coe/nomad',
    'NOMAD at MPCDF GitLab': 'https://gitlab.mpcdf.mpg.de/nomad-lab/nomad-FAIR',
    'Work with us': '#'
  },
  'NOMAD installations': {
    'Official': 'https://nomad-lab.eu/prod/v1/gui',
    'Beta/staging': 'https://nomad-lab.eu/prod/v1/staging/gui',
    'Test': 'https://nomad-lab.eu/prod/v1/test/gui',
    'Legacy': 'https://nomad-lab.eu/rae/gui'
  },
  'About': {
    'Home': 'index.html',
    'Related Projects': 'projects.html',
    'News': '#',
    'Events': '#',
    'Press materials': '#',
    'Terms of use': '#'
  }
}

module.exports = {
  entry: {
    index: './src/index.ts'
  },
  mode: 'development',
  devtool: 'source-map',
  optimization: {
    usedExports: true
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            // disable type checker - we will use it in fork plugin
            transpileOnly: true
          }
        }
      },
      {
        test: /\.(scss|css)$/,
        use: [
          process.env.NODE_ENV !== 'production'
            ? 'style-loader'
            : MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].css'
    }),
    new CleanWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin(),
    new CopyPlugin({
      patterns: [{ from: 'src/assets', to: 'assets' }]
    }),
    new ESLintPlugin({
      extensions: ['.tsx', '.ts', '.js'],
      exclude: 'node_modules',
      context: 'src'
    })
  ].concat(
    pages.map(
      (page) =>
        new HtmlWebpackPlugin({
          inject: true,
          title: 'test',
          page: page,
          template: `./src/_template.html`,
          variables: {
            ...partialsDict,
            faqData,
            lorem: loremIpsum
          },
          menus: {
            main: mainMenus,
            footer: footerMenus
          },
          filename: `${page}.html`,
          chunks: ['index']
        })
    )
  )
};
