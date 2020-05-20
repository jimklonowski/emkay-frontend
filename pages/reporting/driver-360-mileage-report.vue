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
        :sort-by="['full_name']"
        :sort-desc="[false]"
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
        <template #item.mileage_date="{ item }">
          {{ item.mileage_date | date }}
        </template>
      </v-data-table>
    </v-skeleton-loader>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex'
import { reportMixins } from '@/mixins/reports'
/**
 * Driver 360 Mileage Report
 */
export default {
  name: 'Driver360MileageReport',
  mixins: [reportMixins],
  data: vm => ({
    start_dialog: false,
    end_dialog: false,
    title: vm.$i18n.t('driver_360_mileage_report'),
    start: vm.$route.query.start || vm.$moment().subtract(30, 'days').format('YYYY-MM-DD'),
    end: vm.$route.query.end || vm.$moment().format('YYYY-MM-DD')
  }),
  computed: {
    /**
     * Datatable columns
     */
    columns () {
      return [
        'sequence_number',
        'driver_reference_number',
        'customer_number',
        'vehicle_number',
        'trip_mode',
        'mileage_date',
        'miles',
        'mileage_type',
        'from_company_name',
        'from_address',
        'from_city',
        'from_state_province',
        'from_postal_code',
        'to_company_name',
        'to_address',
        'to_city',
        'to_state_province',
        'to_postal_code',
        'mileage_notes',
        'last_name',
        'first_name',
        'full_name',
        'from_location',
        'to_location'
      ]
    },
    /**
     * Datatable headers
     */
    headers () {
      return [
        {
          text: this.$i18n.t('full_name'),
          value: 'full_name',
          class: 'report-column',
          divider: true,
          width: 200
        },
        {
          text: this.$i18n.t('driver_reference_number'),
          value: 'driver_reference_number',
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
          text: this.$i18n.t('mileage_date'),
          value: 'mileage_date',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('miles'),
          value: 'miles',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('mileage_type'),
          value: 'mileage_type',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('from_location'),
          value: 'from_location',
          class: 'report-column',
          divider: true,
          width: 250
        },
        {
          text: this.$i18n.t('to_location'),
          value: 'to_location',
          class: 'report-column',
          divider: true,
          width: 250
        },
        {
          text: this.$i18n.t('mileage_notes'),
          value: 'mileage_notes',
          class: 'report-column',
          width: 300
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
      fetchReport: 'reports/fetchDriver360MileageReport'
    })
  }
}
</script>
