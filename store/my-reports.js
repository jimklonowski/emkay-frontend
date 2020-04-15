import { assign, set } from '@/utility/vuex'

const getDefaultState = () => ({
  column_groups: [],
  report_data: [],
  report_loading: false,
  report_types: [
    {
      type: 'accident',
      icon: 'mdi-car-parking-lights'
    },
    {
      type: 'billing',
      icon: 'mdi-receipt'
    },
    {
      type: 'expense',
      icon: 'mdi-cash-usd'
    },
    {
      type: 'fuel',
      icon: 'mdi-gas-station'
    },
    {
      type: 'maintenance',
      icon: 'mdi-tools'
    },
    {
      type: 'vehicle',
      icon: 'mdi-car'
    },
    {
      type: 'violation',
      icon: 'mdi-shield-car'
    }
  ],
  profile: {},
  profiles: [],
  suggested_emails: []
})

export const state = () => getDefaultState()

export const actions = {
  async init ({ commit, dispatch }) {
    console.log('Fetching saved reports and emails')
    await Promise.all([
      dispatch('fetchProfiles'),
      dispatch('fetchSuggestedEmails')
    ])
  },
  /**
   * Fetch Available My Reports Column Groups
   * @param {*} reportType
   */
  async fetchColumnGroups ({ commit }, reportType) {
    try {
      const { data: { success, message, data } } = await this.$axios.get('/my-reports/columns', { params: { reportType } })
      if (!success) { throw new Error(message) }
      // filter out blank groups and sort columns
      const filteredData = data.filter(x => x.columns && !!x.columns.length && x.columns.sort())
      commit('setColumnGroups', filteredData)
    } catch (error) {
      commit('setColumnGroups', [])
      throw error
    }
  },
  /**
   * Fetch My Report Data
   * @param {*} reportConfig
   */
  async fetchReportData ({ commit }, reportConfig) {
    try {
      commit('setReportLoading', true)
      // const { data: { success, message, data } } = await this.$axios.post('/my-reports/build-report', reportConfig)
      // if (!success) { throw new Error(message) }
      await console.log('TODO: fetch data')
      const data = [
        { center_code: '001', vehicle_number: 'E22444' },
        { center_code: 'A01', vehicle_number: 'E22445' },
        { center_code: 'B01', vehicle_number: 'E22446' }
      ]
      commit('setReportData', data)
    } catch (error) {
      commit('setReportData', [])
    } finally {
      commit('setReportLoading', false)
    }
  },
  async fetchProfiles ({ commit }) {
    try {
      // const { data: { success, message, data } } = await this.$axios.get('/my-reports/profiles')
      // if (!success) { throw new Error(message) }
      await console.log('TODO: fetch data')
      const data = [
        {
          profile_name: 'BIL:  RENTAL BILLING SUMMARY',
          profile_group: 'BILLING INVOICE INFORMATION',
          profile_date_modified: '2020-04-08',
          profile_id: 'MO109GLOBAL~~~~~~BIL:~~RENTAL~BILLING~SUMMARY~~~~~~~',
          profile_admin_created: 'N'
        },
        {
          profile_name: 'BIL:  TAXES & DEPRECIATION',
          profile_group: 'BILLING INVOICE INFORMATION',
          profile_date_modified: '2020-03-25',
          profile_id: 'MO109GLOBAL~~~~~~BIL:~~TAXES~&~DEPRECIATION~~~~~~~~~',
          profile_admin_created: 'N'
        },
        {
          profile_name: 'OPS:  OPERATING EXPENSES',
          profile_group: 'EXPENSE INFORMATION',
          profile_date_modified: '2020-04-06',
          profile_id: 'MO109GLOBAL~~~~~~OPS:~~OPERATING~EXPENSES~~~~~~~~~~~',
          profile_admin_created: 'N'
        },
        {
          profile_name: 'FUEL:  PREMIUM PURCHASES',
          profile_group: 'FUEL TRANSACTION INFORMATION',
          profile_date_modified: '2020-03-25',
          profile_id: 'MO109GLOBAL~~~~~~FUEL:~~PREMIUM~PURCHASES~~~~~~~~~~~',
          profile_admin_created: 'N'
        },
        {
          profile_name: 'MNT:  NON-NATIONAL VENDORS',
          profile_group: 'FUEL TRANSACTION INFORMATION',
          profile_date_modified: '2020-03-25',
          profile_id: 'MO109GLOBAL~~~~~~MNT:~~NON-NATIONAL~VENDORS~~~~~~~~~',
          profile_admin_created: 'N'
        },
        {
          profile_name: 'VIOLATION REPORT',
          profile_group: 'FUEL TRANSACTION INFORMATION',
          profile_date_modified: '2020-04-07',
          profile_id: 'MO109GLOBAL~~~~~~VIOLATION~REPORT~~~~~~~~~~~~~~~~~~~',
          profile_admin_created: 'N'
        },
        {
          profile_name: 'VEH:  MAKE / MODEL REPORT',
          profile_group: 'VEHICLE-DRIVER INFORMATION',
          profile_date_modified: '2020-03-25',
          profile_id: 'MO109GLOBAL~~~~~~VEH:~~MAKE~/~MODEL~REPORT~~~~~~~~~~',
          profile_admin_created: 'N'
        },
        {
          profile_name: 'VEH:  VEHICLE INVENTORY',
          profile_group: 'VEHICLE-DRIVER INFORMATION',
          profile_date_modified: '2020-03-25',
          profile_id: 'MO109GLOBAL~~~~~~VEH:~~VEHICLE~INVENTORY~~~~~~~~~~~~',
          profile_admin_created: 'N'
        }
      ]
      commit('setProfiles', data)
    } catch (error) {
      commit('setProfiles', [])
    }
  },
  async fetchSuggestedEmails ({ commit }) {
    try {
      // const { data: { success, message, data } } = await this.$axios.get('/my-reports/suggested-emails')
      // if (!success) { throw new Error(message) }
      await console.log('TODO: suggested emails')
      const emails = [
        'agriffith@emkay.com',
        'jklonowski@emkay.com',
        'jim@jimklonowski.com'
      ]
      commit('setSuggestedEmails', emails)
    } catch (error) {
      commit('setSuggestedEmails', [])
    }
  },
  clearProfile ({ commit }) {
    commit('setProfile', {})
    commit('setColumnGroups', [])
    commit('setReportData', [])
  },
  async loadProfile ({ commit }, id) {
    try {
      await console.log(`Loading profile ${id}`)
      // const { data: { success, message, data } } = await this.$axios.get('/my-reports/load-profile', { params: { id }})
      // if (!success) { throw new Error(message) }
      const data = {
        id,
        auto_send: false,
        centers: ['001', 'A01', 'B01'],
        columns: ['vehicle_number', 'center_code', 'center_name'],
        email_recipients: [],
        report_schedule: 'monthly',
        report_title: 'BIL: RENTAL BILLING SUMMARY',
        report_type: 'billing',
        start: '2020-03-01',
        end: '2020-04-01'
      }
      commit('setProfile', data)
    } catch (error) {
      await console.error(error)
    }
  },
  reset ({ commit }) {
    commit('reset')
  }
}

export const mutations = {
  reset: assign(getDefaultState()),
  setColumnGroups: set('column_groups'),
  setReportData: set('report_data'),
  setReportLoading: set('report_loading'),
  setProfile: set('profile'),
  setProfiles: set('profiles'),
  setSuggestedEmails: set('suggested_emails')
}

export const getters = {
  getColumnGroups: state => state.column_groups,
  getReportData: state => state.report_data,
  getReportLoading: state => state.report_loading,
  getReportTypes: state => state.report_types,
  getProfile: state => state.profile,
  getProfiles: state => state.profiles,
  getSuggestedEmails: state => state.suggested_emails
}
