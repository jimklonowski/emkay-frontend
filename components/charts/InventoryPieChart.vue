<template>
  <client-only>
    <pie-chart
      :data="chartData"
      :chart-data="chartData"
      :options="chartOptions"
      :style="chartStyles"
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
     * Chartjs data. Needs data, labels, and colors
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
            boxWidth: 16,
            fontFamily: 'Roboto Condensed, sans-serif',
            fontSize: 13
          }
        },
        maintainAspectRatio: false,
        responsive: true,
        title: {
          display: true,
          fontFamily: 'Lato, sans-serif',
          fontSize: 16,
          fontStyle: 'normal',
          text: this.$i18n.t(this.field)
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
