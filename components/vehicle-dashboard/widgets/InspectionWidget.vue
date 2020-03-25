<template>
  <base-widget
    :title="title"
    :icon="icon"
    :actions="actions"
  >
    <!-- Inspection Datatable with Pagination -->
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
    icon: 'mdi-car-parking-lights',
    initialized: false
  }),
  computed: {
    /**
     * Vuex Getters
     */
    ...mapGetters({
      items: 'vehicle-dashboard/getInspectionHistory',
      loading: 'vehicle-dashboard/getInspectionLoading',
      vehicle_number: 'vehicle-dashboard/getVehicleNumber'
    }),
    /**
     * Dropdown menu actions
     */
    actions () {
      return [
        {
          text: this.$i18n.t('inspection_history'),
          icon: this.icon,
          to: this.inspectionsRoute
        }
      ]
    },
    /**
     * Datatable columns
     */
    columns () {
      return [
        'date',
        'comments',
        'report'
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
          text: this.$i18n.t('comments'),
          value: 'comments',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('report'),
          value: 'report',
          class: 'report-column'
        }
      ]
    },
    title: vm => vm.$i18n.t('inspections'),
    start: vm => vm.$moment().subtract(vm.days, 'days').format('YYYY-MM-DD'),
    end: vm => vm.$moment().format('YYYY-MM-DD'),
    inspectionsRoute: vm => vm.localePath({ path: `/vehicle/${vm.vehicle_number}/inspections`, query: { start: vm.start, end: vm.end } })
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
   * Fetch Inspection Data when widget is mounted.
   */
  async mounted () {
    await this.populateWidget()
  },
  methods: {
    /**
     * Vuex Actions
     */
    ...mapActions({
      populate: 'vehicle-dashboard/fetchInspectionHistory'
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
