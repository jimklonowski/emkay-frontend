<template>
  <v-card flat tile>
    <v-card-title>{{ $t('evoucher') }}</v-card-title>
    <v-card-text>{{ evoucher }}</v-card-text>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  /**
   * Fetch eVoucher
   */
  async fetch () {
    await this.fetchEvoucher()
  },
  computed: {
    /**
     * Vuex Getters
     */
    ...mapGetters({
      evoucher: 'vehicle-dashboard/getEvoucher',
      vehicle_number: 'vehicle-dashboard/getVehicleNumber'
    })
  },
  methods: {
    /**
     * Vuex Actions
     */
    ...mapActions({
      fetchEvoucher: 'vehicle-dashboard/fetchEvoucher'
    })
  }
}
</script>
