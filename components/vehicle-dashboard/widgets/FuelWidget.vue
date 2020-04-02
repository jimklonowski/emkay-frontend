<template>
  <base-widget
    :title="title"
    :icon="icon"
    :actions="actions"
  >
    <!-- Fuel Datatable with Pagination -->
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
   * Fetch Fuel Data when widget is mounted.
   * See: https://nuxtjs.org/api/pages-fetch#nuxt-gt-2-12
   */
  async fetch () {
    await this.fetchFuelHistory(this.query)
  },
  data: vm => ({
    days: 60,
    icon: 'mdi-gas-station',
    title: vm.$i18n.t('fuel')
  }),
  computed: {
    /**
     * Vuex Getters
     */
    ...mapGetters({
      items: 'vehicle-dashboard/getFuelHistory',
      vehicle_number: 'vehicle-dashboard/getVehicleNumber'
    }),
    /**
     * Dropdown Menu Actions
     */
    actions () {
      return [
        {
          text: this.$i18n.t('fuel_history'),
          icon: 'mdi-gas-station',
          to: this.localePath({ path: '/vehicle/dashboard/fuel', query: { start: this.start, end: this.end }, hash: '#history' })
        },
        {
          text: this.$i18n.t('fuel_cards'),
          icon: 'mdi-credit-card',
          to: this.localePath({ path: '/vehicle/dashboard/fuel', hash: '#cards' })
        },
        {
          text: this.$i18n.t('fuel_authorization_profiles'),
          icon: 'mdi-clipboard-account',
          to: this.localePath({ path: '/vehicle/dashboard/fuel', hash: '#profiles' })
        }
      ]
    },
    /**
     * Datatable columns
     */
    columns () {
      return [
        'service_date',
        'fuel_company_name',
        'product_type',
        'quantity',
        'unit_price',
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
          text: this.$i18n.t('fuel_company_name'),
          value: 'fuel_company_name',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('product_type'),
          value: 'product_type',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('quantity'),
          value: 'quantity',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('unit_price'),
          value: 'unit_price',
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
      fetchFuelHistory: 'vehicle-dashboard/fetchFuelHistory'
    })
  }
}
</script>
