/**
 * Click-to-Dial a phone number
 */
export const dialTo = (number) => { window.location = `tel:${number}` }

/**
 * Click-to-Compose an email
 */
export const emailTo = (email) => { window.location = `mailto:${email}` }

/**
 * Flatten tree-like center hierarchy
 */
export const flatten = array => array.reduce((res, { center_code, center_name, children = [] }) => res.concat({ center_code, center_name }).concat(flatten(children)), [])

/**
 * Format Currency
 */
export const formatCurrency = (value, minDigits = 2, maxDigits = 2) => {
  const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: minDigits, maximumFractionDigits: maxDigits })
  return formatter.format(value)
}

/**
 * Use to add a delay in an async request (for debugging)
 * @param {*} m time in millis
 */
export const sleep = m => new Promise(resolve => setTimeout(resolve, m))

/**
 * Compute total by key for an array of objects
 * @param {*} items array of objects
 * @param {*} key key of object to sum
 */
export const computeTotalByKey = (items, key) => {
  const total = items.reduce((a, b) => {
    return {
      [key]: Number(a[key]) + Number(b[key])
    }
  }, { [key]: 0 })
  return total[key]
}
