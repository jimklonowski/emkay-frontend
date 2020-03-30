<template>
  <sale-info-widget />
</template>

<script>
import { mapGetters } from 'vuex'
import SaleInfoWidget from '@/components/vehicle-dashboard/widgets/SaleInfoWidget'
export default {
  name: 'VehicleSaleInfo',
  components: { SaleInfoWidget },
  computed: {
    ...mapGetters({
      vehicle_number: 'vehicle-dashboard/getVehicleNumber'
    })
  },
  layout: 'vehicle-dashboard',
  head () {
    const title = `${this.vehicle_number} - ${this.$t('sale_info')}`
    return {
      title,
      meta: [
        { hid: 'og:description', property: 'og:description', content: title }
      ]
    }
  }
}
</script>
