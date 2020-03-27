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
        <v-tab :to="maintenanceRoute" exact>
          {{ $t('maintenance_history') }}
          <v-icon v-text="'mdi-tools'" />
        </v-tab>
        <!-- <v-tab>
          {{ $t('cpm') }}
          <v-icon v-text="'mdi-cash'" />
        </v-tab>
        <v-tab>
          {{ $t('cost_containment') }}
          <v-icon v-text="'mdi-cash-refund'" />
        </v-tab> -->
        <v-tab :to="evoucherRoute" exact>
          {{ $t('evoucher') }}
          <v-icon v-text="'mdi-ticket-confirmation'" />
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
  name: 'VehicleMaintenance',
  layout: 'vehicle-dashboard',
  computed: {
    ...mapGetters({
      vehicle_number: 'vehicle-dashboard/getVehicleNumber'
    }),
    evoucherRoute: vm => vm.localePath({ path: `/vehicle/${vm.vehicle_number}/maintenance/evoucher` }),
    maintenanceRoute: vm => vm.localePath({ path: `/vehicle/${vm.vehicle_number}/maintenance` })
  }
}
</script>
