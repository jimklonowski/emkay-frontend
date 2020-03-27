<template>
  <v-container class="pa-0">
    <v-row v-if="items.length > 0">
      <v-col cols="12">
        <maintenance-category-pie-chart />
      </v-col>
    </v-row>
    <v-divider />
    <v-row>
      <v-col cols="12">
        <v-card flat class="report">
          <v-toolbar flat color="transparent">
            <v-toolbar-title>{{ title }}</v-toolbar-title>
            <v-spacer />
            <v-text-field
              v-model="search"
              :label="$t('search')"
              prepend-inner-icon="mdi-magnify"
              background-color="transparent"
              class="mr-2"
              clearable
              dense
              flat
              hide-details
              outlined
              rounded
              single-line
              solo
            />
          </v-toolbar>
          <!-- Report Filters -->
          <v-expansion-panels
            v-model="panels_expanded"
            accordion
            flat
            hover
            multiple
            tile
          >
            <v-expansion-panel class="transparent">
              <v-expansion-panel-header class="overline">
                {{ $t('report_filters') }}
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-container class="pb-0">
                  <v-row>
                    <v-col cols="12" sm="4">
                      <v-dialog
                        ref="start_dialog"
                        v-model="start_dialog"
                        :return-value.sync="start"
                        persistent
                        width="290px"
                        @keydown.esc="start_dialog = false"
                      >
                        <template #activator="{ on }">
                          <v-text-field
                            :value="$moment(start).format('L')"
                            :label="$t('start_date')"
                            prepend-inner-icon="mdi-calendar"
                            dense
                            outlined
                            readonly
                            rounded
                            v-on="on"
                          />
                        </template>
                        <v-date-picker
                          v-model="start"
                          :locale="$moment.locale()"
                          color="primary"
                          header-color="primary"
                          scrollable
                        >
                          <v-spacer />
                          <v-btn text @click="start_dialog = false" v-text="$t('cancel')" />
                          <v-btn text @click="$refs.start_dialog.save(start), updateQuery()" v-text="$t('ok')" />
                        </v-date-picker>
                      </v-dialog>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-dialog
                        ref="end_dialog"
                        v-model="end_dialog"
                        :return-value.sync="end"
                        persistent
                        width="290px"
                        @keydown.esc="end_dialog = false"
                      >
                        <template #activator="{ on }">
                          <v-text-field
                            :value="$moment(end).format('L')"
                            :label="$t('end_date')"
                            prepend-inner-icon="mdi-calendar"
                            dense
                            outlined
                            readonly
                            rounded
                            v-on="on"
                          />
                        </template>
                        <v-date-picker
                          v-model="end"
                          :locale="$moment.locale()"
                          color="primary"
                          header-color="primary"
                          scrollable
                        >
                          <v-spacer />
                          <v-btn text @click="end_dialog = false" v-text="$t('cancel')" />
                          <v-btn text @click="$refs.end_dialog.save(end), updateQuery()" v-text="$t('ok')" />
                        </v-date-picker>
                      </v-dialog>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-switch
                        v-model="use_bill_date"
                        :label="$t(`use_bill_date`)"
                        :loading="loading"
                        class="mt-1"
                        inset
                        @change="updateQuery()"
                      />
                    </v-col>
                  </v-row>
                </v-container>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <v-divider />

          <!-- Report Content -->
          <v-skeleton-loader :loading="loading" type="table">
            <v-data-table
              :dense="items && !!items.length"
              :footer-props="{ itemsPerPageOptions: [10, 25, 50, 100, -1] }"
              :headers="headers"
              :items="items"
              :items-per-page="25"
              :loading="loading"
              :mobile-breakpoint="0"
              :search="search"
              :sort-by="['service_date']"
              :sort-desc="[true]"
              class="striped"
            >
              <!-- Configure the #no-results message (no rows in filtered search) -->
              <template #no-results>
                <div class="text-left">
                  {{ $t('no_search_results', { 'query': search }) }}
                </div>
              </template>

              <!-- Configure individual column rendering -->
              <template #item.service_date="{ item }">
                {{ item.service_date | date }}
              </template>

              <template #item.bill_date="{ item }">
                {{ item.bill_date | date }}
              </template>

              <template #item.amount="{ item }">
                {{ item.amount | currency }}
              </template>
            </v-data-table>
          </v-skeleton-loader>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { downloadFields } from '@/mixins/datatables'
import { updateQuery, vehicleRoute } from '@/mixins/routing'
import ChartLoading from '@/components/vehicle-dashboard/charts/ChartLoading'
/**
 * Vehicle Dashboard Maintenance History
 */
export default {
  name: 'VehicleDashboardMaintenanceHistory',
  components: {
    // MaintenanceCategoryPieChart
    'maintenance-category-pie-chart': () => ({
      component: import(/* webpackChunkName: "MaintenanceCategoryPieChart" */'@/components/vehicle-dashboard/charts/MaintenanceCategoryPieChart.vue'),
      loading: ChartLoading,
      delay: 0
    })
  },
  mixins: [downloadFields, updateQuery, vehicleRoute],
  async asyncData ({ $moment, query, store }) {
    const vehicle = store.getters['vehicle-dashboard/getVehicleNumber']
    const report_length = 30
    const start = query.start || $moment().subtract(report_length, 'days').format('YYYY-MM-DD')
    const end = query.end || $moment().format('YYYY-MM-DD')
    const use_bill_date = query.use_bill_date || false

    await store.dispatch('vehicle-dashboard/fetchMaintenanceHistory', { start, end, use_bill_date, vehicle })

    return {
      start_dialog: false,
      start,
      end_dialog: false,
      end,
      panels_expanded: [0],
      search: '',
      use_bill_date
    }
  },
  computed: {
    /**
     * Vuex Getters
     */
    ...mapGetters({
      items: 'vehicle-dashboard/getMaintenanceHistory',
      loading: 'vehicle-dashboard/getMaintenanceLoading',
      vehicle_number: 'vehicle-dashboard/getVehicleNumber'
    }),
    columns () {
      return [
        'service_date',
        'bill_date',
        'vendor_name',
        'description',
        'maintenance_category',
        'quantity',
        'amount'
      ]
    },
    headers () {
      return [
        {
          text: this.$i18n.t('service_date'),
          value: 'service_date',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('bill_date'),
          value: 'bill_date',
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
          text: this.$i18n.t('maintenance_category'),
          value: 'maintenance_category',
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
        use_bill_date: this.use_bill_date
      }
    },
    title: vm => vm.$i18n.t('maintenance_history')
  },
  head () {
    return {
      title: `${this.vehicle_number} - ${this.title}`,
      meta: [
        { hid: 'og:description', property: 'og:description', content: this.title }
      ]
    }
  },
  watchQuery: ['start', 'end', 'use_bill_date']
}
</script>
