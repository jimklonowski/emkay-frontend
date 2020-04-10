<template>
  <client-only>
    <donut-chart
      :data="chartData"
      :chart-data="chartData"
      :options="chartOptions"
      :styles="chartStyles"
    />
  </client-only>
</template>

<script>
import { mapGetters } from 'vuex'
import { computeTotalByKey } from '@/utility/helpers'
import { interpolateColors } from '@/utility/color-generator'

export default {
  computed: {
    /**
     * Vuex Getters
     */
    ...mapGetters({
      fuel_history: 'vehicle-dashboard/getFuelHistory'
    }),
    /**
     * Chartjs data.  Needs data, labels, and colors
     */
    chartData () {
      const data = []

      const labels = this.fuel_history
        .map(x => x.fuel_company_name)
        .filter((item, index, array) => array.indexOf(item) === index)
        .sort()

      labels.forEach(label => {
        const filteredData = this.fuel_history.filter(x => x.fuel_company_name === label)
        data.push(computeTotalByKey(filteredData, 'amount'))
      })

      const backgroundColor = interpolateColors(labels.length)

      return {
        datasets: [{ backgroundColor, borderWidth: 1, data }],
        labels
      }
    },
    /**
     * Chartjs options
     */
    chartOptions () {
      return {
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
              return `${data.labels[tooltipItem.index]}: ${this.$options.filters.currency(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index])}`
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
          text: this.$i18n.t('fuel_companies')
        }
      }
    },
    /**
     * Chartjs styles
     */
    chartStyles () {
      return {
        height: '256px',
        position: 'relative'
      }
    }
  }
}
</script>
