import Vue from 'vue'
import { formatCurrency } from '@/utility/helpers'

export default ({ app }) => {
  Vue.filter('currency', formatCurrency)

  Vue.filter('percent', (value = 0, decimals = 0) => {
    value = value * 100
    value = Math.round(value * 10 ** decimals) / 10 ** decimals
    value = `${value} %`
    return value
  })

  Vue.filter('date', (value, inFormat = 'YYYY-MM-DD', outFormat = 'L') => {
    if (value) {
      return app.$moment(value, inFormat).format(outFormat)
    }
  })

  Vue.filter('datetime', (value, outFormat = 'LLL') => {
    if (value) {
      return app.$moment(value).format(outFormat)
    }
  })

  Vue.filter('phone', (value) => {
    if (value) {
      return value
        .replace(/[^0-9]/g, '')
        .replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')
    }
  })

  Vue.filter('number', (value = 0, minDigits = 0, maxDigits = 2) => {
    const formatter = new Intl.NumberFormat('en-US', { minimumFractionDigits: minDigits, maximumFractionDigits: maxDigits })
    return formatter.format(value)
  })

  Vue.filter('capitalize', (value, options) => {
    const globalOptions = (this && this.capitalize) ? this.capitalize : {}
    options = options || globalOptions
    const onlyFirstLetter = options.onlyFirstLetter != null ? options.onlyFirstLetter : false
    if (!value && value !== 0) { return '' }
    if (onlyFirstLetter === true) {
      return value.toString().charAt(0).toUpperCase() + value.toString().slice(1)
    } else {
      value = value.toString().toLowerCase().split(' ')
      return value.map(function (item) {
        return item.charAt(0).toUpperCase() + item.slice(1)
      }).join(' ')
    }
  })

  Vue.filter('lowercase', value => {
    return (value || value === 0)
      ? value.toString().toLowerCase()
      : ''
  })

  Vue.filter('uppercase', value => {
    return (value || value === 0)
      ? value.toString().toUpperCase()
      : ''
  })
}
