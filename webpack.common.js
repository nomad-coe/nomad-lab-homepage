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
const { url } = require('inspector');
const loremIpsum = require("lorem-ipsum").loremIpsum;

const files = glob.sync('./src/!(_)*.html')
const pages = files.filter(file => !file.endsWith('.part.html')).map(file => file.substring(6, file.length - 5))
const partials = files.filter(file => file.endsWith('.part.html')).map(file => file.substring(6, file.length - 10))

const partialsDict = partials.reduce((result, partial) => {
  result[partial] = fs.readFileSync(`./src/${partial}.part.html`, { encoding: 'utf-8' })
  return result;
}, {})

const faqData = yaml.load(fs.readFileSync('src/faqs.yaml', 'utf8'));
const featureData = yaml.load(fs.readFileSync('src/features.yaml', 'utf8'));

const urls = {
  forum: 'https://matsci.org/c/nomad/32',
  gitlab: 'https://gitlab.mpcdf.mpg.de/nomad-lab/nomad-FAIR',
  github: 'https://github.com/nomad-coe/nomad',
  github_organisation: 'https://github.com/nomad-coe',
  documentation: 'https://nomad-lab.eu/prod/v1/staging/docs',
  production_installation: 'https://nomad-lab.eu/prod/v1',
  beta_installation: 'https://nomad-lab.eu/prod/v1/staging',
  test_installation: 'https://nomad-lab.eu/prod/v1/test',
  legacy_installation: 'https://nomad-lab.eu/prod/rae',
  fairmat: 'https://www.fairmat-nfdi.eu/fairmat',
  fairmat_events: 'https://www.fairmat-nfdi.eu/fairmat/events-fairmat?ctx=ALL',
  fairmat_news: 'https://www.fairmat-nfdi.eu/fairmat/news-fairmat?ctx=ALL',
  fairmat_tutorials: 'https://www.fairmat-nfdi.eu/fairmat/outreach-fairmat/tutorials-fairmat',
  support_email: 'mailto:support@nomad-lab.eu',
  fairdi: 'https://www.fair-di.eu/fair-di/',
  nomad_coe: 'https://nomad-coe.eu',
  aitoolkit: 'https://nomad-lab.eu/aitoolkit',
  encyclopedia: 'https://nomad-lab.eu/prod/rae/encyclopedia/#/search'
}


const mainMenus = [
  {
    title: 'Solutions',
    id: 'services-menu',
    items: {
      'NOMAD': 'nomad.html',
      'NOMAD Oasis': 'nomad-oasis.html',
      'Encyclopedia': 'encyclopedia.html',
      'AI Toolkit': urls.aitoolkit
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
      'Latest features': 'features.html',
      'Contribute': 'source-code.html',
      'Open positions': 'https://www.fairmat-nfdi.eu/jobs/jobs-fairmat?ctx=NOMAD-LAB'
    }
  },
  {
    title: 'About',
    id: 'about-menu',
    items: {
      'NOMAD Lab': 'nomad-lab.html',
      'Related Projects': 'projects.html',
      'News': urls.fairmat_news,
      'How to cite NOMAD': 'how-to-cite.html',
      'Terms of use': 'terms.html'
    }
  }
]

const footerMenus = {
  'About': {
    'Home': 'index.html',
    'Team': '#',
    'FAIRmat': urls.fairmat,
    'How to cite NOMAD': 'how-to-cite.html',
    'Terms of use': 'terms.html',
    'Impressum': 'https://www.fairmat-nfdi.eu/fairmat/about-fairmat/contact-fairmat'
  },
  'Meet us': {
    'Contact': 'https://www.fairmat-nfdi.eu/fairmat/about-fairmat/contact-fairmat',
    'News': urls.fairmat_news,
    'Events': urls.fairmat_events,
    'Twitter': 'https://twitter.com/FAIRmat_NFDI',
    'YouTube': 'https://www.youtube.com/@TheNOMADLaboratory'
  },
  'Support': {
    'FAQ': 'help.html#faq',
    'Forum': urls.forum,
    'Documentation': urls.documentation
  },
  'Code': {
    'GitLab@MPCDF': urls.gitlab,
    'GitHub':  urls.github,
    'Create issue': `${urls.github}/issues`
  },
  'Installations': {
    'Official': urls.production_installation,
    'Beta/staging': urls.beta_installation,
    'Test': urls.test_installation,
    'Legacy': urls.legacy_installation
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
            features: featureData,
            lorem: loremIpsum,
            urls
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
