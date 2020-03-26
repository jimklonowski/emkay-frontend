<template>
  <v-app>
    <emkay-navigation />
    <v-content>
      <vehicle-dashboard-navigation />
      <v-container>
        <vehicle-dashboard-breadcrumbs />
        <nuxt />
      </v-container>
    </v-content>
    <emkay-footer />
    <client-only>
      <vue-snotify />
    </client-only>
  </v-app>
</template>

<script>
import EmkayNavigation from '@/components/core/EmkayNavigation'
import VehicleDashboardNavigation from '@/components/vehicle-dashboard/VehicleDashboardNavigation'
import VehicleDashboardBreadcrumbs from '@/components/vehicle-dashboard/VehicleDashboardBreadcrumbs'
import EmkayFooter from '@/components/core/EmkayFooter'
export default {
  components: {
    EmkayNavigation,
    VehicleDashboardBreadcrumbs,
    VehicleDashboardNavigation,
    EmkayFooter
  },
  middleware: ['check-auth', 'account', 'vehicle-dashboard']
}
</script>
