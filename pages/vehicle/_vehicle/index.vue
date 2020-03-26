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
import WidgetLoading from '@/components/vehicle-dashboard/widgets/WidgetLoading'
export default {
  name: 'VehicleDashboard',
  /**
   * Vehicle Dashboard widgets are loaded asyncronously, showing a loading component while loading
   * See: https://vuejs.org/v2/guide/components-dynamic-async.html
   * Also: https://alligator.io/vuejs/vue-async-components-load-error/
   */
  components: {
    'vehicle-widget': () => ({
      component: import(/* webpackChunkName: "VehicleWidget" */'@/components/vehicle-dashboard/widgets/VehicleWidget.vue'),
      loading: WidgetLoading,
      delay: 0
    }),
    'driver-widget': () => ({
      component: import(/* webpackChunkName: "DriverWidget" */'@/components/vehicle-dashboard/widgets/DriverWidget.vue'),
      loading: WidgetLoading,
      delay: 0
    }),
    'expense-summary-widget': () => ({
      component: import(/* webpackChunkName: "ExpenseSummaryWidget" */'@/components/vehicle-dashboard/widgets/ExpenseSummaryWidget.vue'),
      loading: WidgetLoading,
      delay: 0
    }),
    'fuel-widget': () => ({
      component: import(/* webpackChunkName: "FuelWidget" */'@/components/vehicle-dashboard/widgets/FuelWidget.vue'),
      loading: WidgetLoading,
      delay: 0
    }),
    'maintenance-widget': () => ({
      component: import(/* webpackChunkName: "MaintenanceWidget" */'@/components/vehicle-dashboard/widgets/MaintenanceWidget.vue'),
      loading: WidgetLoading,
      delay: 0
    }),
    'billing-widget': () => ({
      component: import(/* webpackChunkName: "BillingWidget" */'@/components/vehicle-dashboard/widgets/BillingWidget.vue'),
      loading: WidgetLoading,
      delay: 0
    }),
    'licensing-widget': () => ({
      component: import(/* webpackChunkName: "LicensingWidget" */'@/components/vehicle-dashboard/widgets/LicensingWidget.vue'),
      loading: WidgetLoading,
      delay: 0
    }),
    'odometer-widget': () => ({
      component: import(/* webpackChunkName: "OdometerWidget" */'@/components/vehicle-dashboard/widgets/OdometerWidget.vue'),
      loading: WidgetLoading,
      delay: 0
    }),
    'toll-widget': () => ({
      component: import(/* webpackChunkName: "TollWidget" */'@/components/vehicle-dashboard/widgets/TollWidget.vue'),
      loading: WidgetLoading,
      delay: 0
    }),
    'accident-widget': () => ({
      component: import(/* webpackChunkName: "AccidentWidget" */'@/components/vehicle-dashboard/widgets/AccidentWidget.vue'),
      loading: WidgetLoading,
      delay: 0
    }),
    'rental-widget': () => ({
      component: import(/* webpackChunkName: "RentalWidget" */'@/components/vehicle-dashboard/widgets/RentalWidget.vue'),
      loading: WidgetLoading,
      delay: 0
    }),
    'violation-widget': () => ({
      component: import(/* webpackChunkName: "ViolationWidget" */'@/components/vehicle-dashboard/widgets/ViolationWidget.vue'),
      loading: WidgetLoading,
      delay: 0
    }),
    'inspection-widget': () => ({
      component: import(/* webpackChunkName: "InspectionWidget" */'@/components/vehicle-dashboard/widgets/InspectionWidget.vue'),
      loading: WidgetLoading,
      delay: 0
    }),
    'order-status-widget': () => ({
      component: import(/* webpackChunkName: "OrderStatusWidget" */'@/components/vehicle-dashboard/widgets/OrderStatusWidget.vue'),
      loading: WidgetLoading,
      delay: 0
    }),
    'sale-info-widget': () => ({
      component: import(/* webpackChunkName: "SaleInfoWidget" */'@/components/vehicle-dashboard/widgets/SaleInfoWidget.vue'),
      loading: WidgetLoading,
      delay: 0
    })
  },
  layout: 'vehicle-dashboard',
  data: () => ({
    widgets: [
      { cols: 12, lg: 6, component: 'vehicle-widget' },
      { cols: 12, lg: 6, component: 'driver-widget' },
      { cols: 12, component: 'expense-summary-widget' },
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
