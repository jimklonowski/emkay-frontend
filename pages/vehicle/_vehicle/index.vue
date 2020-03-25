<template>
  <v-row>
    <v-col
      v-for="(widget, w) in widgets"
      :key="`widget-${w}`"
      :cols="widget.cols"
      :sm="widget.sm"
      :md="widget.md"
      :lg="widget.lg"
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
    'driver-widget': () => import(/* webpackChunkName: "VehicleDashboardWidgets" */ '@/components/vehicle-dashboard/widgets/DriverWidget.vue')
  },
  layout: 'vehicle-dashboard',
  data: () => ({
    widgets: [
      { cols: 12, lg: 6, component: 'vehicle-widget' },
      { cols: 12, lg: 6, component: 'driver-widget' }
    ]
  })
}
</script>
