import { set, assign } from '@/utility/vuex'

/**
 * All report data can share the same vuex store, since we can't be on two different reports at the same time in this Vue app.
 */
const getDefaultState = () => ({
  data: [],
  error: null,
  loading: false
})

export const state = () => getDefaultState()

export const actions = {
  /**
   * Fetch INVENTORY REPORT data.
   * No parameters are supplied.
   */
  async fetchInventoryReport ({ commit }) {
    try {
      commit('setError', null)
      commit('setLoading', true)
      const { data: { success, message, data } } = await this.$axios.get('/reports/inventory')
      if (!success) { throw new Error(message) }
      commit('setData', data)
    } catch (error) {
      commit('setError', error.message)
      commit('setData', [])
    } finally {
      commit('setLoading', false)
    }
  },
  /**
   * Fetch FUEL DETAIL REPORT data.
   * @param start (YYYY-MM-DD)
   * @param end (YYYY-MM-DD)
   * @param use_bill_date (Boolean)
   */
  async fetchFuelDetailReport ({ commit }, { start, end, use_bill_date }) {
    try {
      commit('setError', null)
      commit('setLoading', true)
      const { data: { success, message, data } } = await this.$axios.get('/reports/fuel-detail', { params: { start, end, use_bill_date } })
      if (!success) { throw new Error(message) }
      commit('setData', data)
    } catch (error) {
      commit('setError', error.message)
      commit('setData', [])
    } finally {
      commit('setLoading', false)
    }
  },
  /**
   * Fetch MAINTENANCE DETAIL REPORT data.
   * @param start (YYYY-MM-DD)
   * @param end (YYYY-MM-DD)
   * @param use_bill_date (Boolean)
   */
  async fetchMaintenanceDetailReport ({ commit }, { start, end, use_bill_date }) {
    try {
      commit('setError', null)
      commit('setLoading', true)
      const { data: { success, message, data } } = await this.$axios.get('/reports/maintenance-detail', { params: { start, end, use_bill_date } })
      if (!success) { throw new Error(message) }
      commit('setData', data)
    } catch (error) {
      commit('setError', error.message)
      commit('setData', [])
    } finally {
      commit('setLoading', false)
    }
  },
  /**
   * Fetch ORDER STATUS REPORT data.
   * @param start (YYYY-MM-DD)
   * @param end (YYYY-MM-DD)
   */
  async fetchOrderStatusReport ({ commit }, { start, end }) {
    try {
      commit('setError', null)
      commit('setLoading', true)
      const { data: { success, message, data } } = await this.$axios.get('/reports/order-status-report', { params: { start, end } })
      if (!success) { throw new Error(message) }
      commit('setData', data)
    } catch (error) {
      commit('setError', error.message)
      commit('setData', [])
    } finally {
      commit('setLoading', false)
    }
  },
  /**
   * Fetch REPLACEMENT ANALYSIS REPORT data.
   * No parameters are supplied.
   */
  async fetchReplacementAnalysisReport ({ commit }, { report_type, report_months, miles_driven, and_or, months_in_service }) {
    try {
      commit('setError', null)
      commit('setLoading', true)
      const { data: { success, message, data } } = await this.$axios.get('/reports/replacement-analysis', { params: { report_type, report_months, miles_driven, and_or, months_in_service } })
      if (!success) { throw new Error(message) }
      commit('setData', data)
    } catch (error) {
      commit('setError', error.message)
      commit('setData', [])
    } finally {
      commit('setLoading', false)
    }
  },
  /**
   * Fetch SOLD VEHICLE ANALYSIS REPORT data.
   * No parameters are supplied.
   */
  async fetchSoldVehicleAnalysisReport ({ commit }, { start, end }) {
    try {
      commit('setError', null)
      commit('setLoading', true)
      const { data: { success, message, data } } = await this.$axios.get('/reports/sold-vehicle', { params: { start, end } })
      if (!success) { throw new Error(message) }
      commit('setData', data)
    } catch (error) {
      commit('setError', error.message)
      commit('setData', [])
    } finally {
      commit('setLoading', false)
    }
  },
  /**
   * Fetch EXPENSE DETAIL REPORT data.
   * @param start (YYYY-MM-DD)
   * @param end (YYYY-MM-DD)
   */
  async fetchExpenseDetailReport ({ commit }, { start, end }) {
    try {
      commit('setError', null)
      commit('setLoading', true)
      const { data: { success, message, data } } = await this.$axios.get('/reports/expense-detail-report', { params: { start, end } })
      if (!success) { throw new Error(message) }
      commit('setData', data)
    } catch (error) {
      commit('setError', error.message)
      commit('setData', [])
    } finally {
      commit('setLoading', false)
    }
  },
  /**
   * Fetch SHORT TERM RENTAL DETAIL REPORT data.
   * @param start (YYYY-MM-DD)
   * @param end (YYYY-MM-DD)
   */
  async fetchShortTermRentalDetailReport ({ commit }, { start, end }) {
    try {
      commit('setError', null)
      commit('setLoading', true)
      const { data: { success, message, data } } = await this.$axios.get('/reports/short-term-rental-detail-report', { params: { start, end } })
      if (!success) { throw new Error(message) }
      commit('setData', data)
    } catch (error) {
      commit('setError', error.message)
      commit('setData', [])
    } finally {
      commit('setLoading', false)
    }
  },
  /**
   * Fetch INVOICE HISTORY data.
   * @param start (YYYY-MM-DD)
   * @param end (YYYY-MM-DD)
   */
  async fetchInvoiceHistoryReport ({ commit }, { start, end }) {
    try {
      commit('setError', null)
      commit('setLoading', true)
      const { data: { success, message, data } } = await this.$axios.get('/reports/invoice-history', { params: { start, end } })
      if (!success) { throw new Error(message) }
      commit('setData', data)
    } catch (error) {
      commit('setError', error.message)
      commit('setData', [])
    } finally {
      commit('setLoading', false)
    }
  },
  /**
   * Fetch ACCIDENT CLAIM MANAGEMENT REPORT data.
   * @param start (YYYY-MM-DD)
   * @param end (YYYY-MM-DD)
   */
  async fetchAccidentClaimManagementReport ({ commit }, { start, end }) {
    try {
      commit('setError', null)
      commit('setLoading', true)
      const { data: { success, message, data } } = await this.$axios.get('/reports/accident-claim-management-report', { params: { start, end } })
      if (!success) { throw new Error(message) }
      commit('setData', data)
    } catch (error) {
      commit('setError', error.message)
      commit('setData', [])
    } finally {
      commit('setLoading', false)
    }
  },
  /**
   * Fetch DRIVER 360 MILEAGE REPORT data.
   * @param start (YYYY-MM-DD)
   * @param end (YYYY-MM-DD)
   */
  async fetchDriver360MileageReport ({ commit }, { start, end }) {
    try {
      commit('setError', null)
      commit('setLoading', true)
      const { data: { success, message, data } } = await this.$axios.get('/mobile-mileage/by-date', { params: { start, end } })
      if (!success) { throw new Error(message) }
      commit('setData', data)
    } catch (error) {
      commit('setError', error.message)
      commit('setData', [])
    } finally {
      commit('setLoading', false)
    }
  },
  /**
   * Fetch DRIVER RECORD REPORT data.
   * No parameters given.
   */
  async fetchDriverRecordReport ({ commit }) {
    try {
      commit('setError', null)
      commit('setLoading', true)
      const { data: { success, message, data } } = await this.$axios.get('/reports/driver-record-report')
      if (!success) { throw new Error(message) }
      commit('setData', data)
    } catch (error) {
      commit('setError', error.message)
      commit('setData', [])
    } finally {
      commit('setLoading', false)
    }
  },
  /**
   * Fetch DRIVER SAFETY REPORT data.
   * @param start (YYYY-MM-DD)
   * @param end (YYYY-MM-DD)
   */
  async fetchDriverSafetyReport ({ commit }, { start, end }) {
    try {
      commit('setError', null)
      commit('setLoading', true)
      const { data: { success, message, data } } = await this.$axios.get('/reports/driver-safety-report', { params: { start, end } })
      if (!success) { throw new Error(message) }
      commit('setData', data)
    } catch (error) {
      commit('setError', error.message)
      commit('setData', [])
    } finally {
      commit('setLoading', false)
    }
  },
  /**
   * Fetch SAFEROADS FLEET SUMMARY data.
   * @param start (YYYY-MM-DD)
   * @param end (YYYY-MM-DD)
   */
  async fetchSaferoadsFleetSummary ({ commit }, { start, end }) {
    try {
      commit('setError', null)
      commit('setLoading', true)
      const { data: { success, message, data } } = await this.$axios.get('/reports/saferoads-fleet-summary', { params: { start, end } })
      if (!success) { throw new Error(message) }
      commit('setData', data)
    } catch (error) {
      commit('setError', error.message)
      commit('setData', [])
    } finally {
      commit('setLoading', false)
    }
  },
  /**
   * Fetch SAFEROADS TRIP DETAIL REPORT data.
   * @param start (YYYY-MM-DD)
   * @param end (YYYY-MM-DD)
   */
  async fetchSaferoadsTripDetailReport ({ commit }, { start, end }) {
    try {
      commit('setError', null)
      commit('setLoading', true)
      const { data: { success, message, data } } = await this.$axios.get('/reports/saferoads-trip-detail-report', { params: { start, end } })
      if (!success) { throw new Error(message) }
      commit('setData', data)
    } catch (error) {
      commit('setError', error.message)
      commit('setData', [])
    } finally {
      commit('setLoading', false)
    }
  },
  /**
   * Fetch EVOUCHER REPORT data.
   */
  async fetchEvoucherReport ({ commit }) {
    try {
      commit('setError', null)
      commit('setLoading', true)
      const { data: { success, message, data } } = await this.$axios.get('/reports/evoucher')
      if (!success) { throw new Error(message) }
      commit('setData', data)
    } catch (error) {
      commit('setError', error.message)
      commit('setData', [])
    } finally {
      commit('setLoading', false)
    }
  },
  /**
   * Fetch LICENSE RENEWAL REPORT data.
   */
  async fetchLicenseRenewalReport ({ commit }) {
    try {
      commit('setError', null)
      commit('setLoading', true)
      const { data: { success, message, data } } = await this.$axios.get('/reports/license-renewal')
      if (!success) { throw new Error(message) }
      commit('setData', data)
    } catch (error) {
      commit('setError', error.message)
      commit('setData', [])
    } finally {
      commit('setLoading', false)
    }
  },
  /**
   * Fetch MPG REPORT data.
   */
  async fetchMPGReport ({ commit }, { start, end, below_avg }) {
    try {
      commit('setError', null)
      commit('setLoading', true)
      const { data: { success, message, data } } = await this.$axios.get('/reports/mpg-report', { params: { start, end, below_avg } })
      if (!success) { throw new Error(message) }
      commit('setData', data)
    } catch (error) {
      commit('setError', error.message)
      commit('setData', [])
    } finally {
      commit('setLoading', false)
    }
  },
  /**
   * Fetch TOLL DETAIL REPORT data.
   * @param {*} start Start Date
   * @param {*} end End Date
   */
  async fetchTollDetailReport ({ commit }, { start, end }) {
    try {
      commit('setError', null)
      commit('setLoading', true)
      const { data: { success, message, data } } = await this.$axios.get('/reports/toll-detail', { params: { start, end } })
      if (!success) { throw new Error(message) }
      commit('setData', data)
    } catch (error) {
      commit('setError', error.message)
      commit('setData', [])
    } finally {
      commit('setLoading', false)
    }
  },
  /**
   * Get the data using the generic webcom url (dev)
   * @param {*} filters The dbc command, subcommand, and other params
   */
  async fetchData ({ commit }, filters) {
    try {
      commit('setError', null)
      commit('setLoading', true)
      const url = `${process.env.EMKAY_API}/rest-test/webcom-generic-json`
      const { data: { success, message, data } } = await this.$axios.post(url, filters)
      commit('setData', data)
      if (!success) {
        throw new Error(message)
      }
    } catch (error) {
      // debugger
      console.error(`ERROR: ${error}`)
      commit('setError', error.message)
      commit('setData', [])
    } finally {
      commit('setLoading', false)
    }
  },
  reset ({ commit }) {
    commit('reset')
  }
}

export const mutations = {
  reset: assign(getDefaultState()),
  setData: set('data'),
  setError: set('error'),
  setLoading: set('loading')
}

export const getters = {
  getError: state => state.error,
  getLoading: state => state.loading,
  getData: state => state.data
}
