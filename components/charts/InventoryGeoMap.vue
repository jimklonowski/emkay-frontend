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
import { topojson } from 'chartjs-chart-geo'
import statesJson from 'us-atlas/states-10m.json'
import { interpolateSingleColor } from '@/utility/color-generator'
import state_abbreviations from '@/assets/json/state_abbreviations'
import { features as provinces } from '@/assets/json/provinces'
import province_abbreviations from '@/assets/json/province_abbreviations'
const states = topojson.feature(statesJson, statesJson.objects.states).features
// const provinces = topojson.feature(provincesJson, provincesJson.objects.provinces).features
/* eslint-disable no-prototype-builtins */
export default {
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  computed: {
    // usaCustomer: () => false,
    usaCustomer () {
      for (let i = 0; i < this.items.length; i++) {
        const state_or_province = this.items[i].driver_state_province
        if (state_abbreviations.hasOwnProperty(state_or_province)) {
          return true
        } else if (province_abbreviations.hasOwnProperty(state_or_province)) {
          return false
        } else {
          console.log(`Unknown State/Province: ${state_or_province}`)
        }
      }
      return true
    },
    /**
     * Chartjs data
     */
    chartData () {
      let abbreviations, locations
      const vehicleCounts = []
      // usa or canada check?
      if (this.usaCustomer) {
        abbreviations = state_abbreviations
        locations = states
      } else {
        abbreviations = province_abbreviations
        locations = provinces
      }

      locations.forEach(location => {
        const count = this.items.filter(vehicle => abbreviations[vehicle.driver_state_province] === location.properties.name).length
        vehicleCounts.push(count)
      })
      const labels = locations.map(location => location.properties.name)
      const data = locations.map((location, i) => {
        return { feature: location, value: vehicleCounts[i] }
      })

      return {
        labels,
        datasets: [
          {
            backgroundColor: context => {
              if (context.dataIndex == null) { return null }
              const value = context.dataset.data[context.dataIndex].value
              if (value === 0) { return '#FFFFFF' }
              // calculate the maximum count across each state, use as max parameter in color function
              const max = Math.max(...vehicleCounts)
              return interpolateSingleColor(value, max)
            },
            outline: this.usaCustomer ? states : provinces,
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
        plugins: {
          datalabels: {
            backgroundColor: '#ffffff',
            borderRadius: 8,
            padding: 3,
            display: context => (context.dataset.data[context.dataIndex].value > 0) ? 'auto' : false,
            font: {
              family: 'Roboto Condensed, sans-serif',
              size: 12
            },
            formatter: value => {
              return value.value
            },
            textAlign: 'center'
          }
        },
        responsive: true,
        scale: {
          projection: this.usaCustomer ? 'albersUsa' : 'albers'
        },
        showOutline: true,
        showGraticule: false,
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
