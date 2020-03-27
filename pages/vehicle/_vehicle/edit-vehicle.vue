<template>
  <vehicle-details-form :vehicle-number="vehicle_number">
    <template #title>
      {{ $t('edit_vehicle') }}
    </template>
  </vehicle-details-form>
</template>

<script>
import { mapGetters } from 'vuex'
import VehicleDetailsForm from '@/components/vehicle-dashboard/forms/VehicleDetailsForm'
export default {
  components: {
    VehicleDetailsForm
  },
  computed: {
    ...mapGetters({
      vehicle_number: 'vehicle-dashboard/getVehicleNumber'
    })
  },
  layout: 'vehicle-dashboard',
  head () {
    const title = this.$i18n.t('edit_vehicle')
    return {
      title,
      meta: [
        { hid: 'og:description', property: 'og:description', content: title }
      ]
    }
  }
}
</script>
