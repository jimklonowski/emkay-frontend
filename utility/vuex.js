/**
 * Set property on state
 * @vuex setUser: set('user')
 * @example commit('setUser', { name: 'foo' })
 */
export const set = key => (state, val) => { state[key] = val }

/**
 * Toggle boolean in state
 * @vuex toggleOpen: toggle('open')
 * @example commit('toggleOpen')
 */
export const toggle = key => (state) => { state[key] = !state[key] }

/**
 * copy all key/values from data to state
 * useful for resetting state to default values
 * @vuex resetState: assignConstant(initialState)
 * @example commit('resetState')
 */
export const assign = data => state => Object.assign(state, data)

/**
 * Push an item onto a list
 * @vuex addItem: push('items')
 */
export const push = key => (state, val) => state[key].push(val)
