const path = require('path')

const routes = require('./contents/routes')

module.exports = {
  env: {
    origin: process.env.ORIGIN || 'http://127.0.0.1:13000',
  },

  head: {
    title: 'starter',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' },
    ],
    link: [
    ],
  },

  loading: { color: '#3B8070' },

  css: [
    'normalize.css/normalize.css',
    '~assets/scss/styles.scss',
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

  router: {
    middleware: 'router',
  },

  generate: {
    routes: routes,
  },
}
