/**
 * This middleware runs on pages in the vehicle dashboard.
 * It handles page refreshes by checking for a vehicle_number in cookies. If found, call vehicle-dashboard/init to re-hydrate vuex vehicle-dashboard store.
 * Otherwise redirect to the vehicle search at /vehicle
 */
export default async ({ app, redirect, store }) => {
  const vehicle = app.$cookies.get('vehicle_number')
  if (vehicle) {
    // console.log(`[vehicle middleware]: vehicle #${vehicle} found in cookie, calling init`)
    // Populate vehicle store
    await store.dispatch('vehicle-dashboard/init', { vehicle })
  } else {
    // console.log('[vehicle middleware]: no vehicle# in vuex or cookie, redirecting to search')
    // Redirect to vehicle dashboard search
    redirect(app.localePath({ path: '/vehicle' }))
  }
}
