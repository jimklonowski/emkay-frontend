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
      <v-tab-item>
        <fuel-expenses-pie-chart />
        <v-divider />
        <fuel-history-table />
      </v-tab-item>
      <v-tab-item>
        <fuel-cards-table />
      </v-tab-item>
      <v-tab-item>
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
    // If #hash in url, parse and pre-select associated tab
    if (this.$route.hash) {
      const hash = Number(this.$route.hash.substr(1)) || 0
      this.tab = hash
      this.$router.replace({ hash: undefined })
    }
  },
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
