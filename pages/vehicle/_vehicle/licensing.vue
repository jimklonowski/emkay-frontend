<template>
  <licensing-history-table />
</template>

<script>
import { mapGetters } from 'vuex'
import LicensingHistoryTable from '@/components/vehicle-dashboard/datatables/LicensingHistoryTable'
/**
 * Vehicle Dashboard Licensing History
 */
export default {
  name: 'VehicleLicensing',
  layout: 'vehicle-dashboard',
  components: {
    LicensingHistoryTable
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
    const title = `${this.vehicle_number} - ${this.$t('licensing')}`
    return {
      title,
      meta: [
        { hid: 'og:description', property: 'og:description', content: title }
      ]
    }
  }
}
</script>
