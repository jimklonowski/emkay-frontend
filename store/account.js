import { assign, set, toggle } from '@/utility/vuex'
import { flatten } from '@/utility/helpers'

const getDefaultState = () => ({
  centers: [],
  center_levels: {
    level_01: 'level_01',
    level_02: 'level_02',
    level_03: 'level_03',
    level_04: 'level_04',
    level_05: 'level_05',
    level_06: 'level_06',
    level_07: 'level_07',
    level_08: 'level_08',
    level_09: 'level_09',
    level_10: 'level_10'
  },
  custom_labels: {
    client_use_label_1: '',
    client_use_label_2: '',
    client_use_label_3: '',
    client_use_label_4: '',
    client_use_label_5: '',
    driver_use_label_1: '',
    driver_use_label_2: '',
    driver_use_label_3: '',
    driver_use_label_4: ''
  },
  login_messages: [],
  initialized: false,
  sidebar: false
})

export const state = () => getDefaultState()

export const actions = {
  /**
   * Login Action - Calls $auth.login, then sets cookie and calls account/init
   * @param {*} credentials { account, username, password }
   */
  async login ({ commit, dispatch }, credentials) {
    await this.$auth.loginWith('local', { data: credentials })
      .then(async () => {
        if (this.$auth.loggedIn && this.$auth.user.token) {
          this.$cookies.set('SESSIONID', this.$auth.user.token)
          await dispatch('account/init', null, { root: true })
        } else {
          throw new Error(`[${this.$i18n.t('login')}]: ${this.$i18n.t('invalid_login')}`)
        }
      })
  },
  /**
   * Initialize the account store.
   * Set custom labels, centers, etc.
   */
  async init ({ commit, dispatch }) {
    console.log('[vuex][account]: called init')
    await Promise.all([
      dispatch('fetchCustomLabels'),
      dispatch('fetchCenterHierarchy'),
      dispatch('fetchCenterLevels')
      // dispatch('fetchLoginMessages')
    ]).finally(() => {
      commit('setInitialized', true)
    })
  },
  /**
   * Fetch Custom Client and Driver Labels
   */
  async fetchCustomLabels ({ commit }) {
    try {
      const { data: { data, success, message } } = await this.$axios.get('/account/custom-labels')
      if (!success) { throw new Error(message) }
      commit('setCustomLabels', data)
    } catch (error) {
      console.error(`[vuex error][fetchCustomLabels]: ${error}`)
    }
  },
  /**
   * Update Custom Labels Action
   */
  async updateCustomLabels ({ commit, dispatch }, payload) {
    try {
      const { data: { success, message } } = await this.$axios.post('/account/update-labels', payload)
      if (!success) { throw new Error(message) }
      await dispatch('fetchCustomLabels')
    } catch (error) {
      console.error(`[vuex error]: ${error.message}`)
      throw new Error(error.message)
    }
  },
  /**
   * Fetch Center Hierarchy
   */
  async fetchCenterHierarchy ({ commit }) {
    try {
      const { data: { data, success, message } } = await this.$axios.get('/account/centers')
      if (!success) { throw new Error(message) }
      commit('setCenters', data)
    } catch (error) {
      console.error(`[vuex error][fetchCenterHierarchy]: ${error}`)
    }
  },
  async fetchCenterLevels ({ commit }) {
    try {
      const { data: { data, success, message } } = await this.$axios.get('/account/center-levels')
      if (!success) { throw new Error(message) }
      commit('setCenterLevels', data)
    } catch (error) {
      console.error(`[vuex error][fetchCenterLevels]: ${error}`)
    }
  },
  /**
   * Fetch Login Messages
   */
  async fetchLoginMessages ({ commit }) {
    try {
      // const { data: { data, success, message } } = await this.$axios.get('/account/login-messages')
      // if (!success) { throw new Error(message) }
      await console.log('TODO: mocked login message data')
      const data = [
        { title: 'COVID-19 Update', text: 'EMKAY Coronavirus (COVID-19) Update (March 20)', link: '/coronavirus' },
        { title: 'COVID-20 Update', text: 'EMKAY Coronavirus (COVID-20) Update (March 25)', link: '/coronavirus2' }
      ]
      commit('setLoginMessages', data)
    } catch (error) {
      console.error(`[vuex error][fetchLoginMessages]: ${error}`)
    }
  },
  /**
   * Logout Action
   */
  async logout ({ commit }) {
    commit('account/reset', null, { root: true })
    await this.$auth.logout()
  },
  /**
   * Reset State to Default
   */
  reset: ({ commit }) => commit('reset'),
  /**
   * Set Sidebar State (boolean)
   */
  setSidebar: ({ commit }, payload) => commit('setSidebar', payload),
  /**
   * Toggle Sidebar State
   */
  toggleSidebar: ({ commit }) => commit('toggleSidebar')
}

export const mutations = {
  reset: assign(getDefaultState()),
  setCenters: set('centers'),
  setCenterLevels: set('center_levels'),
  setCustomLabels (state, data) {
    state.custom_labels = { ...state.custom_labels, ...data }
  },
  setInitialized: set('initialized'),
  setLoginMessages: set('login_messages'),
  setSidebar: set('sidebar'),
  toggleSidebar: toggle('sidebar')
}

export const getters = {
  getCenters: state => state.centers,
  getCenterLevels: state => state.center_levels,
  getClientLabels: state => Object.entries(state.custom_labels).map(([key, value]) => ({ key, value })).slice(0, 5),
  getCustomLabels: state => state.custom_labels,
  getDriverLabels: state => Object.entries(state.custom_labels).map(([key, value]) => ({ key, value })).slice(5),
  getInitialized: state => state.initialized,
  getFlattenedCenters: state => flatten(state.centers),
  getLoginMessages: state => state.login_messages,
  getSidebar: state => state.sidebar,
  isInitialized: state => state.initialized
}
