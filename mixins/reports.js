import { mapGetters } from 'vuex'

/**
 * Adds fetch hook, vuex getters mapped to data, error and center_levels, center-picker component, watcher for query parameters, json-download properties, and page title
 * Report still requires:
 *  vuex action mapped to fetchReport
 *  'query' parameter object (computed prop)
 *  'title' (computed or data)
 */
export const reportMixins = {
  components: {
    'center-picker': () => import(/* webpackChunkName: "CenterPicker" */ '@/components/core/CenterPicker.vue'),
    'vehicle-number-button': () => import(/* webpackChunkName: "VehicleNumberButton" */ '@/components/vehicle-dashboard/VehicleNumberButton.vue')
  },
  data: () => ({
    centers_dialog: false,
    centers_selected: [],
    panels_expanded: [0],
    search: '',
    search_centers: ''
  }),
  /**
   * Async Fetch
   * See: https://nuxtjs.org/api/pages-fetch#nuxt-gt-2-12
   */
  async fetch () {
    await this.fetchReport(this.query)
  },
  fetchOnServer: false, // https://nuxtjs.org/api/pages-fetch#options
  computed: {
    ...mapGetters({
      center_levels: 'account/getCenterLevels',
      items: 'reports/getData',
      error: 'reports/getError'
    }),
    /**
     * Flatten an array of strings to a single object { text1: value1, text2: value2, etc... }
     * Used for downloading as excel
     */
    downloadFields () {
      const headers = Object.assign({}, ...this.columns.map(column => {
        // If this is a center level, lookup center level name from vuex.  Otherwise use the column as i18n translation key.
        let header
        if (column.startsWith('level_')) {
          if (this.center_levels[column] && this.center_levels[column].startsWith('level_')) {
            header = this.$i18n.t(column)
          } else {
            header = this.center_levels[column]
          }
        } else {
          header = this.$i18n.t(column)
        }
        return { [header]: column }
      }, this))
      return headers
    },
    /**
     * Name of exported file
     * example: EM102-InventoryReport-2020-03-13.xls
     */
    exportName () {
      const extension = '.xls'
      const acct = this.$auth.user.account || this.$i18n.t('account')
      const vehicle = this.vehicle_number
      const title = this.title || this.$i18n.t('report')
      const date = this.$moment().format()
      // const filename = `${acct}-${name}-${date}.xls`
      const filename = [acct, vehicle, title, date].filter(Boolean).join('-').concat(extension).replace(/\s/g, '')
      return filename
    }
  },
  /**
   * Re-fetch data on query change
   */
  watch: {
    '$route.query': '$fetch'
  },
  methods: {
    updateQuery () {
      this.$router.push({ query: this.query })
    }
  },
  head () {
    return {
      title: this.title,
      meta: [
        { hid: 'og:description', property: 'og:description', content: this.title }
      ]
    }
  }
}
