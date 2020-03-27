<template>
  <v-card outlined tile>
    <v-toolbar height="72" tile flat color="transparent">
      <v-tabs
        centered
        grow
        icons-and-text
        optional
        show-arrows
      >
        <v-tab :to="fuelRoute" exact>
          {{ $t('fuel_history') }}
          <v-icon v-text="'mdi-gas-station'" />
        </v-tab>
        <v-tab :to="fuelCardRoute" exact nuxt>
          {{ $t('fuel_cards') }}
          <v-icon v-text="'mdi-credit-card'" />
        </v-tab>
        <v-tab :to="fuelProfilesRoute" exact nuxt>
          {{ $t('fuel_authorization_profiles') }}
          <v-icon v-text="'mdi-clipboard-account'" />
        </v-tab>
      </v-tabs>
    </v-toolbar>
    <v-divider />
    <nuxt-child />
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'VehicleFuel',
  layout: 'vehicle-dashboard',
  computed: {
    ...mapGetters({
      vehicle_number: 'vehicle-dashboard/getVehicleNumber'
    }),
    fuelRoute: vm => vm.localePath({ path: `/vehicle/${vm.vehicle_number}/fuel` }),
    fuelCardRoute: vm => vm.localePath({ path: `/vehicle/${vm.vehicle_number}/fuel-cards` }),
    fuelProfilesRoute: vm => vm.localePath({ path: `/vehicle/${vm.vehicle_number}/fuel-profiles` })
  }
}
</script>
