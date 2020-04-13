/**
 * This middleware runs on most auth pages.
 * If account store is not initialized, calls account/init to populate centers, labels, etc.
 */
export default async ({ app, store, $vuetify }) => {
  if (!store.getters['account/isInitialized']) {
    await store.dispatch('account/init')
  }
}
