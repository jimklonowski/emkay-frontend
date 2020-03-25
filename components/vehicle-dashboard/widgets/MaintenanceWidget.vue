<template>
  <base-widget
    :title="title"
    :icon="icon"
    :actions="actions"
  >
    <!-- Maintenance Datatable -->
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
          <template #item.odometer="{ item }">
            {{ item.odometer | number }}
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
    icon: 'mdi-tools',
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
      items: 'vehicle-dashboard/getMaintenanceHistory',
      loading: 'vehicle-dashboard/getMaintenanceLoading',
      vehicle_number: 'vehicle-dashboard/getVehicleNumber'
    }),
    /**
     * Dropdown menu actions
     */
    actions () {
      return [
        {
          text: this.$i18n.t('maintenance_history'),
          icon: 'mdi-tools',
          to: this.maintenanceRoute
        },
        {
          text: this.$i18n.t('cpm'),
          icon: 'mdi-cash',
          to: this.maintenanceCpmRoute
        },
        {
          text: this.$i18n.t('cost_containment'),
          icon: 'mdi-cash',
          to: this.maintenanceCostContainmentRoute
        },
        {
          text: this.$i18n.t('evoucher'),
          icon: 'mdi-ticket-confirmation',
          to: this.evoucherRoute
        }
      ]
    },
    /**
     * Datatable columns
     */
    columns () {
      return [
        'service_date',
        'odometer',
        'vendor_name',
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
          text: this.$i18n.t('service_date'),
          value: 'service_date',
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
          text: this.$i18n.t('vendor_name'),
          value: 'vendor_name',
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
    title: vm => vm.$i18n.t('maintenance'),
    start: vm => vm.$moment().subtract(vm.days, 'days').format('YYYY-MM-DD'),
    end: vm => vm.$moment().format('YYYY-MM-DD'),
    evoucherRoute: vm => vm.localePath({ path: `/vehicle/${vm.vehicle_number}/maintenance/evoucher` }),
    maintenanceRoute: vm => vm.localePath({ path: `/vehicle/${vm.vehicle_number}/maintenance`, query: { start: vm.start, end: vm.end } }),
    maintenanceCpmRoute: vm => vm.localePath({ path: `/vehicle/${vm.vehicle_number}/maintenance/cpm` }),
    maintenanceCostContainmentRoute: vm => vm.localePath({ path: `/vehicle/${vm.vehicle_number}/maintenance/cost-containment` })
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
      populate: 'vehicle-dashboard/fetchMaintenanceHistory'
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
