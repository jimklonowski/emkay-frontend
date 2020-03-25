<template>
  <v-row>
    <v-col
      v-for="(widget, w) in widgets"
      :key="`widget-${w}`"
      :cols="widget.cols"
      :sm="widget.sm"
      :md="widget.md"
      :lg="widget.lg"
      :xl="widget.xl"
    >
      <component :is="widget.component" />
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: 'VehicleDashboard',
  components: {
    'vehicle-widget': () => import(/* webpackChunkName: "VehicleDashboardWidgets" */ '@/components/vehicle-dashboard/widgets/VehicleWidget.vue'),
    'driver-widget': () => import(/* webpackChunkName: "VehicleDashboardWidgets" */ '@/components/vehicle-dashboard/widgets/DriverWidget.vue'),
    'fuel-widget': () => import(/* webpackChunkName: "VehicleDashboardWidgets" */ '@/components/vehicle-dashboard/widgets/FuelWidget.vue'),
    'maintenance-widget': () => import(/* webpackChunkName: "VehicleDashboardWidgets" */ '@/components/vehicle-dashboard/widgets/MaintenanceWidget.vue')
  },
  layout: 'vehicle-dashboard',
  data: () => ({
    widgets: [
      { cols: 12, lg: 6, component: 'vehicle-widget' },
      { cols: 12, lg: 6, component: 'driver-widget' },
      { cols: 12, xl: 6, component: 'fuel-widget' },
      { cols: 12, xl: 6, component: 'maintenance-widget' }
    ]
  })
}
</script>
