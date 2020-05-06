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
        <evoucher />
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import MaintenanceHistoryTable from '@/components/vehicle-dashboard/datatables/MaintenanceHistoryTable'
import ChartLoading from '@/components/charts/ChartLoading'
export default {
  name: 'VehicleMaintenance',
  layout: 'vehicle-dashboard',
  components: {
    MaintenanceHistoryTable,
    evoucher: () => ({
      component: import(/* webpackChunkName: "Evoucher" */ '@/components/vehicle-dashboard/panels/Evoucher.vue'),
      loading: ChartLoading,
      delay: 0
    }),
    'maintenance-category-pie-chart': () => ({
      component: import(/* webpackChunkName: "MaintenanceCategoryPieChart" */'@/components/vehicle-dashboard/charts/MaintenanceCategoryPieChart.vue'),
      loading: ChartLoading,
      delay: 0
    })
  },
  /**
   * When navigating to the maintenance page, if #hash in url, preselect tab.
   * Note: Using asyncdata because mounted causes chartjs rendering issues when selecting non-chart tab
   */
  asyncData ({ app, route }) {
    switch (route.hash.substr(1)) {
      case 'evoucher': return { tab: 1 }
      case 'history':
      default: return { tab: 0 }
    }
  },
  computed: {
    /**
     * Vuex Getters
     */
    ...mapGetters({
      vehicle_number: 'vehicle-dashboard/getVehicleNumber'
    })
  },
  /**
   * Clear the query and hash on mounted
   */
  mounted () {
    if (this.$route.hash.length > 0 || Object.keys(this.$route.query).length > 0) {
      this.$router.replace({ query: undefined, hash: undefined })
    }
  },
  /**
   * Page meta
   */
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
