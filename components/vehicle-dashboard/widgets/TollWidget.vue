<template>
  <base-widget
    :title="title"
    :icon="icon"
    :actions="actions"
  >
    <!-- Toll Datatable with Pagination -->
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
    icon: 'mdi-highway'
  }),
  computed: {
    /**
     * Vuex Getters
     */
    ...mapGetters({
      items: 'vehicle-dashboard/getTollHistory',
      loading: 'vehicle-dashboard/getTollLoading',
      vehicle_number: 'vehicle-dashboard/getVehicleNumber'
    }),
    /**
     * Dropdown menu actions
     */
    actions () {
      return [
        {
          text: this.$i18n.t('toll_history'),
          icon: 'mdi-highway',
          to: this.tollRoute
        }
      ]
    },
    /**
     * Datatable columns
     */
    columns () {
      return [
        'date',
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
          text: this.$i18n.t('date'),
          value: 'date',
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
    query () {
      return {
        start: this.start,
        end: this.end,
        vehicle: this.vehicle_number
      }
    },
    title: vm => vm.$i18n.t('tolls'),
    start: vm => vm.$moment().subtract(vm.days, 'days').format('YYYY-MM-DD'),
    end: vm => vm.$moment().format('YYYY-MM-DD'),
    tollRoute: vm => vm.localePath({ path: `/vehicle/${vm.vehicle_number}/tolls`, query: { start: vm.start, end: vm.end } })
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
   * Fetch Toll Data when widget is mounted.
   */
  async mounted () {
    await this.populateWidget(this.query)
  },
  methods: {
    /**
     * Vuex Actions
     */
    ...mapActions({
      populateWidget: 'vehicle-dashboard/fetchTollHistory'
    })
  }
}
</script>
