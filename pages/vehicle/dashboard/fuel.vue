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
          {{ $t('fuel_history') }}
          <v-icon v-text="'mdi-gas-station'" />
        </v-tab>
        <v-tab>
          {{ $t('fuel_cards') }}
          <v-icon v-text="'mdi-credit-card'" />
        </v-tab>
        <v-tab>
          {{ $t('fuel_authorization_profiles') }}
          <v-icon v-text="'mdi-clipboard-account'" />
        </v-tab>
      </v-tabs>
    </v-toolbar>
    <v-divider />
    <v-tabs-items v-model="tab">
      <v-tab-item eager>
        <v-container>
          <v-row>
            <v-col cols="12" md="6">
              <fuel-expenses-pie-chart />
            </v-col>
            <v-col cols="12" md="6">
              <fuel-company-donut-chart />
            </v-col>
          </v-row>
          <v-divider />
          <v-row>
            <v-col cols="12">
              <fuel-history-table />
            </v-col>
          </v-row>
        </v-container>
      </v-tab-item>
      <v-tab-item eager>
        <fuel-cards-table />
      </v-tab-item>
      <v-tab-item eager>
        <fuel-authorization-profile-table />
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import FuelAuthorizationProfileTable from '@/components/vehicle-dashboard/datatables/FuelAuthorizationProfileTable'
import FuelCardsTable from '@/components/vehicle-dashboard/datatables/FuelCardsTable'
import FuelHistoryTable from '@/components/vehicle-dashboard/datatables/FuelHistoryTable'
import ChartLoading from '@/components/vehicle-dashboard/charts/ChartLoading'

export default {
  name: 'VehicleFuel',
  layout: 'vehicle-dashboard',
  components: {
    FuelAuthorizationProfileTable,
    FuelCardsTable,
    FuelHistoryTable,
    'fuel-expenses-pie-chart': () => ({
      component: import(/* webpackChunkName: "FuelExpensesPieChart" */'@/components/vehicle-dashboard/charts/FuelExpensesPieChart.vue'),
      loading: ChartLoading,
      delay: 0
    }),
    'fuel-company-donut-chart': () => ({
      component: import(/* webpackChunkName: "FuelCompanyDonutChart" */'@/components/vehicle-dashboard/charts/FuelCompanyDonutChart.vue'),
      loading: ChartLoading,
      delay: 0
    })
  },
  /**
   * When navigating to the fuel page, if #hash in url, preselect tab.
   * Note: Using asyncdata because mounted causes chartjs rendering issues when selecting non-chart tab
   */
  asyncData ({ app, route }) {
    switch (route.hash.substr(1)) {
      case 'cards': return { tab: 1 }
      case 'profiles': return { tab: 2 }
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
    if (Object.keys(this.$route.query).length > 0 || this.$route.hash.length > 0) {
      this.$router.replace({ query: undefined, hash: undefined })
    }
  },
  /**
   * Page meta
   */
  head () {
    return {
      title: `${this.vehicle_number} - ${this.$i18n.t('fuel')}`,
      meta: [
        { hid: 'og:description', property: 'og:description', content: this.title }
      ]
    }
  }
}
</script>
