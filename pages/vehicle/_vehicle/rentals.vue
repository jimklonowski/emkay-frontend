<template>
  <rental-history-table />
</template>

<script>
import { mapGetters } from 'vuex'
import RentalHistoryTable from '@/components/vehicle-dashboard/datatables/RentalHistoryTable'
/**
 * Vehicle Dashboard Rental History
 */
export default {
  name: 'VehicleRentals',
  layout: 'vehicle-dashboard',
  components: {
    RentalHistoryTable
  },
  computed: {
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
      title: `${this.vehicle_number} - ${this.$i18n.t('rentals')}`,
      meta: [
        { hid: 'og:description', property: 'og:description', content: this.title }
      ]
    }
  }
}
</script>
