<template>
  <client-only>
    <pie-chart
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
          text: $t('maintenance_by_category')
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
    ...mapGetters({
      maintenance_history: 'vehicle-dashboard/getMaintenanceHistory'
    }),
    chartData () {
      const data = []
      const backgroundColor = ['#4F286C', '#752870', '#99286E', '#B92D67', '#D33B5B', '#E6504B', '#F26B38', '#F68820']
      // extract an array of maintenance categories from vuex:vehicle maintenanceHistory (filter removes duplicates)
      const labels = this.maintenance_history
        .map(x => { return x.maintenance_category })
        .filter((item, index, array) => { return array.indexOf(item) === index })

      // compute total of the 'amount' of each category and push to data array
      labels.forEach(label => {
        const filteredData = this.maintenance_history.filter(x => x.maintenance_category === label)
        data.push(computeTotalByKey(filteredData, 'amount'))
      })

      // return the chart data
      return {
        datasets: [{
          backgroundColor,
          borderWidth: 1,
          data
        }],
        labels
      }
    }
  }
}
</script>
