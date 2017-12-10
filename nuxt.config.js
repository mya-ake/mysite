const path = require('path')

const { META } = require('./configs/meta')

const routes = require('./contents/routes')

module.exports = {
  env: {
    origin: process.env.ORIGIN || 'http://127.0.0.1:13000',
  },

  head: {
    title: META.TITLE,
    htmlAttrs: {
      lang: 'ja',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
      { hid: 'description', name: 'description', content: META.DESCRIPTION },
      { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
      { 'http-equiv': 'Content-Script-Type', content: 'text/javascript' },
      { name: 'format-detection', content: 'telephone=no' },
      { name: 'author', content: 'mya-ake' },
      { hid: 'og:title', property: 'og:title', content: META.TITLE },
      { hid: 'og:description', property: 'og:description', content: META.DESCRIPTION },
      { property: 'og:site_name', content: META.TITLE },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: META.SNS_IMAGES.LARGE },
      { property: 'og:locale', content: 'ja_JP' },
      { property: 'og:url', content: META.ORIGIN },
      { hid: 'twitter:title', name: 'twitter:title', content: META.TITLE },
      { name: 'twitter:site', content: '@mya_ake' },
      { hid: 'twitter:description', name: 'twitter:description', content: META.DESCRIPTION },
      { name: 'twitter:image', content: META.SNS_IMAGES.SMALL },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:url', content: META.ORIGIN },
    ],
    link: [
    ],
  },

  loading: { color: '#3B8070' },

  css: [
    'normalize.css/normalize.css',
    '~assets/scss/styles.scss',
    'highlight.js/styles/monokai.css',
  ],

  build: {
    /*
    ** Run ESLINT on save
    */
    extend (config, ctx) {
      if (ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
        })
      }

      config.module.rules
        .find((rule) => rule.loader === 'vue-loader')
        .options.loaders.scss
        .push({
          loader: 'sass-resources-loader',
          options: {
            resources: [
              path.join(__dirname, 'assets', 'scss', '_variables.scss'),
              path.join(__dirname, 'assets', 'scss', '_mixins.scss'),
            ],
          },
        })
    },
  },

  // router: {
  //   middleware: 'router',
  // },

  generate: {
    routes: routes,
  },
}
