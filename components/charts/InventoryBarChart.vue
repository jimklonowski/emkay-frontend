<template>
  <client-only>
    <bar-chart
      :data="chartData"
      :chart-data="chartData"
      :options="options"
      :styles="styles"
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
    options () {
      return {
        legend: false,
        maintainAspectRatio: false,
        responsive: true,
        title: {
          text: this.$i18n.t(this.field),
          display: true
        },
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: this.$i18n.t('vehicles')
            },
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    },
    styles () {
      return {
        height: '256px',
        position: 'relative'
      }
    },
    chartData () {
      const data = []
      // const backgroundColor = ['#4F286C', '#752870', '#99286E', '#B92D67', '#D33B5B', '#E6504B', '#F26B38', '#F68820']
      const labels = this.items
        .map(x => { return x[this.field] })
        .filter((item, index, array) => { return array.indexOf(item) === index })
        .sort()
      const backgroundColor = interpolateColors(labels.length)
      labels.forEach(label => {
        const count = this.items.filter(x => x[this.field] === label).length
        data.push(count)
      })
      return {
        datasets: [{
          backgroundColor,
          data
        }],
        labels
      }
    }
  }
}
</script>
