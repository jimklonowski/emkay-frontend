<template>
  <client-only>
    <pie-chart
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
    ...mapGetters({
      fuel_history: 'vehicle-dashboard/getFuelHistory'
    }),
    /**
     * Chartjs data. Needs data, labels, colors
     */
    chartData () {
      const data = []

      // extract an array of fuel expense types from vuex:vehicle fuelHistory (filter removes duplicates)
      const labels = this.fuel_history
        .map(x => {
          switch (x.product_type) {
            case 'F': return `${this.$i18n.t('fuel')}: ${x.product}`
            case 'O': return `${this.$i18n.t('other')}: ${x.product}`
            default: return `${this.$i18n.t('misc')}`
          }
        })
        .filter((value, index, array) => array.indexOf(value) === index)
        .sort()

      // compute total of the 'amount' of each category and push to data array
      labels.forEach(label => {
        const filteredData = this.fuel_history.filter(x => label.startsWith(x.product_type) && label.endsWith(x.product))
        data.push(computeTotalByKey(filteredData, 'amount'))
      })

      const backgroundColor = interpolateColors(labels.length)

      // return the chart data
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
          text: this.$i18n.t('fuel_expenses')
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
