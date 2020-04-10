<template>
  <client-only>
    <map-geo
      :chart-data="chartData"
      :options="chartOptions"
      :styles="chartStyles"
    />
  </client-only>
</template>

<script>
// const countries = require('world-atlas/countries-10m.json')
import { topojson } from 'chartjs-chart-geo'
import statesJson from 'us-atlas/states-10m.json'
import { interpolateSingleColor } from '@/utility/color-generator'
import states_abbreviations from '@/assets/json/states'
const states = topojson.feature(statesJson, statesJson.objects.states).features
export default {
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  computed: {
    /**
     * Chartjs data
     */
    chartData () {
      const vehicleCounts = []
      // const totalVehicles = this.items.length
      states.forEach(state => {
        const count = this.items.filter(x => states_abbreviations[x.driver_state_province] === state.properties.name).length
        vehicleCounts.push(count)
      })

      const labels = states.map(d => d.properties.name)
      const data = states.map((d, i) => {
        // debugger
        return { feature: d, value: vehicleCounts[i] }
      })
      return {
        labels,
        datasets: [
          {
            backgroundColor: context => {
              if (context.dataIndex == null) { return null }
              const value = context.dataset.data[context.dataIndex].value
              const max = Math.max(...vehicleCounts)
              // const weight = (value.value / totalVehicles)

              // debugger
              // return `rgba(81, 45, 168, ${weight})`
              return interpolateSingleColor(value, max)
            },
            data
          }
        ]
      }
    },
    /**
     * Chartjs options
     */
    chartOptions () {
      return {
        legend: {
          display: false
        },
        maintainAspectRatio: false,
        responsive: true,
        scale: {
          projection: 'albersUsa'
        },
        showOutline: true,
        showGraticule: true,
        tooltips: {
          callbacks: {
            label: (tooltipItem, data) => {
              return `${data.labels[tooltipItem.index]}: ${data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].value}`
            }
          }
        }
      }
    },
    /**
     * Chartjs styles
     */
    chartStyles () {
      return {
        height: '500px',
        position: 'relative'
      }
    }
  }
}
</script>
