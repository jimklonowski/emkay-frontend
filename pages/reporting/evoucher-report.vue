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
        :sort-by="[0]"
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
        <template #item.vehicle_number="{ item }">
          <vehicle-number-button :vehicle-number="item.vehicle_number" />
        </template>
        <template #item.odometer="{ item }">
          {{ item.odometer | number }}
        </template>
        <template #item.last_pm_date="{ item }">
          {{ item.last_pm_date | date }}
        </template>
        <template #item.last_pm_odometer="{ item }">
          {{ item.last_pm_odometer | number }}
        </template>
        <template #item.next_pm_odometer="{ item }">
          {{ item.next_pm_odometer | number }}
        </template>
        <template #item.due_in_miles="{ item }">
          {{ item.due_in_miles | number }}
        </template>
      </v-data-table>
    </v-skeleton-loader>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex'
import { reportMixins } from '@/mixins/reports'
/**
 * eVoucher Report
 */
export default {
  name: 'EvoucherReport',
  mixins: [reportMixins],
  data: vm => ({
    title: vm.$i18n.t('evoucher_report')
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
        'odometer',
        'last_pm_date',
        'last_pm_odometer',
        'next_pm_odometer',
        'due_in_miles',
        'driver_last_name',
        'driver_first_name',
        'note'
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
          width: 200,
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
          text: this.$i18n.t('odometer'),
          value: 'odometer',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('last_pm_date'),
          value: 'last_pm_date',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('last_pm_odometer'),
          value: 'last_pm_odometer',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('next_pm_odometer'),
          value: 'next_pm_odometer',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('due_in_miles'),
          value: 'due_in_miles',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('note'),
          value: 'note',
          class: 'report-column',
          width: 250
        }
      ]
    }
  },
  methods: {
    /**
     * Vuex Actions
     */
    ...mapActions({
      fetchReport: 'reports/fetchEvoucherReport'
    })
  }
}
</script>
