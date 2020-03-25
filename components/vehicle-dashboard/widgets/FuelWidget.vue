<template>
  <base-widget
    :title="title"
    :icon="icon"
    :actions="actions"
  >
    <!-- Fuel Datatable -->
    <template #main>
      <v-fade-transition hide-on-leave>
        <v-skeleton-loader v-if="!initialized" :loading="!initialized" :types="{ 'table-tbody': 'table-row-divider@3' }" type="table-thead, table-tbody, table-tfoot" />
        <v-data-table
          v-else
          :dense="items && !!items.length"
          :headers="headers"
          :hide-default-footer="true"
          :items="items"
          :items-per-page="pagination.itemsPerPage"
          :loading="loading"
          :mobile-breakpoint="0"
          :page.sync="pagination.page"
          :sort-by="['service_date']"
          :sort-desc="[true]"
          class="striped"
          @page-count="pagination.pageCount = $event"
        >
          <!-- Configure formatting of column data -->
          <template #item.service_date="{ item }">
            {{ item.service_date | date }}
          </template>
          <template #item.product_type="{ item }">
            <v-chip :outlined="!$vuetify.theme.dark" x-small v-text="item.product_type" />
          </template>
          <template #item.unit_price="{ item }">
            {{ item.unit_price | currency(3, 3) }}
          </template>
          <template #item.amount="{ item }">
            {{ item.amount | currency }}
          </template>
        </v-data-table>
      </v-fade-transition>
      <v-divider />

      <!-- Report Length & Pagination -->
      <v-card-actions v-show="initialized" class="pager">
        <v-btn-toggle
          v-model="days"
          background-color="transparent"
          color="primary"
          mandatory
          rounded
          dense
        >
          <v-btn
            v-for="period in periods"
            :key="period"
            :value="period"
            small
            text
          >
            {{ period }}
          </v-btn>
        </v-btn-toggle>
        <span class="caption mx-2" v-text="$t('days')" />
        <v-spacer />
        <v-pagination
          v-show="items && !!items.length"
          v-model="pagination.page"
          :length="pagination.pageCount"
          :total-visible="pagination.totalVisible"
          circle
          style="width:auto;"
        />
      </v-card-actions>
    </template>
  </base-widget>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  components: {
    'base-widget': () => import(/* webpackChunkName: "BaseWidget" */ '@/components/vehicle-dashboard/widgets/BaseWidget.vue')
  },
  data: () => ({
    days: 60,
    icon: 'mdi-gas-station',
    initialized: false,
    pagination: {
      itemsPerPage: 5,
      page: 1,
      pageCount: 0,
      totalVisible: 5
    },
    periods: [30, 60, 90]
  }),
  computed: {
    /**
     * Vuex Getters
     */
    ...mapGetters({
      items: 'vehicle-dashboard/getFuelHistory',
      loading: 'vehicle-dashboard/getFuelLoading',
      vehicle_number: 'vehicle-dashboard/getVehicleNumber'
    }),
    /**
     * Menu Actions
     */
    actions () {
      return [
        {
          text: this.$i18n.t('fuel_history'),
          icon: 'mdi-gas-station',
          to: this.fuelRoute
        },
        {
          text: this.$i18n.t('fuel_cards'),
          icon: 'mdi-credit-card',
          to: this.fuelCardRoute
        },
        {
          text: this.$i18n.t('fuel_authorization_profiles'),
          icon: 'mdi-clipboard-account',
          to: this.fuelProfilesRoute
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
    fuelRoute: vm => vm.localePath({ path: `/vehicle/${vm.vehicle_number}/fuel`, query: { start: vm.start, end: vm.end } }),
    fuelCardRoute: vm => vm.localePath({ path: `/vehicle/${vm.vehicle_number}/fuel/fuel-cards` }),
    fuelProfilesRoute: vm => vm.localePath({ path: `/vehicle/${vm.vehicle_number}/fuel/fuel-authorization-profiles` }),
    start: vm => vm.$moment().subtract(vm.days, 'days').format('YYYY-MM-DD'),
    end: vm => vm.$moment().format('YYYY-MM-DD'),
    title: vm => vm.$i18n.t('fuel')
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
   * Fetch Fuel Data when widget is mounted.
   */
  async mounted () {
    await this.populateWidget()
  },
  methods: {
    /**
     * Vuex Actions
     */
    ...mapActions({
      populate: 'vehicle-dashboard/fetchFuelHistory'
    }),
    /**
     * Populate widget and toggle initialized status while data is fetched.
     */
    async populateWidget () {
      await this.populate({
        start: this.start,
        end: this.end,
        use_bill_date: false,
        vehicle: this.vehicle_number
      })
      this.initialized = true
    }
  }
}
</script>
