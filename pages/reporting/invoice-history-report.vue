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
        :sort-by="['date']"
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
        <template #item.date="{ item }">
          {{ item.date | date }}
        </template>
        <template #item.cycle="{ item }">
          {{ cycleName(item.cycle) }}
        </template>
        <template #item.type="{ item }">
          {{ typeName(item.type) }}
        </template>
        <template #item.download="{ item }">
          <v-btn color="primary" small :href="`${$axios.defaults.baseURL}/reports/invoice-reprint?month=${item.month}&year=${item.year}&bill_date=${$moment(item.date).format('MM-DD-YYYY')}&cycle=${item.cycle}&billing_type=${item.type}&type=pdf&download=true`">
            PDF
          </v-btn>
          <v-btn color="primary" small :href="`${$axios.defaults.baseURL}/reports/invoice-reprint?month=${item.month}&year=${item.year}&bill_date=${$moment(item.date).format('MM-DD-YYYY')}&cycle=${item.cycle}&billing_type=${item.type}&type=csv&download=true`">
            CSV
          </v-btn>
          {{ item.download }}
        </template>
      </v-data-table>
    </v-skeleton-loader>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex'
import { reportMixins } from '@/mixins/reports'
/**
 * Invoice History Report
 */
export default {
  name: 'InvoiceHistoryReport',
  mixins: [reportMixins],
  data: vm => ({
    start_dialog: false,
    end_dialog: false,
    title: vm.$i18n.t('invoice_history_report'),

    start: vm.$route.query.start || vm.$moment().subtract(180, 'days').format('YYYY-MM-DD'),
    end: vm.$route.query.end || vm.$moment().format('YYYY-MM-DD')
  }),
  computed: {
    /**
     * Datatable columns
     */
    columns () {
      return [
        'date',
        'description',
        'cycle',
        'type'
      ]
    },
    /**
     * Datatable headers
     */
    headers () {
      return [
        {
          text: this.$i18n.t('date'),
          value: 'date',
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
          text: this.$i18n.t('cycle'),
          value: 'cycle',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('type'),
          value: 'type',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('download'),
          value: 'download',
          class: 'report-column',
          align: 'center'
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
    ...mapActions({
      fetchReport: 'reports/fetchInvoiceHistoryReport'
    }),
    cycleName (cycle) {
      switch (cycle) {
        case '3': return 'Closeout'
        case '4': return 'Rental'
        case '8': return 'FMS'
        default: return cycle
      }
    },
    typeName (type) {
      switch (type) {
        case 'M': return this.$i18n.t('monthly')
        case 'W': return this.$i18n.t('weekly')
        default: return type
      }
    }
  }
}
</script>
