const routes = require('./contents/routes')

module.exports = {
  env: {
    origin: process.env.ORIGIN || 'http://127.0.0.1:3000',
  },

  head: {
    title: 'starter',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
    ]
  },

  loading: { color: '#3B8070' },

  css: [
    'normalize.css/normalize.css',
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
          exclude: /(node_modules)/
        })
      }
    }
  },

  router: {
    middleware: 'router',
  },

  generate: {
    routes: routes,
  },
}
