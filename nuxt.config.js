const colors = require('vuetify/es5/util/colors').default

module.exports = {
  mode: 'spa',
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      // {
      //   rel: 'stylesheet',
      //   href: 'https://cdn.jsdelivr.net/npm/vuetify/dist/vuetify.min.css'
      // },
      {
        rel: 'stylesheet',
        href:
          'https://cdn.jsdelivr.net/npm/material-design-icons-iconfont@5.0.1/dist/material-design-icons.min.css'
      },
      {
        rel: 'stylesheet',
        href:
          'https://cdn.jsdelivr.net/npm/roboto-fontface@0.10.0/css/roboto/roboto-fontface.min.css'
      },
      {
        rel: 'stylesheet',
        href:
          'https://cdn.jsdelivr.net/npm/@mdi/font/css/materialdesignicons.min.css'
      }
    ]
  },
  loading: { color: '#fff' },
  router: {
    middleware: ['auth', 'meta']
  },
  css: [],
  plugins: ['~/plugins/feathers-vuex', '~/plugins/filters'],
  modules: ['@nuxtjs/vuetify', '@nuxtjs/pwa', '@nuxtjs/eslint-module'],
  vuetify: {
    theme: {
      primary: colors.brown.base,
      accent: '#f9a825',
      secondary: '#f9a825',
      info: colors.teal.lighten1,
      warning: colors.amber.base,
      error: colors.deepOrange.accent4,
      success: colors.green.accent3
    },
    css: true,
    materialIcons: false
  }
}
