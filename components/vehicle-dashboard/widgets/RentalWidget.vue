<template>
  <base-widget
    :title="title"
    :icon="icon"
    :actions="actions"
  >
    <!-- Rental Datatable with Pagination -->
    <template #main>
      <base-data-table
        :days="days"
        :loading="loading"
        :headers="headers"
        :items="items"
        :sort-by="['date']"
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
    icon: 'mdi-bus-clock'
  }),
  computed: {
    /**
     * Vuex Getters
     */
    ...mapGetters({
      items: 'vehicle-dashboard/getRentalHistory',
      loading: 'vehicle-dashboard/getRentalLoading',
      vehicle_number: 'vehicle-dashboard/getVehicleNumber'
    }),
    /**
     * Dropdown menu actions
     */
    actions () {
      return [
        {
          text: this.$i18n.t('rental_history'),
          icon: this.icon,
          to: this.rentalRoute
        }
      ]
    },
    /**
     * Datatable columns
     */
    columns () {
      return [
        'date',
        'voucher',
        'days',
        'rental_rate',
        'total_amount',
        'reason'
      ]
    },
    /**
     * Datatable headers
     */
    headers () {
      return [
        {
          text: this.$i18n.t('date'),
          value: 'date',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('voucher'),
          value: 'voucher',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('days'),
          value: 'days',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('rental_rate'),
          value: 'rental_rate',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('total_amount'),
          value: 'total_amount',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('reason'),
          value: 'reason',
          class: 'report-column'
        }
      ]
    },
    query () {
      return {
        start: this.start,
        end: this.end,
        vehicle: this.vehicle_number
      }
    },
    title: vm => vm.$i18n.t('rentals'),
    start: vm => vm.$moment().subtract(vm.days, 'days').format('YYYY-MM-DD'),
    end: vm => vm.$moment().format('YYYY-MM-DD'),
    rentalRoute: vm => vm.localePath({ path: `/vehicle/${vm.vehicle_number}/rentals`, query: { start: vm.start, end: vm.end } })
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
   * Fetch Rental Data when widget is mounted.
   */
  async mounted () {
    await this.populateWidget(this.query)
  },
  methods: {
    /**
     * Vuex Actions
     */
    ...mapActions({
      populateWidget: 'vehicle-dashboard/fetchRentalHistory'
    })
  }
}
</script>
