/**
 * This is the root vuex store.
 */

export const state = () => ({})

export const actions = {
  async nuxtServerInit ({ commit, dispatch }, { app, params, redirect, req, res, route }) {
    if (process.server) {
      app.$auth.fetchUser()
      if (app.$auth.loggedIn) {
        // initialize account store
        await dispatch('account/init')
      } else {
        await dispatch('account/logout')
        redirect(app.localePath({ path: '/login' }))
      }
    }
  }
}
