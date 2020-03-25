import { assign, set, push } from '@/utility/vuex'

const getDefaultState = () => ({
  loading: false,
  results: []
})

export const state = () => getDefaultState()

export const actions = {
  /**
   * Search for Vehicles
   * SearchTypes: 'VEHICLE_NUMBER', 'LAST_NAME', 'FIRST_NAME', 'CLIENT_VEHICLE_NUMBER', 'VIN', 'PLATE'
   * @param {*} query
   */
  async searchVehicles ({ commit }, query) {
    try {
      commit('setResults', [])
      commit('setLoading', true)
      const SEARCH_TYPES = ['VEHICLE_NUMBER', 'LAST_NAME', 'FIRST_NAME', 'CLIENT_VEHICLE_NUMBER', 'VIN', 'PLATE']
      await Promise.all(SEARCH_TYPES.map(async (type) => {
        const params = { type, query }
        // eslint-disable-next-line no-unused-vars
        const { data: { success, message, data } } = await this.$axios.get('/vehicle-search', { params })
        if (success) {
          data.forEach(item => {
            commit('pushResults', item)
          })
        }
      }))
    } catch (error) {
      console.error(error)
    } finally {
      commit('setLoading', false)
    }
  },
  reset ({ commit }) {
    commit('reset')
  }
}

export const mutations = {
  pushResults: push('results'),
  reset: assign(getDefaultState()),
  setLoading: set('loading'),
  setResults: set('results')
}

export const getters = {
  getLoading: state => state.loading,
  getResults: state => state.results
}
