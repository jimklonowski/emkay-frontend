/* eslint-disable vue/require-prop-types */
import Vue from 'vue'
import 'chartjs-chart-geo'
import { Bar, Doughnut, Line, Pie, mixins, generateChart } from 'vue-chartjs'
const { reactiveProp } = mixins

const BubbleMap = generateChart('bubbleMap', 'bubbleMap')
const Choropleth = generateChart('choropleth', 'choropleth')

Vue.component('bubble-map', {
  extends: BubbleMap,
  mixins: [reactiveProp],
  props: ['options'],
  watch: {
    options () {
      this.$data._chart.options = this.options
      this.$data._chart.update()
    }
  },
  mounted () {
    this.renderChart(this.chartData, this.options)
  }
})

Vue.component('map-geo', {
  extends: Choropleth,
  mixins: [reactiveProp],
  props: ['options'],
  watch: {
    options () {
      this.$data._chart.options = this.options
      this.$data._chart.update()
    }
  },
  mounted () {
    this.renderChart(this.chartData, this.options)
  }
})

Vue.component('bar-chart', {
  extends: Bar,
  mixins: [reactiveProp],
  props: ['data', 'options'],
  watch: {
    options () {
      this.$data._chart.options = this.options
      this.$data._chart.update()
    }
  },
  mounted () {
    this.renderChart(this.data, this.options)
  }
})

Vue.component('donut-chart', {
  extends: Doughnut,
  mixins: [reactiveProp],
  props: ['data', 'options'],
  watch: {
    options () {
      this.$data._chart.options = this.options
      this.$data._chart.update()
    }
  },
  mounted () {
    this.renderChart(this.data, this.options)
  }
})

Vue.component('line-chart', {
  extends: Line,
  mixins: [reactiveProp],
  props: ['data', 'options'],
  watch: {
    options () {
      this.$data._chart.options = this.options
      this.$data._chart.update()
    }
  },
  mounted () {
    this.renderChart(this.data, this.options)
  }
})

Vue.component('pie-chart', {
  extends: Pie,
  mixins: [reactiveProp],
  props: ['data', 'options'],
  watch: {
    options () {
      this.$data._chart.options = this.options
      this.$data._chart.update()
    }
  },
  mounted () {
    this.renderChart(this.data, this.options)
  }
})
