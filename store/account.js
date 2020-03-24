import { assign, set, toggle } from '@/helpers/vuex'

const getDefaultState = () => ({
  sidebar: false
})

export const state = () => getDefaultState()

export const actions = {
  async logout () {
    await this.$auth.logout()
  },
  reset: ({ commit }) => commit('reset'),
  setSidebar: ({ commit }, payload) => commit('setSidebar', payload),
  toggleSidebar: ({ commit }) => commit('toggleSidebar')
}

export const mutations = {
  reset: assign(getDefaultState()),
  setSidebar: set('sidebar'),
  toggleSidebar: toggle('sidebar')
}

export const getters = {
  getSidebar: state => state.sidebar
}
