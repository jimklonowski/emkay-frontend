<template>
  <order-status-widget />
</template>

<script>
import { mapGetters } from 'vuex'
import OrderStatusWidget from '@/components/vehicle-dashboard/widgets/OrderStatusWidget'
export default {
  name: 'VehicleOrderStatus',
  components: { OrderStatusWidget },
  computed: {
    ...mapGetters({
      vehicle_number: 'vehicle-dashboard/getVehicleNumber'
    })
  },
  layout: 'vehicle-dashboard',
  head () {
    const title = `${this.vehicle_number} - ${this.$t('order_status')}`
    return {
      title,
      meta: [
        { hid: 'og:description', property: 'og:description', content: title }
      ]
    }
  }
}
</script>
