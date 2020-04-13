<template>
  <v-btn
    :title="$t('to_vehicle_dashboard')"
    :icon="icon && !text"
    :ripple="false"
    nuxt
    text
    :color="color"
    @click="goToVehicleDashboard()"
  >
    <v-icon v-if="icon" v-text="icon" />
    <span v-if="text" v-text="text" />
    <span v-else-if="!text && !icon" v-text="vehicleNumber" />
  </v-btn>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
    color: {
      type: String,
      default: 'primary'
    },
    icon: {
      type: [Boolean, String],
      default: false
    },
    text: {
      type: String,
      default: ''
    },
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
      this.$router.push(this.localePath({ path: '/vehicle/dashboard' }))
    }
  }
}
</script>
