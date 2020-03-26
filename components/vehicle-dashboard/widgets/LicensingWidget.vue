<template>
  <base-widget
    :title="title"
    :icon="icon"
    :actions="actions"
  >
    <!-- Licensing Datatable with Pagination -->
    <template #main>
      <base-data-table
        :days="days"
        :loading="loading"
        :headers="headers"
        :items="items"
        :sort-by="['expiration_date']"
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
    icon: 'mdi-smart-card'
  }),
  computed: {
    /**
     * Vuex Getters
     */
    ...mapGetters({
      items: 'vehicle-dashboard/getLicensingHistory',
      loading: 'vehicle-dashboard/getLicensingLoading',
      vehicle_number: 'vehicle-dashboard/getVehicleNumber'
    }),
    /**
     * Dropdown menu actions
     */
    actions () {
      return [
        {
          text: this.$i18n.t('licensing_history'),
          icon: this.icon,
          to: this.licensingRoute
        }
      ]
    },
    /**
     * Datatable columns
     */
    columns () {
      return [
        'expiration_date',
        'license_plate_number',
        'license_plate_state_province',
        'sticker_number',
        'title',
        'status'
      ]
    },
    /**
     * Datatable headers
     */
    headers () {
      return [
        {
          text: this.$i18n.t('expiration_date'),
          value: 'expiration_date',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('license_plate_number'),
          value: 'license_plate_number',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('license_plate_state_province'),
          value: 'license_plate_state_province',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('sticker_number'),
          value: 'sticker_number',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('title'),
          value: 'title',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('status'),
          value: 'status',
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
    title: vm => vm.$i18n.t('licensing'),
    start: vm => vm.$moment().subtract(vm.days, 'days').format('YYYY-MM-DD'),
    end: vm => vm.$moment().format('YYYY-MM-DD'),
    licensingRoute: vm => vm.localePath({ path: `/vehicle/${vm.vehicle_number}/licensing`, query: { start: vm.start, end: vm.end } })
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
   * Fetch Licensing Data when widget is mounted.
   */
  async mounted () {
    await this.populateWidget(this.query)
  },
  methods: {
    /**
     * Vuex Actions
     */
    ...mapActions({
      populateWidget: 'vehicle-dashboard/fetchLicensingHistory'
    })
  }
}
</script>
