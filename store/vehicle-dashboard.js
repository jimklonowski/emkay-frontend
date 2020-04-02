import { assign, set } from '@/utility/vuex'

const getDefaultState = () => ({
  accident_history: [],
  billing_history: [],
  documents: [],
  driver_details: {},
  driver_number: null,
  expense_summary: {},
  expense_summary_loading: false,
  fuel_history: [],
  inspection_history: [],
  licensing_history: [],
  maintenance_history: [],
  notes: [],
  odometer_history: [],
  order_status: {},
  rental_history: [],
  sale_info: {},
  toll_history: [],
  transport_storage_history: [],
  transport_storage_quote: {},
  vehicle_details: {},
  vehicle_number: null,
  violation_history: []
})

export const state = () => getDefaultState()

export const actions = {
  /**
   * Called first when entering a vehicle's dashboard.
   * @param {*} vehicle Vehicle Number
   */
  async init ({ commit, dispatch }, { vehicle }) {
    console.log(`[vuex][vehicle-dashboard]: called init for #${vehicle}`)
    commit('reset')
    await Promise.all([
      dispatch('fetchVehicleDetails', { vehicle }),
      dispatch('fetchDriverDetails', { vehicle }),
      dispatch('fetchOrderStatus', { vehicle }),
      dispatch('fetchSaleInfo', { vehicle })
    ]).then(() => {
      this.$cookies.set('vehicle_number', vehicle, { path: '/', maxAge: 60 * 60, secure: true })
      commit('setVehicleNumber', vehicle)
    })
  },
  /**
   * Fetch Vehicle Details
   * @param {*} vehicle Vehicle Number
   */
  async fetchVehicleDetails ({ commit }, { vehicle }) {
    try {
      const { data: { success, message, data } } = await this.$axios.get('/vehicle/vehicle-details', { params: { vehicle } })
      if (!success) { throw new Error(message) }
      commit('setVehicleDetails', data)
    } catch (error) {
      console.error(`[vuex error][fetchVehicleDetails]: ${error.message}`)
      commit('setVehicleDetails', {})
    }
  },
  /**
   * Fetch Driver Details
   * MAYBE WE SHOULD USE THE DRIVER STORE INSTEAD?
   * @param {*} vehicle Vehicle Number
   */
  async fetchDriverDetails ({ commit }, { vehicle }) {
    try {
      const { data: { success, message, data } } = await this.$axios.get('/vehicle/driver-details', { params: { vehicle } })
      if (!success) { throw new Error(message) }
      commit('setDriverDetails', data)
      commit('setDriverNumber', data.reference_number)
    } catch (error) {
      console.error(`[vuex error][fetchDriverDetails]: ${error.message}`)
      commit('setDriverDetails', {})
    }
  },
  /**
   * Fetch Order Status
   * @param {*} vehicle Vehicle Number
   */
  async fetchOrderStatus ({ commit }, { vehicle }) {
    try {
      const { data: { success, message, data } } = await this.$axios.get('/vehicle/order-status', { params: { vehicle } })
      if (!success) { throw new Error(message) }
      commit('setOrderStatus', data)
    } catch (error) {
      console.error(`[vuex error][fetchOrderStatus]: ${error.message}`)
      commit('setOrderStatus', {})
    }
  },
  /**
   * Fetch Sale Info
   * @param {*} vehicle Vehicle Number
   */
  async fetchSaleInfo ({ commit }, { vehicle }) {
    try {
      const { data: { success, message, data } } = await this.$axios.get('/vehicle/sale-info', { params: { vehicle } })
      if (!success) { throw new Error(message) }
      commit('setSaleInfo', data)
    } catch (error) {
      console.error(`[vuex error][fetchSaleInfo]: ${error.message}`)
      commit('setSaleInfo', {})
    }
  },
  /**
   * Fetch Billing History between two dates
   * @param {*} start Start Date
   * @param {*} end End Date
   * @param {*} vehicle Vehicle Number
   */
  async fetchBillingHistory ({ commit }, { start, end, vehicle }) {
    try {
      const { data: { success, message, data } } = await this.$axios.get('/vehicle/billing-history', { params: { start, end, vehicle } })
      if (!success) { throw new Error(message) }
      commit('setBillingHistory', data)
    } catch (error) {
      console.error(`[vuex error][fetchBillingHistory]: ${error.message}`)
      commit('setBillingHistory', [])
    }
  },
  /**
   * Fetch Licensing History between two dates
   * @param {*} start Start Date
   * @param {*} end End Date
   * @param {*} vehicle Vehicle Number
   */
  async fetchLicensingHistory ({ commit }, { start, end, vehicle }) {
    try {
      const { data: { success, message, data } } = await this.$axios.get('/vehicle/licensing-history', { params: { start, end, vehicle } })
      if (!success) { throw new Error(message) }
      commit('setLicensingHistory', data)
    } catch (error) {
      console.error(`[vuex error][fetchLicensingHistory]: ${error.message}`)
      commit('setLicensingHistory', [])
    }
  },
  /**
   * Fetch Fuel History between two dates
   * @param {*} start Start Date
   * @param {*} end End Date
   * @param {*} use_bill_date Use Bill Date?
   * @param {*} vehicle Vehicle Number
   */
  async fetchFuelHistory ({ commit }, { start, end, use_bill_date, vehicle }) {
    try {
      const { data: { success, message, data } } = await this.$axios.get('/vehicle/fuel-history', { params: { start, end, use_bill_date, vehicle } })
      if (!success) { throw new Error(message) }
      commit('setFuelHistory', data)
    } catch (error) {
      console.error(`[vuex error][fetchFuelHistory]: ${error.message}`)
      commit('setFuelHistory', [])
    }
  },
  /**
   * Fetch Maintenance History between two dates
   * @param {*} start Start Date
   * @param {*} end End Date
   * @param {*} use_bill_date Use Bill Date?
   * @param {*} vehicle Vehicle Number
   */
  async fetchMaintenanceHistory ({ commit }, { start, end, use_bill_date, vehicle }) {
    try {
      const { data: { success, message, data } } = await this.$axios.get('/vehicle/maintenance-history', { params: { start, end, use_bill_date, vehicle } })
      if (!success) { throw new Error(message) }
      commit('setMaintenanceHistory', data)
    } catch (error) {
      console.error(`[vuex error][fetchMaintenanceHistory]: ${error.message}`)
      commit('setMaintenanceHistory', [])
    }
  },
  /**
   * Fetch Odometer History between two dates
   * @param {*} start Start Date
   * @param {*} end End Date
   * @param {*} vehicle Vehicle Number
   */
  async fetchOdometerHistory ({ commit }, { start, end, vehicle }) {
    try {
      const { data: { success, message, data } } = await this.$axios.get('/vehicle/odometer-history', { params: { start, end, vehicle } })
      if (!success) { throw new Error(message) }
      commit('setOdometerHistory', data)
    } catch (error) {
      console.error(`[vuex error][fetchOdometerHistory]: ${error.message}`)
      commit('setOdometerHistory', [])
    }
  },
  /**
   * Fetch Toll History between two dates
   * @param {*} start Start Date
   * @param {*} end End Date
   * @param {*} vehicle Vehicle Number
   */
  async fetchTollHistory ({ commit }, { start, end, vehicle }) {
    try {
      const { data: { success, message, data } } = await this.$axios.get('/vehicle/toll-history', { params: { start, end, vehicle } })
      if (!success) { throw new Error(message) }
      commit('setTollHistory', data)
    } catch (error) {
      console.error(`[vuex error][fetchTollHistory]: ${error.message}`)
      commit('setTollHistory', [])
    }
  },
  /**
   * Fetch Accident History between two dates
   * @param {*} start Start Date
   * @param {*} end End Date
   * @param {*} vehicle Vehicle Number
   */
  async fetchAccidentHistory ({ commit }, { start, end, vehicle }) {
    try {
      const { data: { success, message, data } } = await this.$axios.get('/vehicle/accident-history', { params: { start, end, vehicle } })
      if (!success) { throw new Error(message) }
      commit('setAccidentHistory', data)
    } catch (error) {
      console.error(`[vuex error][fetchAccidentHistory]: ${error.message}`)
      commit('setAccidentHistory', [])
    }
  },
  /**
   * Fetch Rental History between two dates
   * @param {*} start Start Date
   * @param {*} end End Date
   * @param {*} vehicle Vehicle Number
   */
  async fetchRentalHistory ({ commit }, { start, end, vehicle }) {
    try {
      const { data: { success, message, data } } = await this.$axios.get('/vehicle/rental-history', { params: { start, end, vehicle } })
      if (!success) { throw new Error(message) }
      commit('setRentalHistory', data)
    } catch (error) {
      console.error(`[vuex error][fetchRentalHistory]: ${error.message}`)
      commit('setRentalHistory', [])
    }
  },
  /**
   * Fetch Violation History between two dates
   * @param {*} start Start Date
   * @param {*} end End Date
   * @param {*} vehicle Vehicle Number
   */
  async fetchViolationHistory ({ commit }, { start, end, vehicle }) {
    try {
      const { data: { success, message, data } } = await this.$axios.get('/vehicle/violation-history', { params: { start, end, vehicle } })
      if (!success) { throw new Error(message) }
      commit('setViolationHistory', data)
    } catch (error) {
      console.error(`[vuex error][fetchViolationHistory]: ${error.message}`)
      commit('setViolationHistory', [])
    }
  },
  /**
   * Fetch Inspection History between two dates
   * @param {*} start Start Date
   * @param {*} end End Date
   * @param {*} vehicle Vehicle Number
   */
  async fetchInspectionHistory ({ commit }, { start, end, vehicle }) {
    try {
      const { data: { success, message, data } } = await this.$axios.get('/vehicle/inspection-history', { params: { start, end, vehicle } })
      if (!success) { throw new Error(message) }
      commit('setInspectionHistory', data)
    } catch (error) {
      console.error(`[vuex error][fetchInspectionHistory]: ${error.message}`)
      commit('setInspectionHistory', [])
    }
  },
  /**
   * Fetch Expense Summary table
   * @param {*} vehicle Vehicle Number
   */
  async fetchExpenseSummary ({ commit }, { vehicle }) {
    try {
      commit('setExpenseSummaryLoading', true)
      const { data: { success, message, data } } = await this.$axios.get('/vehicle/expense-summary', { params: { vehicle } })
      if (!success) { throw new Error(message) }
      commit('setExpenseSummary', data)
    } catch (error) {
      console.error(`[vuex error][fetchExpenseSummary]: ${error.message}`)
      commit('setExpenseSummary', {})
    } finally {
      commit('setExpenseSummaryLoading', false)
    }
  },
  /**
   * Fetch Transport/Storage History
   * @param {*} vehicle Vehicle Number
   */
  async fetchTransportStorageHistory ({ commit }, { vehicle }) {
    try {
      const { data: { success, message, data } } = await this.$axios.get('/vehicle/transport-storage-history', { params: { vehicle } })
      if (!success) { throw new Error(message) }
      commit('setTransportStorageHistory', data)
    } catch (error) {
      console.error(`[vuex error][fetchTransportStorageHistory]: ${error.message}`)
      commit('setTransportStorageHistory', [])
    }
  },
  /**
   * Fetch Transport/Storage Quote
   * @param {*} payload quote parameters
   */
  async fetchTransportStorageQuote ({ commit }, payload) {
    try {
      const { data: { success, message, data } } = await this.$axios.post('/vehicle/transport-storage-quote', payload)
      if (!success) { throw new Error(message) }
      commit('setTransportStorageQuote', data)
    } catch (error) {
      console.error(`[vuex error][fetchTransportStorageQuote]: ${error.message}`)
      commit('setTransportStorageQuote', {})
      throw new Error(error)
    }
  },
  /**
   * Fetch Vehicle Documents
   * @param {*} vehicle Vehicle Number
   */
  async fetchDocuments ({ commit }, { vehicle }) {
    try {
      const { data: { success, message, data } } = await this.$axios.get('/vehicle/documents', { params: { vehicle } })
      if (!success) { throw new Error(message) }
      commit('setDocuments', data)
    } catch (error) {
      console.error(`[vuex error][fetchDocuments]: ${error.message}`)
      commit('setDocuments', [])
    }
  },
  /**
   * Upload Vehicle Documents
   * @param {*} vehicle Vehicle Number
   * @param {*} files Array of Files
   */
  async uploadDocuments ({ commit, dispatch }, { vehicle, files }) {
    try {
      const { data: { success, message } } = await this.$axios.post('/vehicle/upload-documents', { params: { vehicle, files } })
      if (!success) { throw new Error(message) }
      dispatch('fetchDocuments', { vehicle })
    } catch (error) {
      console.error(`[vuex error][uploadDocuments]: ${error.message}`)
      throw new Error(error.message)
    }
  },
  /**
   * Fetch Vehicle Notes
   * @param {*} vehicle Vehicle Number
   */
  async fetchNotes ({ commit }, { vehicle }) {
    try {
      const { data: { success, message, data } } = await this.$axios.get('/vehicle/notes', { params: { vehicle } })
      if (!success) { throw new Error(message) }
      commit('setNotes', data)
    } catch (error) {
      console.error(`[vuex error][fetchNotes]: ${error.message}`)
      commit('setNotes', [])
    }
  },
  /**
   * Add Vehicle Note
   * @param {*} vehicle Vehicle Number
   * @param {*} note Note Text
   */
  async addNote ({ commit, dispatch }, { vehicle, note }) {
    try {
      const { data: { success, message } } = await this.$axios.post('/vehicle/add-note', { params: { vehicle, note } })
      if (!success) { throw new Error(message) }
      dispatch('fetchNotes', { vehicle })
    } catch (error) {
      console.error(`[vuex error][addNote]: ${error.message}`)
      throw new Error(error.message)
    }
  },
  /**
   * VEHICLE ADD/UPDATE. Maybe these go into Fleet store?
   */
  async addVehicle ({ commit, dispatch }, payload) {
    try {
      const { data: { success, message } } = await this.$axios.post('vehicle/add-vehicle', payload)
      if (!success) { throw new Error(message) }
      // await dispatch('init', payl)
    } catch (error) {
      console.error(`[vuex error][addVehicle]: ${error.message}`)
      throw new Error(error.message)
    }
  },
  async updateVehicle ({ commit, dispatch }, payload) {
    try {
      const { data: { success, message } } = await this.$axios.post('vehicle/update-vehicle', payload)
      if (!success) { throw new Error(message) }
      // await dispatch('init', payload.vehicle_number)
    } catch (error) {
      console.error(`[vuex error][updateVehicle]: ${error.message}`)
      throw new Error(error.message)
    }
  },
  reset ({ commit }) {
    this.cookies.remove('vehicle_number')
    commit('reset')
  }
}

export const mutations = {
  reset: assign(getDefaultState()),
  setAccidentHistory: set('accident_history'),
  setBillingHistory: set('billing_history'),
  setDocuments: set('documents'),
  setDriverDetails: set('driver_details'),
  setDriverNumber: set('driver_number'),
  setExpenseSummary: set('expense_summary'),
  setExpenseSummaryLoading: set('expense_summary_loading'),
  setFuelHistory: set('fuel_history'),
  setInspectionHistory: set('inspection_history'),
  setLicensingHistory: set('licensing_history'),
  setMaintenanceHistory: set('maintenance_history'),
  setNotes: set('notes'),
  setOdometerHistory: set('odometer_history'),
  setOrderStatus: set('order_status'),
  setRentalHistory: set('rental_history'),
  setSaleInfo: set('sale_info'),
  setTollHistory: set('toll_history'),
  setTransportStorageHistory: set('transport_storage_history'),
  setTransportStorageQuote: set('transport_storage_quote'),
  setVehicleDetails: set('vehicle_details'),
  setVehicleNumber: set('vehicle_number'),
  setViolationHistory: set('violation_history')
}

export const getters = {
  getAccidentHistory: state => state.accident_history,
  getBillingHistory: state => state.billing_history,
  getDocuments: state => state.documents,
  getDriverCityStateZip: state => [[state.driver_details.city, state.driver_details.state_province].filter(Boolean).join(', '), state.driver_details.postal_code].filter(Boolean).join(' '),
  getDriverDetails: state => state.driver_details,
  getDriverName: state => [state.driver_details.first_name, state.driver_details.last_name].filter(Boolean).join(' '),
  getDriverNumber: state => state.driver_number,
  getExpenseSummary: state => state.expense_summary,
  getExpenseSummaryLoading: state => state.expense_summary_loading,
  getFuelHistory: state => state.fuel_history,
  getInspectionHistory: state => state.inspection_history,
  getLicensingHistory: state => state.licensing_history,
  getMaintenanceHistory: state => state.maintenance_history,
  getNotes: state => state.notes,
  getOdometerHistory: state => state.odometer_history,
  getOrderStatus: state => state.order_status,
  getRentalHistory: state => state.rental_history,
  getSaleInfo: state => state.sale_info,
  getTollHistory: state => state.toll_history,
  getTransportStorageHistory: state => state.transport_storage_history,
  getTransportStorageQuote: state => state.transport_storage_quote,
  getVehicleDetails: state => state.vehicle_details,
  getVehicleNumber: state => state.vehicle_number,
  getViolationHistory: state => state.violation_history,
  getYearMakeModel: state => [state.vehicle_details.year, state.vehicle_details.make, state.vehicle_details.model].filter(Boolean).join(' '),
  hasOrderStatus: state => !!state.order_status && Object.keys(state.order_status).length !== 0,
  hasSaleInfo: state => !!state.sale_info && !!state.sale_info.sale_date,
  hasVehicle: state => !!state.vehicle_number,

  getTotalFixed: state =>
    state.expense_summary.depreciation +
    state.expense_summary.interest +
    state.expense_summary.licensing +
    state.expense_summary.tax,
  getTotalFixedCPM: state =>
    state.expense_summary.depreciation_cpm +
    state.expense_summary.interest_cpm +
    state.expense_summary.licensing_cpm +
    state.expense_summary.tax_cpm,
  getTotalVariable: state =>
    state.expense_summary.maintenance +
    state.expense_summary.accident +
    state.expense_summary.fuel,
  getTotalVariableCPM: state =>
    state.expense_summary.maintenance_cpm +
    state.expense_summary.accident_cpm +
    state.expense_summary.fuel_cpm,
  getTotalCosts: state =>
    state.expense_summary.depreciation +
    state.expense_summary.interest +
    state.expense_summary.licensing +
    state.expense_summary.tax +
    state.expense_summary.maintenance +
    state.expense_summary.accident +
    state.expense_summary.fuel,
  getTotalCPM: state =>
    state.expense_summary.depreciation_cpm +
    state.expense_summary.interest_cpm +
    state.expense_summary.licensing_cpm +
    state.expense_summary.tax_cpm +
    state.expense_summary.maintenance_cpm +
    state.expense_summary.accident_cpm +
    state.expense_summary.fuel_cpm
}
