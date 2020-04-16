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
              <v-col cols="12" sm="6" lg="3">
                <v-switch
                  v-model="below_avg"
                  :label="$t(`below_average_only`)"
                  :loading="$fetchState.pending"
                  :false-value="false"
                  :true-value="true"
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
    <v-skeleton-loader :loading="$fetchState.pending" type="table" transition="fade-transition">
      <v-data-table
        :footer-props="{ itemsPerPageOptions: [10, 25, 50, 100, -1] }"
        :headers="headers"
        :items="items"
        :items-per-page="25"
        :loading="$fetchState.pending"
        :mobile-breakpoint="0"
        :search="search"
        :sort-by="['service_date']"
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

        <!-- configure individual column rendering -->
        <template #item.vehicle_number="{ item }">
          <vehicle-number-button :vehicle-number="item.vehicle_number" />
        </template>
        <template #item.in_service_date="{ item }">
          {{ item.in_service_date | date }}
        </template>
        <template #item.days_in_service="{ item }">
          {{ item.days_in_service | number }}
        </template>
        <template #item.city_mpg="{ item }">
          {{ item.city_mpg | number(2) }}
        </template>
        <template #item.highway_mpg="{ item }">
          {{ item.highway_mpg | number(2) }}
        </template>
        <template #item.standard_mpg="{ item }">
          {{ item.standard_mpg | number(2) }}
        </template>
        <template #item.average_mpg="{ item }">
          {{ item.average_mpg | number(2) }}
        </template>
        <!-- <template #item.client_vehicle_number="{ item }">
          <span v-html="item.client_vehicle_number" />
        </template> -->

        <template #item.amount="{ item }">
          {{ item.amount | currency }}
        </template>

        <template #item.card_number="{ item }">
          <v-chip :outlined="$vuetify.theme.dark" x-small>
            {{ item.card_number }}
          </v-chip>
        </template>

        <template #item.emkay_invoice_date="{ item }">
          {{ item.emkay_invoice_date | date }}
        </template>

        <template #item.quantity="{ item }">
          {{ item.quantity | number }}
        </template>

        <template #item.tank_capacity="{ item }">
          {{ item.tank_capacity | number }}
        </template>

        <template #item.tax_exempt="{ item }">
          {{ item.tax_exempt | currency }}
        </template>

        <template #item.unit_price="{ item }">
          {{ item.unit_price | currency(3,3) }}
        </template>
      </v-data-table>
    </v-skeleton-loader>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex'
import { reportMixins } from '@/mixins/reports'
/**
 * MPG Report
 * When a date filter changes, a call is made to updateQuery which updates the route's query parameters (?start=2019-11&end=2019-11&...)
 * When $route.query changes, $fetch is called with the updated parameters
 * See Mixin for fetch, getters, centers, json export, query watcher, page meta and more
 */
export default {
  name: 'MPGReport',
  mixins: [reportMixins],
  data: vm => ({
    start_dialog: false,
    end_dialog: false,
    title: vm.$i18n.t('mpg_report'),

    start: vm.$route.query.start || vm.$moment().subtract(30, 'days').format('YYYY-MM-DD'),
    end: vm.$route.query.end || vm.$moment().format('YYYY-MM-DD'),
    below_avg: vm.$route.query.below_avg || false
  }),
  computed: {
    /**
     * Datatable columns
     */
    columns () {
      return [
        'vehicle_number',
        'client_vehicle_number',
        'center_code',
        'center_name',
        'model_year',
        'vehicle_make',
        'vehicle_model',
        'driver_first_name',
        'driver_last_name',
        'in_service_date',
        'days_in_service',
        'city_mpg',
        'highway_mpg',
        'standard_mpg',
        'average_mpg',
        'compared_to_average_mpg',
        'odometer',
        'total_fuel_amount',
        'total_gallons',
        'total_miles_driven',
        'average_price_per_gallon',
        'level_01',
        'level_02',
        'level_03',
        'level_04',
        'level_05',
        'level_06',
        'level_07',
        'level_08',
        'level_09',
        'level_10'
      ]
    },
    /**
     * Datatable headers
     */
    headers () {
      return [
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
          text: this.$i18n.t('center_name'),
          value: 'center_name',
          class: 'report-column',
          width: 300,
          divider: true
        },
        {
          text: this.$i18n.t('model_year'),
          value: 'model_year',
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
          width: 200,
          divider: true
        },
        {
          text: this.$i18n.t('driver_last_name'),
          value: 'driver_last_name',
          class: 'report-column',
          divider: true,
          width: 225
        },
        {
          text: this.$i18n.t('driver_first_name'),
          value: 'driver_first_name',
          class: 'report-column',
          width: 225,
          divider: true
        },
        {
          text: this.$i18n.t('in_service_date'),
          value: 'in_service_date',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('days_in_service'),
          value: 'days_in_service',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('city_mpg'),
          value: 'city_mpg',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('highway_mpg'),
          value: 'highway_mpg',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('standard_mpg'),
          value: 'standard_mpg',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('average_mpg'),
          value: 'average_mpg',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('compared_to_average_mpg'),
          value: 'compared_to_average_mpg',
          class: 'report-column',
          divider: true,
          width: 250
        },
        {
          text: this.$i18n.t('odometer'),
          value: 'odometer',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('total_fuel_amount'),
          value: 'total_fuel_amount',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('total_gallons'),
          value: 'total_gallons',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('total_miles_driven'),
          value: 'total_miles_driven',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('average_price_per_gallon'),
          value: 'average_price_per_gallon',
          class: 'report-column'
        }
      ]
    },
    /**
     * Query parameters
     */
    query () {
      return {
        start: this.start,
        end: this.end,
        below_avg: this.below_avg
      }
    }
  },
  methods: {
    /**
     * Vuex Actions
     */
    ...mapActions({
      fetchReport: 'reports/fetchMPGReport'
    })
  }
}
</script>
