import { assign, set, toggle } from '@/utility/vuex'
import { flatten } from '@/utility/helpers'

const getDefaultState = () => ({
  bill_sorts: [],
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
  critical_alerts: [],
  fleet_messages: [],
  login_messages: [],
  initialized: false,
  left_sidebar: false,
  right_sidebar: false
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
      dispatch('fetchCenterLevels'),
      dispatch('fetchLoginMessages'),
      dispatch('fetchFleetMessages'),
      dispatch('fetchCriticalAlerts'),
      dispatch('fetchBillSorts')
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
   * Fetch Critical Alerts
   */
  async fetchCriticalAlerts ({ commit }) {
    try {
      const data = [
        { key: 'fuel_card_misuse', value: 3 },
        { key: 'delayed_orders', value: 1 },
        { key: 'neglected_maintenance', value: 3 },
        { key: 'plate_expirations', value: 0 },
        { key: 'overdue_rentals', value: 0 }
      ]
      commit('setCriticalAlerts', data)
    } catch (error) {
      await console.error(`[vuex error][fetchCriticalAlerts]: ${error}`)
    }
  },
  /**
   * Fetch Login Messages
   */
  async fetchLoginMessages ({ commit }) {
    try {
      // const { data: { data, success, message } } = await this.$axios.get('/account/login-messages')
      // if (!success) { throw new Error(message) }
      // await console.log('TODO: mocked login message data')
      const data = [
        { title: 'COVID-19 Update', text: 'EMKAY Coronavirus (COVID-19) Update (March 20)', date: '2020-03-20', link: 'coronavirus.html', suppressionCookie: 'covid19_message_seen' },
        { title: 'Check Fraud', text: 'Updates on check frauds', date: '2020-01-01', link: 'checkfraud.html', suppressionCookie: 'check_fraud_message_seen' }
      ]
      commit('setLoginMessages', data)
    } catch (error) {
      await console.error(`[vuex error][fetchLoginMessages]: ${error}`)
    }
  },
  /**
   * Fetch Fleet Messages
   */
  async fetchFleetMessages ({ commit }) {
    try {
      // const { data: { data, success, message } } = await this.$axios.get('/account/fleet-messages')
      // if (!success) { throw new Error(message) }
      // await console.log('TODO: mocked fleet message data')
      const data = [
        {
          from: 'me',
          to: 'Cathy Pecora',
          title: 'Personal Mileage',
          text: 'Please log in and report your personal mileage for the month of March. Thx! - Andy',
          date: '2020-04-13'
        },
        {
          from: 'me',
          to: 'Dave Lodding',
          title: 'Personal Mileage',
          text: 'Hi Dave, please log in and report your personal mileage from March.',
          date: '2020-04-13'
        }
      ]
      commit('setFleetMessages', data)
    } catch (error) {
      await console.error(`[vuex error][fetchFleetMessages]: ${error}`)
    }
  },
  /**
   * Fetch Bill Sorts
   */
  async fetchBillSorts ({ commit }) {
    try {
      const { data: { data, success, message } } = await this.$axios.get('/account/bill-sorts')
      if (!success) { throw new Error(message) }
      commit('setBillSorts', data)
    } catch (error) {
      console.error(`[vuex error][fetchBillSorts]: ${error.message}`)
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
  setLeftSidebar: ({ commit }, payload) => commit('setLeftSidebar', payload),
  setRightSidebar: ({ commit }, payload) => commit('setRightSidebar', payload),
  /**
   * Toggle Sidebar State
   */
  toggleLeftSidebar: ({ commit }) => commit('toggleLeftSidebar'),
  toggleRightSidebar: ({ commit }) => commit('toggleRightSidebar')
}

export const mutations = {
  reset: assign(getDefaultState()),
  setBillSorts: set('bill_sorts'),
  setCenters: set('centers'),
  setCenterLevels: set('center_levels'),
  setCustomLabels (state, data) {
    state.custom_labels = { ...state.custom_labels, ...data }
  },
  setInitialized: set('initialized'),
  setCriticalAlerts: set('critical_alerts'),
  setFleetMessages: set('fleet_messages'),
  setLoginMessages: set('login_messages'),
  setLeftSidebar: set('left_sidebar'),
  setRightSidebar: set('right_sidebar'),
  toggleLeftSidebar: toggle('left_sidebar'),
  toggleRightSidebar: toggle('right_sidebar')
}

export const getters = {
  getBillSorts: state => state.bill_sorts,
  getCenters: state => state.centers,
  getCenterLevels: state => state.center_levels,
  getClientLabels: state => Object.entries(state.custom_labels).map(([key, value]) => ({ key, value })).slice(0, 5),
  getCustomLabels: state => state.custom_labels,
  getDriverLabels: state => Object.entries(state.custom_labels).map(([key, value]) => ({ key, value })).slice(5),
  getInitialized: state => state.initialized,
  getFlattenedCenters: state => flatten(state.centers),
  getCriticalAlerts: state => state.critical_alerts,
  getFleetMessages: state => state.fleet_messages,
  getLoginMessages: state => state.login_messages,
  getLeftSidebar: state => state.left_sidebar,
  getRightSidebar: state => state.right_sidebar,
  isInitialized: state => state.initialized
}
