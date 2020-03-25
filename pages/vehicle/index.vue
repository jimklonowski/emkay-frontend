<template>
  <!-- if route has vehicle param: show vehicle dashboard -->
  <nuxt-child v-if="$route.params.vehicle" />

  <!-- else: show vehicle search -->
  <v-container v-else fill-height>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <vehicle-search />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'VehicleDashboardWrapper',
  components: {
    'vehicle-search': () => import(/* webpackChunkName: 'VehicleSearch' */ '@/components/vehicle-dashboard/VehicleSearch')
  }
}
</script>
