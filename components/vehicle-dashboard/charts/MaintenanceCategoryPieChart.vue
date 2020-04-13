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
      maintenance_history: 'vehicle-dashboard/getMaintenanceHistory'
    }),
    /**
     * Chartjs data
     */
    chartData () {
      const data = []

      // extract an array of maintenance categories from vuex:vehicle maintenanceHistory (filter removes duplicates)
      const labels = this.maintenance_history
        .map(x => { return x.maintenance_category })
        .filter((item, index, array) => { return array.indexOf(item) === index })
        .sort()

      // compute total of the 'amount' of each category and push to data array
      labels.forEach(label => {
        const filteredData = this.maintenance_history.filter(x => x.maintenance_category === label)
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
          text: this.$i18n.t('maintenance_by_category')
        }
      }
    },
    /**
     * Chartjs Styles
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
