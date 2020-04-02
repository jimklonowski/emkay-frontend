export default async ({ app, params, redirect, store }) => {
  const vehicle = app.$cookies.get('vehicle_number')
  if (vehicle) {
    console.log(`[vehicle middleware]: vehicle #${vehicle} found in cookie, calling init`)
    await store.dispatch('vehicle-dashboard/init', { vehicle })
  } else {
    console.log('[vehicle middleware]: no vehicle# in vuex or cookie, redirecting to search')
    redirect(app.localePath({ path: '/vehicle' }))
  }
}
