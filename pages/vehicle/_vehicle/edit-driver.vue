<template>
  <driver-details-form :driver-id="driver_number">
    <template #title>
      {{ $t('edit_driver') }}
    </template>
  </driver-details-form>
</template>

<script>
import { mapGetters } from 'vuex'
import DriverDetailsForm from '@/components/driver/forms/DriverDetailsForm'
export default {
  components: {
    DriverDetailsForm
  },
  computed: {
    ...mapGetters({
      driver_number: 'vehicle-dashboard/getDriverNumber'
    })
  },
  layout: 'vehicle-dashboard',
  head () {
    const title = this.$i18n.t('edit_driver')
    return {
      title,
      meta: [
        { hid: 'og:description', property: 'og:description', content: title }
      ]
    }
  }
}
</script>
