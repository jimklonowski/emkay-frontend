<template>
  <base-widget
    :title="title"
    :icon="icon"
    :actions="actions"
  >
    <!-- Maintenance Datatable with Pagination -->
    <template #main>
      <base-data-table
        :days="days"
        :loading="$fetchState.pending"
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
  /**
   * Fetch Maintenance Data when widget is mounted.
   * See: https://nuxtjs.org/api/pages-fetch#nuxt-gt-2-12
   */
  async fetch () {
    await this.fetchMaintenanceHistory(this.query)
  },
  data: vm => ({
    days: 60,
    icon: 'mdi-tools',
    title: vm.$i18n.t('maintenance')
  }),
  computed: {
    /**
     * Vuex Getters
     */
    ...mapGetters({
      items: 'vehicle-dashboard/getMaintenanceHistory',
      vehicle_number: 'vehicle-dashboard/getVehicleNumber'
    }),
    /**
     * Dropdown Menu Actions
     */
    actions () {
      return [
        {
          text: this.$i18n.t('maintenance_history'),
          icon: 'mdi-tools',
          to: this.localePath({ path: `/vehicle/${this.vehicle_number}/maintenance`, query: { start: this.start, end: this.end }, hash: '#history' })
        },
        {
          text: this.$i18n.t('evoucher'),
          icon: 'mdi-ticket-confirmation',
          to: this.localePath({ path: `/vehicle/${this.vehicle_number}/maintenance`, hash: '#evoucher' })
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
    /**
     * Request Query Parameters
     */
    query () {
      return {
        start: this.start,
        end: this.end,
        use_bill_date: false,
        vehicle: this.vehicle_number
      }
    },
    start: vm => vm.$moment().subtract(vm.days, 'days').format('YYYY-MM-DD'),
    end: vm => vm.$moment().format('YYYY-MM-DD')
  },
  watch: {
    /**
     * Watch 'days' variable for changes, then re-fetch data.
     */
    days: '$fetch'
  },
  activated () {
    // Call fetch again if last fetch more than 30seconds ago
    // See: https://nuxtjs.org/api/pages-fetch#using-code-activated-code-hook
    // if (this.$fetchState.timestamp <= (Date.now() - 30000)) {
    //   this.$fetch()
    // }
  },
  methods: {
    /**
     * Vuex Actions
     */
    ...mapActions({
      fetchMaintenanceHistory: 'vehicle-dashboard/fetchMaintenanceHistory'
    })
  }
}
</script>
