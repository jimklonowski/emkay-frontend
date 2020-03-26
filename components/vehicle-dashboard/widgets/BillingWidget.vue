<template>
  <base-widget
    :title="title"
    :icon="icon"
    :actions="actions"
  >
    <!-- Billing Datatable with Pagination -->
    <template #main>
      <base-data-table
        :days="days"
        :loading="loading"
        :headers="headers"
        :items="items"
        :sort-by="['invoice_number']"
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
    icon: 'mdi-cash-usd-outline'
  }),
  computed: {
    /**
     * Vuex Getters
     */
    ...mapGetters({
      items: 'vehicle-dashboard/getBillingHistory',
      loading: 'vehicle-dashboard/getBillingLoading',
      vehicle_number: 'vehicle-dashboard/getVehicleNumber'
    }),
    /**
     * Dropdown menu actions
     */
    actions () {
      return [
        {
          text: this.$i18n.t('billing_history'),
          icon: this.icon,
          to: this.billingRoute
        }
      ]
    },
    /**
     * Datatable columns
     */
    columns () {
      return [
        'invoice_number',
        'description',
        'bill_date',
        'bill_for_date',
        'amount'
      ]
    },
    /**
     * Datatable headers
     */
    headers () {
      return [
        {
          text: this.$i18n.t('invoice_number'),
          value: 'invoice_number',
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
          text: this.$i18n.t('bill_date'),
          value: 'bill_date',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('bill_for_date'),
          value: 'bill_for_date',
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
    query () {
      return {
        start: this.start_date,
        end: this.end_date,
        use_bill_date: false,
        vehicle: this.vehicle_number
      }
    },
    title: vm => vm.$i18n.t('billing'),
    start: vm => vm.$moment().subtract(vm.days, 'days').format('YYYY-MM-DD'),
    end: vm => vm.$moment().format('YYYY-MM-DD'),
    billingRoute: vm => vm.localePath({ path: `/vehicle/${vm.vehicle_number}/billing`, query: { start: vm.start, end: vm.end } })
  },
  watch: {
    /**
     * Watch 'days' variable for changes, then re-fetch data.
     */
    async days () {
      await this.populateWidget(this.query)
    }
  },
  /**
   * Fetch Billing Data when widget is mounted.
   */
  async mounted () {
    await this.populateWidget(this.query)
  },
  methods: {
    /**
     * Vuex Actions
     */
    ...mapActions({
      populateWidget: 'vehicle-dashboard/fetchBillingHistory'
    }),
    /**
     * Drilldown into billing history and select a given invoice.
     */
    invoiceRoute (invoice) {
      return this.localePath({
        path: `/vehicle/${this.vehicle_number}/billing`,
        query: {
          start: this.start_date,
          end: this.end_date,
          invoice
        }
      })
    }
  }
}
</script>
