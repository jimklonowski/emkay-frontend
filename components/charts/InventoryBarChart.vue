<template>
  <client-only>
    <bar-chart
      :data="chartData"
      :chart-data="chartData"
      :options="chartOptions"
      :styles="chartStyles"
    />
  </client-only>
</template>

<script>
import { interpolateColors } from '@/utility/color-generator'
export default {
  props: {
    items: {
      type: Array,
      required: true
    },
    field: {
      type: String,
      required: true
    }
  },
  computed: {
    /**
     * Chartjs data.  Needs data, labels, and colors
     */
    chartData () {
      const data = []

      const labels = this.items
        .map(x => { return x[this.field] })
        .filter((item, index, array) => array.indexOf(item) === index)
        .sort()

      labels.forEach(label => {
        const count = this.items.filter(x => x[this.field] === label).length
        data.push(count)
      })

      const backgroundColor = interpolateColors(labels.length)

      return {
        datasets: [{ backgroundColor, data }],
        labels
      }
    },
    /**
     * Chartjs options
     */
    chartOptions () {
      return {
        legend: false,
        maintainAspectRatio: false,
        responsive: true,
        title: {
          text: this.$i18n.t(this.field),
          display: true,
          fontFamily: 'Lato, sans-serif',
          fontSize: 16,
          fontStyle: 'normal'
        },
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: this.$i18n.t('vehicles')
            },
            ticks: {
              beginAtZero: true,
              precision: 0
            }
          }]
        }
      }
    },
    /**
     * Chartjs styles
     */
    chartStyles () {
      return {
        height: '300px',
        position: 'relative'
      }
    }
  }
}
</script>
