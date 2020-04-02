<template>
  <v-btn
    :title="$t('to_vehicle_dashboard')"
    nuxt
    text
    color="primary"
    @click="goToVehicleDashboard()"
  >
    {{ vehicleNumber }}
  </v-btn>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
    vehicleNumber: {
      type: String,
      required: true
    }
  },
  methods: {
    /**
     * Vuex Actions
     */
    ...mapActions({
      selectVehicle: 'vehicle-dashboard/init'
    }),
    async goToVehicleDashboard () {
      // init vehicle dashboard data and then go to dashboard
      await this.selectVehicle({ vehicle: this.vehicleNumber })
      this.$router.push({ path: '/vehicle/dashboard' })
    }
  }
}
</script>
