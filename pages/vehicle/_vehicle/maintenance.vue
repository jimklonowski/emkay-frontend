<template>
  <v-card outlined tile>
    <v-toolbar height="72" tile flat color="transparent">
      <v-tabs
        v-model="tab"
        centered
        grow
        icons-and-text
        mandatory
        show-arrows
      >
        <v-tab>
          {{ $t('maintenance_history') }}
          <v-icon v-text="'mdi-tools'" />
        </v-tab>
        <v-tab>
          {{ $t('evoucher') }}
          <v-icon v-text="'mdi-ticket-confirmation'" />
        </v-tab>
      </v-tabs>
    </v-toolbar>
    <v-divider />
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <maintenance-category-pie-chart />
        <v-divider />
        <maintenance-history-table />
      </v-tab-item>
      <v-tab-item>
        evoucher
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import MaintenanceHistoryTable from '@/components/vehicle-dashboard/datatables/MaintenanceHistoryTable'
import ChartLoading from '@/components/vehicle-dashboard/charts/ChartLoading'
export default {
  name: 'VehicleMaintenance',
  layout: 'vehicle-dashboard',
  components: {
    MaintenanceHistoryTable,
    // Evoucher,
    'maintenance-category-pie-chart': () => ({
      component: import(/* webpackChunkName: "MaintenanceCategoryPieChart" */'@/components/vehicle-dashboard/charts/MaintenanceCategoryPieChart.vue'),
      loading: ChartLoading,
      delay: 0
    })
  },
  data: () => ({
    tab: 0
  }),
  computed: {
    ...mapGetters({
      vehicle_number: 'vehicle-dashboard/getVehicleNumber'
    })
  },
  mounted () {
    if (this.$route.hash) {
      const hash = Number(this.$route.hash.substr(1)) || 0
      this.tab = hash
      this.$router.replace({ hash: undefined })
    }
  },
  head () {
    return {
      title: `${this.vehicle_number} - ${this.$i18n.t('maintenance')}`,
      meta: [
        { hid: 'og:description', property: 'og:description', content: this.title }
      ]
    }
  }
}
</script>
