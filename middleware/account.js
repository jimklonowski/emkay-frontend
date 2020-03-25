export default async ({ store }) => {
  if (!store.getters['account/isInitialized']) {
    await store.dispatch('account/init')
  }
}
