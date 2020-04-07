<template>
  <client-only>
    <donut-chart
      :data="chartData"
      :chart-data="chartData"
      :options="{
        legend: {
          align: 'center',
          display: true,
          position: 'bottom',
          labels: {
            fontFamily: 'Roboto Condensed, sans-serif',
            fontSize: 14
          }
        },
        tooltips: {
          callbacks: {
            label: (tooltipItem, data) => {
              return `${data.labels[tooltipItem.index]}: ${$options.filters.currency(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index])}`
            }
          }
        },
        maintainAspectRatio: false,
        responsive: true,
        title: {
          display: true,
          fontFamily: 'Lato, sans-serif',
          fontSize: 16,
          fontStyle: 'normal',
          text: $t('fuel_companies')
        }
      }"
      :styles="{
        height: '256px',
        position: 'relative'
      }"
    />
  </client-only>
</template>

<script>
import { mapGetters } from 'vuex'
import { computeTotalByKey } from '@/utility/helpers'

export default {
  computed: {
    /**
     * Vuex Getters
     */
    ...mapGetters({
      fuel_history: 'vehicle-dashboard/getFuelHistory'
    }),
    chartData () {
      const data = []
      const backgroundColor = ['#4F286C', '#752870', '#99286E', '#B92D67', '#D33B5B', '#E6504B', '#F26B38', '#F68820']

      const labels = this.fuel_history.map(x => x.fuel_company_name).filter((value, index, self) => self.indexOf(value) === index)
      labels.forEach(label => {
        const filteredData = this.fuel_history.filter(x => x.fuel_company_name === label)
        data.push(computeTotalByKey(filteredData, 'amount'))
      })
      // return chart data
      return {
        datasets: [{ backgroundColor, borderWidth: 1, data }],
        labels
      }
    }
  }
}
</script>
