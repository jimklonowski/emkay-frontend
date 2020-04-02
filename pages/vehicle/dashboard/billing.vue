<template>
  <billing-history-table />
</template>

<script>
import { mapGetters } from 'vuex'
import BillingHistoryTable from '@/components/vehicle-dashboard/datatables/BillingHistoryTable'

/**
 * Vehicle Dashboard Billing History
 */
export default {
  name: 'VehicleBilling',
  layout: 'vehicle-dashboard',
  components: {
    BillingHistoryTable
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
      title: `${this.vehicle_number} - ${this.$i18n.t('billing')}`,
      meta: [
        { hid: 'og:description', property: 'og:description', content: this.title }
      ]
    }
  }
}
</script>
