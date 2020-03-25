<template>
  <base-widget
    :title="title"
    :icon="icon"
    :actions="actions"
  >
    <!-- Violation Datatable with Pagination -->
    <template #main>
      <v-skeleton-loader v-if="!initialized" :loading="!initialized" :types="{ 'table-tbody': 'table-row-divider@3' }" type="table-thead, table-tbody, table-tfoot" />
      <base-data-table
        v-else
        :days="days"
        :initialized="initialized"
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
    icon: 'mdi-shield-car',
    initialized: false
  }),
  computed: {
    /**
     * Vuex Getters
     */
    ...mapGetters({
      items: 'vehicle-dashboard/getViolationHistory',
      loading: 'vehicle-dashboard/getViolationLoading',
      vehicle_number: 'vehicle-dashboard/getVehicleNumber'
    }),
    /**
     * Dropdown menu actions
     */
    actions () {
      return [
        {
          text: this.$i18n.t('violation_history'),
          icon: this.icon,
          to: this.violationRoute
        }
      ]
    },
    /**
     * Datatable columns
     */
    columns () {
      return [
        'date',
        'paid_date',
        'violation_number',
        'type',
        'state_or_province',
        'amount'
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
          text: this.$i18n.t('paid_date'),
          value: 'paid_date',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('violation_number'),
          value: 'violation_number',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('type'),
          value: 'type',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('state_or_province'),
          value: 'state_or_province',
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
    title: vm => vm.$i18n.t('violations'),
    start: vm => vm.$moment().subtract(vm.days, 'days').format('YYYY-MM-DD'),
    end: vm => vm.$moment().format('YYYY-MM-DD'),
    violationRoute: vm => vm.localePath({ path: `/vehicle/${vm.vehicle_number}/violations`, query: { start: vm.start, end: vm.end } })
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
   * Fetch Violation Data when widget is mounted.
   */
  async mounted () {
    await this.populateWidget()
  },
  methods: {
    /**
     * Vuex Actions
     */
    ...mapActions({
      populate: 'vehicle-dashboard/fetchViolationHistory'
    }),
    /**
     * Populate widget and toggle initialized status while data is fetched.
     */
    async populateWidget () {
      // this.initialized = false
      await this.populate({
        start: this.start,
        end: this.end,
        vehicle: this.vehicle_number
      })
      this.initialized = true
    }
  }
}
</script>
