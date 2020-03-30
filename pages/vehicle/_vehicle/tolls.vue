<template>
  <toll-history-table />
</template>

<script>
import { mapGetters } from 'vuex'
import TollHistoryTable from '@/components/vehicle-dashboard/datatables/TollHistoryTable'

/**
 * Vehicle Dashboard Toll History
 */
export default {
  name: 'VehicleTolls',
  layout: 'vehicle-dashboard',
  components: {
    TollHistoryTable
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
      title: `${this.vehicle_number} - ${this.$i18n.t('tolls')}`,
      meta: [
        { hid: 'og:description', property: 'og:description', content: this.title }
      ]
    }
  }
}
</script>
