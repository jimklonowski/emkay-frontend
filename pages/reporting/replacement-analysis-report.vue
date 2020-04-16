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
              <v-col cols="auto">
                <v-select
                  v-model="report_type"
                  :items="report_types"
                  :label="$t('report_type')"
                  :menu-props="{ bottom: true, offsetY: true }"
                  dense
                  outlined
                  rounded
                  @change="updateQuery()"
                />
              </v-col>
              <v-col cols="auto">
                <v-select
                  v-model="report_months"
                  :items="[12,11,10,9,8,7,6,5,4,3,2,1]"
                  :label="$t('number_of_months')"
                  :menu-props="{ bottom: true, offsetY: true }"
                  dense
                  outlined
                  rounded
                  @change="updateQuery()"
                />
              </v-col>
              <v-col cols="auto">
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
            <v-row v-show="report_type === 'MODEL'">
              <v-col cols="auto">
                <v-text-field
                  v-model="miles_driven"
                  :label="$t('miles_driven')"
                  autocomplete="off"
                  type="number"
                  dense
                  outlined
                  rounded
                  @change="updateQuery()"
                />
              </v-col>
              <v-col cols="auto">
                <v-btn-toggle v-model="and_or" dense mandatory rounded @change="updateQuery()">
                  <v-btn value="AND">
                    {{ $t('and') }}
                  </v-btn>
                  <v-btn value="OR">
                    {{ $t('or') }}
                  </v-btn>
                </v-btn-toggle>
              </v-col>
              <v-col cols="auto">
                <v-text-field
                  v-model="months_in_service"
                  :label="$t('months_in_service')"
                  autocomplete="off"
                  type="number"
                  dense
                  outlined
                  rounded
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
        <template #item.odometer="{ item }">
          {{ item.odometer | number }}
        </template>
        <template #item.odometer_date="{ item }">
          {{ item.odometer_date | date }}
        </template>
        <template #item.average_miles_per_month="{ item }">
          {{ item.average_miles_per_month | number }}
        </template>
        <template #item.projected_odometer="{ item }">
          {{ item.projected_odometer | number }}
        </template>
        <template #item.in_service_date="{ item }">
          {{ item.in_service_date | date }}
        </template>
        <template #item.rent="{ item }">
          {{ item.rent | currency }}
        </template>
        <template #item.excess_charge="{ item }">
          {{ item.excess_charge | number }}
        </template>
      </v-data-table>
    </v-skeleton-loader>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex'
import { reportMixins } from '@/mixins/reports'
/**
 * Replacement Analysis Report
 */
export default {
  name: 'ReplacementAnalysisReport',
  mixins: [reportMixins],
  data: vm => ({
    and_or: 'AND',
    report_months: 12,
    report_type: 'STANDARD',
    miles_driven: 0,
    months_in_service: 0,
    start_dialog: false,
    end_dialog: false,
    title: vm.$i18n.t('replacement_analysis_report'),

    start: vm.$route.query.start || vm.$moment().subtract(365, 'days').format('YYYY-MM-DD'),
    end: vm.$route.query.end || vm.$moment().format('YYYY-MM-DD')
  }),
  computed: {
    report_types () {
      return [
        {
          text: this.$i18n.t('standard'),
          value: 'STANDARD'
        },
        {
          text: this.$i18n.t('model'),
          value: 'MODEL'
        }
      ]
    },
    /**
     * Datatable columns
     */
    columns () {
      return [
        'vehicle_number',
        'client_vehicle_number',
        'center_code',
        'center_name',
        'level_01',
        'level_02',
        'level_03',
        'level_04',
        'level_05',
        'level_06',
        'level_07',
        'level_08',
        'level_09',
        'level_10',
        'lease_type',
        'driver_last_name',
        'driver_first_name',
        'model_year',
        'vehicle_make',
        'vehicle_model',
        'client_use_1',
        'client_use_2',
        'client_use_3',
        'client_use_4',
        'client_use_5',
        'odometer',
        'odometer_date',
        'average_miles_per_month',
        'projected_odometer',
        'months_in_service',
        'in_service_date',
        'next_vehicle_number',
        'driver_state_province',
        'comment',
        'policy',
        'team_type',
        'team_number',
        'lease_termination_date',
        'closed_lease_type',
        'min_term',
        'max_term',
        'term',
        'rent',
        'miles_allowed',
        'excess_charge'
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
          divider: true,
          width: 300
        },
        {
          text: this.$i18n.t('lease_type'),
          value: 'lease_type',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('driver_last_name'),
          value: 'driver_last_name',
          class: 'report-column',
          divider: true,
          width: 200
        },
        {
          text: this.$i18n.t('driver_first_name'),
          value: 'driver_first_name',
          class: 'report-column',
          divider: true,
          width: 200
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
          divider: true,
          width: 200
        },
        {
          text: this.$i18n.t('vehicle_model'),
          value: 'vehicle_model',
          class: 'report-column',
          divider: true,
          width: 200
        },
        {
          text: this.$i18n.t('client_use_1'),
          value: 'client_use_1',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('client_use_2'),
          value: 'client_use_2',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('client_use_3'),
          value: 'client_use_3',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('client_use_4'),
          value: 'client_use_4',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('client_use_5'),
          value: 'client_use_5',
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
          text: this.$i18n.t('odometer_date'),
          value: 'odometer_date',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('average_miles_per_month'),
          value: 'average_miles_per_month',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('projected_odometer'),
          value: 'projected_odometer',
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
          text: this.$i18n.t('in_service_date'),
          value: 'in_service_date',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('next_vehicle_number'),
          value: 'next_vehicle_number',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('driver_state_province'),
          value: 'driver_state_province',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('comment'),
          value: 'comment',
          class: 'report-column',
          divider: true,
          width: 200
        },
        {
          text: this.$i18n.t('policy'),
          value: 'policy',
          class: 'report-column',
          divider: true,
          width: 200
        },
        {
          text: this.$i18n.t('team_type'),
          value: 'team_type',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('team_number'),
          value: 'team_number',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('lease_termination_date'),
          value: 'lease_termination_date',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('closed_lease_type'),
          value: 'closed_lease_type',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('min_term'),
          value: 'min_term',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('max_term'),
          value: 'max_term',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('term'),
          value: 'term',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('rent'),
          value: 'rent',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('miles_allowed'),
          value: 'miles_allowed',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('excess_charge'),
          value: 'excess_charge',
          class: 'report-column'
        }
      ]
    },
    /**
     * Query Parameters
     */
    query () {
      return {
        report_type: this.report_type,
        report_months: this.report_months,
        miles_driven: this.miles_driven,
        and_or: this.and_or,
        months_in_service: this.months_in_service
      }
    }
  },
  methods: {
    /**
     * Vuex Actions
     */
    ...mapActions({
      fetchReport: 'reports/fetchReplacementAnalysisReport'
    })
  }
}
</script>
