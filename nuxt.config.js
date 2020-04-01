import path from 'path'
import fs from 'fs'
import { en, fr, en as ca } from 'vuetify/lib/locale'
import colors from 'vuetify/es5/util/colors'
import locales from './plugins/i18n/locales'
require('dotenv').config()
export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: 'EMKAY :: %s',
    title: 'simple. better. different.' || '',
    meta: [
      { charset: 'utf-8' },
      { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge,chrome=1' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Since 1946, EMKAY has been the premier vehicle fleet management company in North America. We are your solution for your company car needs. Contact EMKAY 630-250-7400.' },
      { hid: 'keywords', name: 'keywords', content: 'Emkay, leasing, fleet, fleet leasing, managed vehicles, corporate leasing, emkay, emkaynet, lease' },

      // Open Graph
      { hid: 'og:url', property: 'og:url', content: 'https://emkay.com' },
      { hid: 'og:title', property: 'og:title', content: 'EMKAY' },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:site_name', property: 'og:site_name', content: 'EMKAY' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  server: {
    port: 3000,
    host: '127.0.0.1',
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'localhost.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'localhost.crt'))
    }
  },
  vue: {
    config: {
      devtools: true, // turn this off for production
      performance: true,
      productionTip: true,
      silent: false
    }
  },
  router: {
    base: process.env.NODE_ENV === 'production' ? '/nuxt/' : '/'
  },
  /*
  ** Customize the progress-bar color
  */
  loading: {
    color: colors.deepPurple.base,
    continuous: true,
    failedColor: colors.deepOrange.accent4,
    height: '4px'
  },
  /*
  ** Global CSS
  */
  css: [
    '~/assets/main.scss'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~/plugins/auth/axios-interceptors' },
    { src: '~/plugins/i18n/nuxt-i18n' },
    { src: '~/plugins/vee-validate' },
    { src: '~/plugins/custom-filters' },
    { src: '~/plugins/vue-json-excel', mode: 'client' },
    { src: '~/plugins/vue-chart.js', mode: 'client' },
    { src: '~/plugins/vue-snotify', mode: 'client' }
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/moment-module
    '@nuxtjs/moment',
    // Doc: https://github.com/nuxt-community/vuetify-module
    '@nuxtjs/vuetify',
    // Doc: https://github.com/nuxt-community/analytics-module
    '@nuxtjs/google-analytics'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://auth.nuxtjs.org/
    '@nuxtjs/auth',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    // Doc: https://nuxt-community.github.io/nuxt-i18n/
    'nuxt-i18n',
    // Doc: https://github.com/microcipcip/cookie-universal/tree/master/packages/cookie-universal-nuxt#readme
    'cookie-universal-nuxt',
    // Doc: https://github.com/Developmint/nuxt-webfontloader
    'nuxt-webfontloader'
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    baseURL: process.env.BASE_URL,
    browserBaseURL: process.env.BASE_URL,
    credentials: true
  },
  /*
  ** Auth module configuration
  ** See https://auth.nuxtjs.org/api/options.html#redirect
  */
  auth: {
    plugins: [
      { src: '~/plugins/auth/locale-redirects', mode: 'client' }
    ],
    strategies: {
      local: {
        endpoints: {
          login: { url: '/login', method: 'post' },
          logout: { url: '/logout', method: 'post' },
          user: { url: '/user', method: 'get', propertyName: false }
        },
        tokenRequired: false,
        tokenType: false
      }
    },
    redirect: {
      login: '/login',
      logout: '/login',
      home: '/',
      callback: false
    }
  },
  /*
  ** dotenv configuration
  */
  env: {
    BASE_URL: process.env.BASE_URL,
    FLEET_DASHBOARD_URL: process.env.FLEET_DASHBOARD_URL,
    GA_ID: process.env.GA_ID
  },
  /*
  ** i18n module configuration
  ** See https://nuxt-community.github.io/nuxt-i18n/
  */
  i18n: {
    locales,
    defaultLocale: 'en',
    langDir: 'lang/',
    lazy: true,
    strategy: 'prefix_except_default',
    vueI18n: {
      fallbackLocale: 'en',
      silentFallbackWarn: true
    }
  },
  /*
   ** google analytics module configuration
   ** See: https://github.com/nuxt-community/analytics-module
   */
  googleAnalytics: {
    id: process.env.GA_ID || '',
    dev: true,
    debug: {
      enabled: false, // disable debug console.logs
      sendHitTask: true
    }
  },
  /*
  ** moment module configuration
  ** See https://github.com/nuxt-community/moment-module
  */
  moment: {
    defaultLocale: 'en',
    locales: ['fr-ca', 'en-ca'],
    // This doesn't work.  Setting $nuxt.$moment.suppressDeprecationWarnings = true does work.
    suppressDeprecationWarnings: true
  },
  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  vuetify: {
    lang: {
      locales: { en, fr, ca },
      current: 'en'
    },
    customVariables: ['~/assets/variables.scss'],
    treeShake: true,
    theme: {
      dark: true,
      themes: {
        light: {
          primary: colors.deepPurple,
          accent: colors.amber.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten2
        },
        dark: {
          primary: colors.deepPurple.lighten2,
          secondary: colors.grey.darken3,
          accent: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  /*
  ** webfontloader configuration
  ** See: https://github.com/Developmint/nuxt-webfontloader
  ** Also: https://github.com/nuxt-community/vuetify-module
  ** Note: https://github.com/nuxt-community/vuetify-module#defaultassets
  */
  webfontloader: {
    google: {
      families: ['Roboto', 'Roboto+Condensed', 'Lato']
    }
  },
  /*
  ** Build configuration
  */
  build: {
    transpile: ['vee-validate/dist/rules', 'vuetify/lib', 'lodash.isequal'],
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}
