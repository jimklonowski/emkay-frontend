/**
 * This middleware runs on account pages.
 * If account store is not initialized, calls account/init
 */
export default async ({ store }) => {
  if (!store.getters['account/isInitialized']) {
    await store.dispatch('account/init')
  }
}
