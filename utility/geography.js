import state_abbreviations from '@/assets/json/state_abbreviations'
import province_abbreviations from '@/assets/json/province_abbreviations'

// convert single object to array of { abbreviation, name }
export const states = Object.entries(state_abbreviations).map(([abbreviation, name]) => ({ abbreviation, name }))
export const provinces = Object.entries(province_abbreviations).map(([abbreviation, name]) => ({ abbreviation, name }))

// join both arrays so we can use array.find() to lookup abbreviation/name from a single source
const lookup = [...states, ...provinces]

/**
 * Given a state/province abbreviation, returns the state/province name
 * @param {*} abbreviation state or province abbreviation
 */
export function stateAbbreviationToName (abbreviation) {
  const result = lookup.find(x => x.abbreviation.toUpperCase() === abbreviation.toUpperCase())
  return result.name
}

/**
 * Given a state/province name, returns the state/province abbreviation
 * @param {*} name state or province name
 */
export function stateNameToAbbreviation (name) {
  const result = lookup.find(x => x.name.toUpperCase() === name.toUpperCase())
  return result.abbreviation
}

export function cityStateZip (city, state, zip) {
  const city_state = [city, state].filter(Boolean).join(', ')
  return [city_state, zip].filter(Boolean).join(' ')
}
