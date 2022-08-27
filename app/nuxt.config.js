require('dotenv').config();
const environment = process.env.NODE_ENV || 'development';
const envSet = require(`./env/${environment}.env.js`)
// const { API_SERVER } = process.env;

module.exports = {
  mode: 'spa',
  /*
  ** Headers of the page
  */
  head: {
    title: 'T-Spider',
    meta: [
      { charset: 'utf-8' },
      { version: 'stg_0.1.5' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    script: [
      { src: '/js/jquery.min.js',body: true},
      { src: '/js/jquery-ui.min.js',body: true},
      { src: '/js/adminlte.min.js',body: true},
      { src: 'https://use.fontawesome.com/releases/v5.8.1/js/all.js',body: true},
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ]
  },

  router: {
    middleware: [
      'permissions',
      'available'
    ]
  },

  server: {
    port: 3000, // デフォルト: 3000
    host: '0.0.0.0' // デフォルト: localhost
  },
  serverMiddleware: ['~/api/index.js'],

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    '@/static/css/app.css'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/main.js',
    '~/plugins/mixin.js'
  ],
  
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    'bootstrap-vue/nuxt',
  ],
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    transpile: /@fullcalendar.*/,
    filenames: {
      app: ({ isDev }) => isDev ? '[name].[hash].js' : '[chunkhash].js',
      chunk: ({ isDev }) => isDev ? '[name].[hash].js' : '[chunkhash].js'
    },
    extend (config, ctx) {
      config.node = {
        fs: "empty" 
      };
    }
  },
  env:envSet
}
