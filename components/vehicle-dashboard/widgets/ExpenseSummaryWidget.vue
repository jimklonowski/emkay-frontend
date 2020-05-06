<template>
  <base-widget
    :title="title"
    :icon="icon"
    :actions="actions"
  >
    <template #main>
      <v-container>
        <v-row dense no-gutters>
          <v-col cols="12" lg="4">
            <expense-summary-fixed-costs />
          </v-col>
          <v-col cols="12" lg="4">
            <expense-summary-pie-chart />
          </v-col>
          <v-col cols="12" lg="4">
            <expense-summary-variable-costs />
          </v-col>
        </v-row>
      </v-container>
    </template>
  </base-widget>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import BaseWidget from '@/components/vehicle-dashboard/widgets/BaseWidget'
import ChartLoading from '@/components/charts/ChartLoading'
export default {
  components: {
    BaseWidget,
    'expense-summary-fixed-costs': () => ({
      component: import(/* webpackChunkName: "ExpenseSummaryFixedCosts" */ '@/components/vehicle-dashboard/panels/ExpenseSummaryFixedCosts.vue'),
      loading: ChartLoading,
      delay: 0
    }),
    'expense-summary-variable-costs': () => ({
      component: import(/* webpackChunkName: "ExpenseSummaryVariableCosts" */ '@/components/vehicle-dashboard/panels/ExpenseSummaryVariableCosts.vue'),
      loading: ChartLoading,
      delay: 0
    }),
    'expense-summary-pie-chart': () => ({
      component: import(/* webpackChunkName: "ExpenseSummaryPieChart" */ '@/components/vehicle-dashboard/charts/ExpenseSummaryPieChart.vue'),
      loading: ChartLoading,
      delay: 0
    })
  },
  async fetch () {
    await this.fetchExpenseSummary(this.query)
  },
  data: vm => ({
    icon: 'mdi-cash-usd',
    mode: 'total',
    title: vm.$i18n.t('expense_summary')
  }),
  computed: {
    /**
     * Vuex Getters
     */
    ...mapGetters({
      vehicle_number: 'vehicle-dashboard/getVehicleNumber'
    }),
    /**
     * Dropdown menu actions
     */
    actions () {
      return [
        {
          text: this.$i18n.t('report_expenses'),
          icon: this.icon,
          to: this.localePath({ path: '/vehicle/dashboard/report-expenses' })
        }
      ]
    },
    /**
     * Query Parameters
     */
    query () {
      return {
        vehicle: this.vehicle_number
      }
    }
  },
  methods: {
    /**
     * Vuex Actions
     */
    ...mapActions({
      fetchExpenseSummary: 'vehicle-dashboard/fetchExpenseSummary'
    })
  }
}
</script>
