<template>
  <v-app>
    <emkay-navigation />
    <v-content>
      <vehicle-dashboard-navigation />
      <pre>vehicle breadcrumbs</pre>
      <nuxt />
    </v-content>
    <emkay-footer />
  </v-app>
</template>

<script>
import EmkayNavigation from '@/components/core/EmkayNavigation'
import VehicleDashboardNavigation from '@/components/vehicle-dashboard/VehicleDashboardNavigation'
import EmkayFooter from '@/components/core/EmkayFooter'
export default {
  components: {
    EmkayNavigation,
    VehicleDashboardNavigation,
    EmkayFooter
  }
}
</script>
