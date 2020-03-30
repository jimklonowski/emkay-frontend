<template>
  <h1>transports and storage</h1>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'VehicleTransportsAndStorage',
  computed: {
    ...mapGetters({
      vehicle_number: 'vehicle-dashboard/getVehicleNumber'
    })
  },
  layout: 'vehicle-dashboard',
  head () {
    const title = `${this.vehicle_number} - ${this.$t('transports_and_storage')}`
    return {
      title,
      meta: [
        { hid: 'og:description', property: 'og:description', content: title }
      ]
    }
  }
}
</script>
