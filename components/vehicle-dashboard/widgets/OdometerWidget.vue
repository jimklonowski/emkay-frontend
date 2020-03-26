<template>
  <base-widget
    :title="title"
    :icon="icon"
    :actions="actions"
  >
    <!-- Odometer Datatable with Pagination -->
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
    icon: 'mdi-counter'
  }),
  computed: {
    /**
     * Vuex Getters
     */
    ...mapGetters({
      items: 'vehicle-dashboard/getOdometerHistory',
      loading: 'vehicle-dashboard/getOdometerLoading',
      vehicle_number: 'vehicle-dashboard/getVehicleNumber'
    }),
    /**
     * Dropdown menu actions
     */
    actions () {
      return [
        {
          text: this.$i18n.t('odometer_history'),
          icon: this.icon,
          to: this.odometerRoute
        }
      ]
    },
    /**
     * Datatable columns
     */
    columns () {
      return [
        'date',
        'odometer',
        'type'
      ]
    },
    /**
     * Datatable headers
     */
    headers () {
      return [
        {
          text: this.$i18n.t('odometer_date'),
          value: 'date',
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
          text: this.$i18n.t('reading_type'),
          value: 'type',
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
    title: vm => vm.$i18n.t('odometer'),
    start: vm => vm.$moment().subtract(vm.days, 'days').format('YYYY-MM-DD'),
    end: vm => vm.$moment().format('YYYY-MM-DD'),
    odometerRoute: vm => vm.localePath({ path: `/vehicle/${vm.vehicle_number}/odometer`, query: { start: vm.start, end: vm.end } })
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
   * Fetch Odometer Data when widget is mounted.
   */
  async mounted () {
    await this.populateWidget(this.query)
  },
  methods: {
    /**
     * Vuex Actions
     */
    ...mapActions({
      populateWidget: 'vehicle-dashboard/fetchOdometerHistory'
    })
  }
}
</script>
