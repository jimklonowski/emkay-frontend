<template>
  <v-card flat>
    <v-card-actions class="justify-center">
      <v-btn-toggle
        v-model="mode"
        background-color="transparent"
        color="primary"
        mandatory
        rounded
        dense
      >
        <v-btn value="fixed" small text v-text="$t('fixed')" />
        <v-btn value="total" small text v-text="$t('total')" />
        <v-btn value="variable" small text v-text="$t('variable')" />
      </v-btn-toggle>
    </v-card-actions>
    <v-card-text>
      <client-only>
        <pie-chart
          :data="chartData"
          :chart-data="chartData"
          :options="chartOptions"
          :styles="chartStyles"
        />
      </client-only>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { interpolateColors } from '@/utility/color-generator'
export default {
  data: () => ({
    mode: 'total'
  }),
  computed: {
    /**
     * Vuex Getters
     */
    ...mapGetters({
      expense_summary: 'vehicle-dashboard/getExpenseSummary',
      total_costs: 'vehicle-dashboard/getTotalCosts',
      total_cpm: 'vehicle-dashboard/getTotalCPM',
      total_fixed: 'vehicle-dashboard/getTotalFixed',
      total_fixed_cpm: 'vehicle-dashboard/getTotalFixedCPM',
      total_variable: 'vehicle-dashboard/getTotalVariable',
      total_variable_cpm: 'vehicle-dashboard/getTotalVariableCPM',
      vehicle_number: 'vehicle-dashboard/getVehicleNumber'
    }),
    /**
     * ChartJS data for three different pie charts
     * Fixed Costs Pie Chart
     * Variable Costs Pie Chart
     * Fixed vs Variable Costs Pie Chart
     */
    chartData () {
      let data = []
      let labels = []

      switch (this.mode) {
        case 'fixed':
          data = [this.expense_summary.depreciation, this.expense_summary.interest, this.expense_summary.licensing, this.expense_summary.tax]
          labels = [this.$i18n.t('depreciation'), this.$i18n.t('interest'), this.$i18n.t('licensing'), this.$i18n.t('tax')]
          break
        case 'variable':
          data = [this.expense_summary.accident, this.expense_summary.fuel, this.expense_summary.maintenance]
          labels = [this.$i18n.t('accident'), this.$i18n.t('fuel'), this.$i18n.t('maintenance')]
          break
        default:
          data = [this.total_fixed, this.total_variable]
          labels = [this.$i18n.t('total_fixed'), this.$i18n.t('total_variable')]
          break
      }

      const backgroundColor = interpolateColors(labels.length)

      return {
        datasets: [{ backgroundColor, borderWidth: 1, data }],
        labels
      }
    },
    chartOptions () {
      return {
        legend: {
          align: 'center',
          display: true,
          position: 'bottom',
          labels: {
            boxWidth: 16,
            fontFamily: 'Roboto Condensed, sans-serif',
            fontSize: 13
          }
        },
        tooltips: {
          callbacks: {
            label: (tooltipItem, data) => `${data.labels[tooltipItem.index]}: ${this.$options.filters.currency(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index])}`
          }
        },
        maintainAspectRatio: false,
        responsive: true
      }
    },
    chartStyles () {
      return {
        height: '256px',
        position: 'relative'
      }
    }
  }
}
</script>
