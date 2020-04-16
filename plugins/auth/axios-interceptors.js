export default function ({ $axios, store }) {
  $axios.interceptors.response.use(res => res, async (error) => {
    const status = error.response ? error.response.status : null
    if (status === 401 || status === 403) {
      // TODO: handle refreshing session here with refresh token?
      // if cannot get a new session, logout
      await store.dispatch('account/logout')
      return error
    }
    // handle other status codes normally
    return Promise.reject(error)
  })
}
