<template>
  <base-widget
    :title="title"
    :icon="icon"
    :actions="actions"
  >
    <!-- Inspection Datatable with Pagination -->
    <template #main>
      <base-data-table
        :days="days"
        :loading="$fetchState.pending"
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
  /**
   * Fetch Inspection Data when widget is mounted.
   * See: https://nuxtjs.org/api/pages-fetch#nuxt-gt-2-12
   */
  async fetch () {
    await this.fetchInspectionHistory(this.query)
  },
  data: vm => ({
    days: 60,
    icon: 'mdi-car-parking-lights',
    title: vm.$i18n.t('inspections')
  }),
  computed: {
    /**
     * Vuex Getters
     */
    ...mapGetters({
      items: 'vehicle-dashboard/getInspectionHistory',
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
          to: this.localePath({ path: `/vehicle/${this.vehicle_number}/inspections`, query: { start: this.start, end: this.end } })
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
    /**
     * Request Parameters
     */
    query () {
      return {
        start: this.start,
        end: this.end,
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
      fetchInspectionHistory: 'vehicle-dashboard/fetchInspectionHistory'
    })
  }
}
</script>
