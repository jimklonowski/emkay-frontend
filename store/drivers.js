import { assign, set } from '@/utility/vuex'

const getDefaultState = () => ({
  // drivers
  drivers: [],
  drivers_error: null,
  drivers_loading: false,

  // selected driver
  driver: {},
  driver_error: null,
  driver_loading: false,
  vehicle_history: []
})

export const state = () => getDefaultState()

export const actions = {
  /**
   * Fetch Driver List
   */
  async fetchDrivers ({ commit }) {
    try {
      commit('setDriversLoading', true)
      const { data: { success, message, data } } = await this.$axios.get('/fleet/drivers')
      if (!success) { throw new Error(message) }
      commit('setDrivers', data)
    } catch (error) {
      console.error(`[vuex error][fetchDrivers]: ${error}`)
      commit('setDriversError', error)
      commit('setDrivers', [])
    } finally {
      commit('setDriversLoading', false)
    }
  },
  /**
   * Select a driver by driverId
   * @param {*} driver driverId
   */
  async initDriver ({ commit, dispatch }, { driver }) {
    console.log(`[vuex][drivers] called initDriver with driver #${driver}`)
    try {
      dispatch('resetDriver')
      commit('setDriverLoading', true)
      await Promise.all([
        dispatch('fetchDriver', { driver }),
        dispatch('fetchVehicleHistory', { driver })
      ])
    } catch (error) {
      console.error(`[vuex error][initDriver]: ${error}`)
      commit('setDriverError', error.message)
    } finally {
      commit('setDriverLoading', false)
    }
  },
  /**
   * Fetch Driver Details object by driverID
   * @param {*} driver driverId
   */
  async fetchDriver ({ commit }, { driver }) {
    try {
      const { data: { success, message, data } } = await this.$axios.get('/driver/driver-details', { params: { driver } })
      if (!success) { throw new Error(message) }
      commit('setDriver', data)
    } catch (error) {
      console.error(`[vuex error][fetchDriver]: ${error}`)
      commit('setDriverError', error)
      commit('setDriver', {})
    }
  },
  /**
   * Fetch Driver Vehicle History by driverID
   * @param {*} driver driverId
   */
  async fetchVehicleHistory ({ commit }, { driver }) {
    try {
      const { data: { success, message, data } } = await this.$axios.get('/driver/vehicle-history', { params: { driver } })
      if (!success) { throw new Error(message) }
      commit('setVehicleHistory', data)
    } catch (error) {
      commit('setVehicleHistory', [])
    }
  },
  reset ({ commit }) {
    commit('reset')
  },
  resetDriver ({ commit }) {
    commit('setDriver', {})
    commit('setDriverError', null)
    commit('setVehicleHistory', [])
  }
}

export const mutations = {
  reset: assign(getDefaultState()),

  setDriver: set('driver'),
  setDriverError: set('driver_error'),
  setDriverLoading: set('driver_loading'),
  setVehicleHistory: set('vehicle_history'),

  setDrivers: set('drivers'),
  setDriversError: set('drivers_error'),
  setDriversLoading: set('drivers_loading')
}

export const getters = {
  getDriver: state => state.driver,
  getDriverError: state => state.driver_error,
  getDriverLoading: state => state.driver_loading,
  getDriverNumber: state => state.driver.reference_number,
  getVehicleHistory: state => state.vehicle_history,

  getDrivers: state => state.drivers,
  getDriversError: state => state.drivers_error,
  getDriversLoading: state => state.drivers_loading
}
