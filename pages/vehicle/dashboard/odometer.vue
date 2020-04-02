<template>
  <odometer-history-table />
</template>

<script>
import { mapGetters } from 'vuex'
// import ReportOdometerForm from '@/components/vehicle-dashboard/forms/ReportOdometerForm'
import OdometerHistoryTable from '@/components/vehicle-dashboard/datatables/OdometerHistoryTable'

/**
 * Vehicle Dashboard Odometer History
 */
export default {
  name: 'VehicleOdometer',
  layout: 'vehicle-dashboard',
  components: {
    OdometerHistoryTable
  },
  computed: {
    /**
     * Vuex Getters
     */
    ...mapGetters({
      vehicle_number: 'vehicle-dashboard/getVehicleNumber'
    })
  },
  /**
   * Clear the query and hash on mounted
   */
  mounted () {
    if (Object.keys(this.$route.query).length > 0 || this.$route.hash.length > 0) {
      this.$router.replace({ query: undefined, hash: undefined })
    }
  },
  /**
   * Page Meta
   */
  head () {
    return {
      title: `${this.vehicle_number} - ${this.$i18n.t('odometer')}`,
      meta: [
        { hid: 'og:description', property: 'og:description', content: this.title }
      ]
    }
  }
}
</script>
