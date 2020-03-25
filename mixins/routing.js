/**
 * Get localized route to vehicle dashboard using current vehicle param
 */
export const vehicleRoute = {
  computed: {
    vehicleRoute: vm => vm.localePath({ path: `/vehicle/${vm.$route.params.vehicle}` })
  }
}
