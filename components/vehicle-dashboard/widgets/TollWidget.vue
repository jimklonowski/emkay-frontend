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
   * Fetch Toll Data when widget is mounted.
   * See: https://nuxtjs.org/api/pages-fetch#nuxt-gt-2-12
   */
  async fetch () {
    await this.fetchTollHistory(this.query)
  },
  data: vm => ({
    days: 60,
    icon: 'mdi-highway',
    title: vm.$i18n.t('tolls')
  }),
  computed: {
    /**
     * Vuex Getters
     */
    ...mapGetters({
      items: 'vehicle-dashboard/getTollHistory',
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
          to: this.localePath({ path: `/vehicle/${this.vehicle_number}/tolls`, query: { start: this.start, end: this.end } })
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
      fetchTollHistory: 'vehicle-dashboard/fetchTollHistory'
    })
  }
}
</script>
