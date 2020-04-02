<template>
  <violation-history-table />
</template>

<script>
import { mapGetters } from 'vuex'
import ViolationHistoryTable from '@/components/vehicle-dashboard/datatables/ViolationHistoryTable'
export default {
  name: 'Violation',
  layout: 'vehicle-dashboard',
  components: {
    ViolationHistoryTable
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
      title: `${this.vehicle_number} - ${this.$i18n.t('violations')}`,
      meta: [
        { hid: 'og:description', property: 'og:description', content: this.title }
      ]
    }
  }
}
</script>
