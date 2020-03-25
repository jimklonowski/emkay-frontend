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
    'maintenance-widget': () => import(/* webpackChunkName: "VehicleDashboardWidgets" */ '@/components/vehicle-dashboard/widgets/MaintenanceWidget.vue'),
    'billing-widget': () => import(/* webpackChunkName: "VehicleDashboardWidgets" */ '@/components/vehicle-dashboard/widgets/BillingWidget.vue'),
    'licensing-widget': () => import(/* webpackChunkName: "VehicleDashboardWidgets" */ '@/components/vehicle-dashboard/widgets/LicensingWidget.vue'),
    'odometer-widget': () => import(/* webpackChunkName: "VehicleDashboardWidgets" */ '@/components/vehicle-dashboard/widgets/OdometerWidget.vue'),
    'toll-widget': () => import(/* webpackChunkName: "VehicleDashboardWidgets" */ '@/components/vehicle-dashboard/widgets/TollWidget.vue'),
    'accident-widget': () => import(/* webpackChunkName: "VehicleDashboardWidgets" */ '@/components/vehicle-dashboard/widgets/AccidentWidget.vue'),
    'rental-widget': () => import(/* webpackChunkName: "VehicleDashboardWidgets" */ '@/components/vehicle-dashboard/widgets/RentalWidget.vue'),
    'violation-widget': () => import(/* webpackChunkName: "VehicleDashboardWidgets" */ '@/components/vehicle-dashboard/widgets/ViolationWidget.vue'),
    'inspection-widget': () => import(/* webpackChunkName: "VehicleDashboardWidgets" */ '@/components/vehicle-dashboard/widgets/InspectionWidget.vue'),
    'order-status-widget': () => import(/* webpackChunkName: "VehicleDashboardWidgets" */ '@/components/vehicle-dashboard/widgets/OrderStatusWidget.vue'),
    'sale-info-widget': () => import(/* webpackChunkName: "VehicleDashboardWidgets" */ '@/components/vehicle-dashboard/widgets/SaleInfoWidget.vue')
  },
  layout: 'vehicle-dashboard',
  data: () => ({
    widgets: [
      { cols: 12, lg: 6, component: 'vehicle-widget' },
      { cols: 12, lg: 6, component: 'driver-widget' },
      { cols: 12, xl: 6, component: 'fuel-widget' },
      { cols: 12, xl: 6, component: 'maintenance-widget' },
      { cols: 12, xl: 6, component: 'billing-widget' },
      { cols: 12, xl: 6, component: 'licensing-widget' },
      { cols: 12, xl: 6, component: 'odometer-widget' },
      { cols: 12, xl: 6, component: 'toll-widget' },
      { cols: 12, xl: 6, component: 'accident-widget' },
      { cols: 12, xl: 6, component: 'rental-widget' },
      { cols: 12, xl: 6, component: 'violation-widget' },
      { cols: 12, xl: 6, component: 'inspection-widget' },
      { cols: 12, xl: 6, component: 'order-status-widget' },
      { cols: 12, xl: 6, component: 'sale-info-widget' }
    ]
  })
}
</script>
