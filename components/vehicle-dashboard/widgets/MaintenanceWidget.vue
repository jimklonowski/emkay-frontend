<template>
  <base-widget
    :title="title"
    :icon="icon"
    :actions="actions"
  >
    <!-- Maintenance Datatable with Pagination -->
    <template #main>
      <v-skeleton-loader v-if="!initialized" :loading="!initialized" :types="{ 'table-tbody': 'table-row-divider@3' }" type="table-thead, table-tbody, table-tfoot" />
      <base-data-table
        v-else
        :days="days"
        :initialized="initialized"
        :loading="loading"
        :headers="headers"
        :items="items"
        :sort-by="['service_date']"
        @days-changed="days = $event"
      />
    </template>
  </base-widget>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import BaseDataTable from '@/components/vehicle-dashboard/widgets/BaseDataTable'
import BaseWidget from '@/components/vehicle-dashboard/widgets/BaseWidget'
export default {
  components: {
    BaseDataTable,
    BaseWidget
  },
  data: () => ({
    days: 60,
    icon: 'mdi-tools',
    initialized: false
  }),
  computed: {
    /**
     * Vuex Getters
     */
    ...mapGetters({
      items: 'vehicle-dashboard/getMaintenanceHistory',
      loading: 'vehicle-dashboard/getMaintenanceLoading',
      vehicle_number: 'vehicle-dashboard/getVehicleNumber'
    }),
    /**
     * Dropdown menu actions
     */
    actions () {
      return [
        {
          text: this.$i18n.t('maintenance_history'),
          icon: 'mdi-tools',
          to: this.maintenanceRoute
        },
        {
          text: this.$i18n.t('cpm'),
          icon: 'mdi-cash',
          to: this.maintenanceCpmRoute
        },
        {
          text: this.$i18n.t('cost_containment'),
          icon: 'mdi-cash',
          to: this.maintenanceCostContainmentRoute
        },
        {
          text: this.$i18n.t('evoucher'),
          icon: 'mdi-ticket-confirmation',
          to: this.evoucherRoute
        }
      ]
    },
    /**
     * Datatable columns
     */
    columns () {
      return [
        'service_date',
        'odometer',
        'vendor_name',
        'description',
        'amount'
      ]
    },
    /**
     * Datatable headers
     */
    headers () {
      return [
        {
          text: this.$i18n.t('service_date'),
          value: 'service_date',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('odometer'),
          value: 'odometer',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('vendor_name'),
          value: 'vendor_name',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('description'),
          value: 'description',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('amount'),
          value: 'amount',
          class: 'report-column'
        }
      ]
    },
    title: vm => vm.$i18n.t('maintenance'),
    start: vm => vm.$moment().subtract(vm.days, 'days').format('YYYY-MM-DD'),
    end: vm => vm.$moment().format('YYYY-MM-DD'),
    evoucherRoute: vm => vm.localePath({ path: `/vehicle/${vm.vehicle_number}/maintenance/evoucher` }),
    maintenanceRoute: vm => vm.localePath({ path: `/vehicle/${vm.vehicle_number}/maintenance`, query: { start: vm.start, end: vm.end } }),
    maintenanceCpmRoute: vm => vm.localePath({ path: `/vehicle/${vm.vehicle_number}/maintenance/cpm` }),
    maintenanceCostContainmentRoute: vm => vm.localePath({ path: `/vehicle/${vm.vehicle_number}/maintenance/cost-containment` })
  },
  watch: {
    /**
     * Watch 'days' variable for changes, then re-fetch data.
     */
    async days () {
      await this.populateWidget()
    }
  },
  /**
   * Fetch Maintenance Data when widget is mounted.
   */
  async mounted () {
    await this.populateWidget()
  },
  methods: {
    /**
     * Vuex Actions
     */
    ...mapActions({
      populate: 'vehicle-dashboard/fetchMaintenanceHistory'
    }),
    /**
     * Populate widget and toggle initialized status while data is fetched.
     */
    async populateWidget () {
      await this.populate({
        start: this.start,
        end: this.end,
        use_bill_date: false,
        vehicle: this.vehicle_number
      })
      this.initialized = true
    }
  }
}
</script>