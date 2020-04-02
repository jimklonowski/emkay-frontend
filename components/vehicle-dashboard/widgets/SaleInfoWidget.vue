<template>
  <base-widget
    :title="title"
    :icon="icon"
    :actions="actions"
  >
    <template #main>
      <v-card-text v-if="hasSaleInfo">
        {{ sale_info }}
      </v-card-text>
      <v-card-text v-else>
        No sale info found.
      </v-card-text>
    </template>
  </base-widget>
</template>

<script>
import { mapGetters } from 'vuex'
import BaseWidget from '@/components/vehicle-dashboard/widgets/BaseWidget'
export default {
  components: {
    BaseWidget
  },
  data: vm => ({
    icon: 'mdi-cash-register',
    title: vm.$i18n.t('sale_info')
  }),
  computed: {
    ...mapGetters({
      hasSaleInfo: 'vehicle-dashboard/hasSaleInfo',
      sale_info: 'vehicle-dashboard/getSaleInfo',
      vehicle_number: 'vehicle-dashboard/getVehicleNumber'
    }),
    actions () {
      return [
        {
          text: this.$i18n.t('sale_info'),
          icon: this.icon,
          to: this.localePath({ path: '/vehicle/dashboard/sale-info' })
        }
      ]
    }
  }
}
</script>
