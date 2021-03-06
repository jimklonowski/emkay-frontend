<template>
  <v-card outlined class="report">
    <v-toolbar flat color="transparent">
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer />
      <search-bar v-model="search" :label="$t('search')" class="mr-2" />
      <excel-downloader :download-fields="downloadFields" :items="items" :export-name="exportName" />
    </v-toolbar>
    <v-divider />

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
              <v-col cols="12" sm="6" lg="3">
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
              <v-col cols="12" sm="6" lg="3">
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
              <v-col cols="12" sm="6" lg="3">
                <v-dialog
                  ref="centers_dialog"
                  v-model="centers_dialog"
                  max-width="650"
                  scrollable
                >
                  <template #activator="{ on }">
                    <v-btn color="primary" width="100%" depressed rounded v-on="on">
                      {{ $tc('centers_filtered', centers_selected.length) }}
                    </v-btn>
                  </template>
                  <v-card>
                    <v-sheet class="pa-0 primary" dark>
                      <v-toolbar flat color="transparent">
                        <v-toolbar-title>{{ $t('centers') }}</v-toolbar-title>
                        <v-spacer />
                        <v-btn icon @click="centers_dialog = false">
                          <v-icon v-text="'mdi-close'" />
                        </v-btn>
                      </v-toolbar>
                      <v-sheet class="primary lighten-1 flex-column pa-4" dark>
                        <v-text-field
                          v-model="search_centers"
                          :label="$t('search_centers')"
                          dark
                          flat
                          solo-inverted
                          hide-details
                          clearable
                          clear-icon="mdi-close-circle-outline"
                          autocomplete="off"
                        />
                      </v-sheet>
                    </v-sheet>
                    <v-card-text>
                      <center-picker v-model="centers_selected" :return-value.sync="centers_selected" :search="search_centers" />
                    </v-card-text>
                    <v-divider />
                    <v-card-actions>
                      {{ $tc('centers_selected', centers_selected.length) }}
                      <v-spacer />
                      <v-btn color="error" text @click="centers_selected = [], search_centers = ''">
                        {{ $t('reset') }}
                      </v-btn>
                      <v-btn color="primary" @click="centers_dialog = false">
                        {{ $t('ok') }}
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-col>
            </v-row>
          </v-container>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-divider />

    <!-- Report Content -->
    <v-skeleton-loader :loading="$fetchState.pending" type="table" transition="fade-transition">
      <v-data-table
        :footer-props="{ itemsPerPageOptions: [10, 25, 50, 100, -1] }"
        :headers="headers"
        :items="items"
        :items-per-page="25"
        :loading="$fetchState.pending"
        :mobile-breakpoint="0"
        :search="search"
        :sort-by="['vehicle_number']"
        :sort-desc="[true]"
        class="striped"
      >
        <!-- Configure the #no-data message (no data from server) -->
        <template #no-data>
          <div class="text-left">
            {{ $t('no_data_found', { 'message': error }) }}
          </div>
        </template>

        <!-- Configure the #no-results message (no rows in filtered search) -->
        <template #no-results>
          <div class="text-left">
            {{ $t('no_search_results', { 'query': search }) }}
          </div>
        </template>
        <template #item.date_sold="{ item }">
          {{ item.date_sold | date }}
        </template>
        <template #item.capitalized_cost="{ item }">
          {{ item.capitalized_cost | currency }}
        </template>
        <template #item.gain_loss="{ item }">
          {{ item.gain_loss | currency }}
        </template>
        <template #item.net_depreciation_percent="{ item }">
          {{ item.net_depreciation_percent | percent }}
        </template>
        <template #item.depreciation_percent="{ item }">
          {{ item.depreciation_percent | percent }}
        </template>
        <template #item.cost_per_mile="{ item }">
          {{ item.cost_per_mile | currency(3, 3) }}
        </template>
        <template #item.cost_per_month="{ item }">
          {{ item.cost_per_month | currency }}
        </template>
        <template #item.odometer="{ item }">
          {{ item.odometer | number }}
        </template>
        <template #item.sold_amount="{ item }">
          {{ item.sold_amount | currency }}
        </template>
      </v-data-table>
    </v-skeleton-loader>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex'
import { reportMixins } from '@/mixins/reports'
/**
 * Sold Vehicle Analysis Report
 */
export default {
  name: 'SoldVehicleAnalysisReport',
  mixins: [reportMixins],
  data: vm => ({
    start_dialog: false,
    end_dialog: false,
    title: vm.$i18n.t('sold_vehicle_analysis_report'),

    start: vm.$route.query.start || vm.$moment().subtract(30, 'days').format('YYYY-MM-DD'),
    end: vm.$route.query.end || vm.$moment().format('YYYY-MM-DD'),
    use_bill_date: vm.$route.query.use_bill_date || false
  }),
  computed: {
    /**
     * Datatable columns
     */
    columns () {
      return [
        'date_sold',
        'vehicle_number',
        'client_vehicle_number',
        'bb_mmr_percent',
        'bill_sort',
        'buyer',
        'capitalized_cost',
        'center_code',
        'condition',
        'cost_per_mile',
        'cost_per_month',
        'depreciation_percent',
        'driver_name',
        'gain_loss',
        'model_year',
        'months_in_service',
        'net_depreciation_percent',
        'odometer',
        'priced_by',
        'sold_amount',
        'vehicle_color',
        'vehicle_make',
        'vehicle_model',
        'vin'
      ]
    },
    /**
     * Datatable headers
     */
    headers () {
      return [
        {
          text: this.$i18n.t('date_sold'),
          value: 'date_sold',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('vehicle_number'),
          value: 'vehicle_number',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('client_vehicle_number'),
          value: 'client_vehicle_number',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('bb_mmr_percent'),
          value: 'bb_mmr_percent',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('bill_sort'),
          value: 'bill_sort',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('buyer'),
          value: 'buyer',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('capitalized_cost'),
          value: 'capitalized_cost',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('center_code'),
          value: 'center_code',
          class: 'report-column',
          divider: true,
          filter: (value) => {
            if (!this.centers_selected || this.centers_selected.length === 0) {
              // no centers selected, don't filter anything
              return true
            }
            return this.centers_selected.find(center => center.center_code === value)
          }
        },
        {
          text: this.$i18n.t('condition'),
          value: 'condition',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('cost_per_mile'),
          value: 'cost_per_mile',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('cost_per_month'),
          value: 'cost_per_month',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('depreciation_percent'),
          value: 'depreciation_percent',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('driver_name'),
          value: 'driver_name',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('gain_loss'),
          value: 'gain_loss',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('model_year'),
          value: 'model_year',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('months_in_service'),
          value: 'months_in_service',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('net_depreciation_percent'),
          value: 'net_depreciation_percent',
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
          text: this.$i18n.t('priced_by'),
          value: 'priced_by',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('sold_amount'),
          value: 'sold_amount',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('vehicle_color'),
          value: 'vehicle_color',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('vehicle_make'),
          value: 'vehicle_make',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('vehicle_model'),
          value: 'vehicle_model',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('vin'),
          value: 'vin',
          class: 'report-column'
        }
      ]
    },
    /**
     * Query Parameters
     */
    query () {
      return {
        start: this.start,
        end: this.end
      }
    }
  },
  methods: {
    /**
     * Vuex Actions
     */
    ...mapActions({
      fetchReport: 'reports/fetchSoldVehicleAnalysisReport'
    })
  }
}
</script>
