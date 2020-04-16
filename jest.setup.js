import Vue from 'vue'
import Vuetify from 'vuetify'
import { config } from '@vue/test-utils'

Vue.use(Vuetify)

// Mocks
config.mocks.$t = key => key
// Stubs
// config.stubs.nuxt = '<div />'
// config.stubs['nuxt-link'] = '<a><slot /></a>'
// config.stubs['client-only'] = '<span><slot /></span>'
