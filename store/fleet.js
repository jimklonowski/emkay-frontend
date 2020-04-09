import { assign, set } from '@/utility/vuex'
import { compareObjectByKey, multiFilter } from '@/utility/helpers'

const getDefaultState = () => ({
  error: null,
  vehicles: []
})

export const state = () => getDefaultState()

export const actions = {
  async fetchVehicles ({ commit }) {
    try {
      const { data: { success, message, data } } = await this.$axios.get('/reports/inventory')
      if (!success) { throw new Error(message) }
      commit('setVehicles', data)
    } catch (error) {
      commit('setError', error.message)
      commit('setVehicles', [])
      throw new Error(error.message)
    }
  },
  reset ({ commit }) {
    commit('reset')
  }
}

export const mutations = {
  reset: assign(getDefaultState()),
  setError: set('error'),
  setVehicles: set('vehicles')
}

export const getters = {
  getError: state => state.error,
  getVehicles: state => state.vehicles,
  getModelYears: state => {
    return state.vehicles.map(x => x.model_year).filter((item, index, array) => array.indexOf(item) === index).sort().reverse()
  },
  getVehicleMakes: state => {
    return state.vehicles.map(x => x.vehicle_make).filter((item, index, array) => array.indexOf(item) === index).sort()
  },
  getVehicleModels: state => {
    return state.vehicles.map(x => x.vehicle_model).filter((item, index, array) => array.indexOf(item) === index).sort()
  },
  filteredVehicles: state => (filters) => {
    return multiFilter(state.vehicles, filters)
  },
  filteredVehiclesSort: state => (filters, sortBy, order) => {
    const filtered = multiFilter(state.vehicles, filters)
    return filtered.sort(compareObjectByKey(sortBy, order))
  }
}
