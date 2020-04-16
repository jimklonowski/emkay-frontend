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
export const formatCurrency = (value = 0, minDigits = 2, maxDigits = 2) => {
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

/**
 * Multifilter
 * https://gist.github.com/jherax/f11d669ba286f21b7a2dcff69621eb72
 */
export const multiFilter = (item, condition) => {
  const filterKeys = Object.keys(condition)
  return item.filter((eachObj) => {
    return filterKeys.every(eachKey => {
      if (!condition[eachKey].length) {
        return true // passing an empty filter means that filter is ignored
      }
      // this works, but is not case insensitive
      // return Array.prototype.includes.call(condition[eachKey], eachObj[eachKey].toString().toLowerCase())
      const lowercaseArray = condition[eachKey].map(x => x.toString().toLowerCase())
      return Array.prototype.includes.call(lowercaseArray, eachObj[eachKey].toString().toLowerCase())
    })
  })
}

/**
 * Object key comparator function
 */
export const compareObjectByKey = (key, order = 'asc') => {
  return function innerSort (a, b) {
    // eslint-disable-next-line no-prototype-builtins
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      // property doesn't exist on either object
      return 0
    }
    const varA = (typeof a[key] === 'string') ? a[key].toUpperCase() : a[key]
    const varB = (typeof b[key] === 'string') ? b[key].toUpperCase() : b[key]
    let comparison = 0
    if (varA > varB) { comparison = 1 } else if (varA < varB) { comparison = -1 }
    return ((order === 'desc') ? (comparison * -1) : comparison)
  }
}
