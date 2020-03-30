<template>
  <v-card class="report" flat>
    <v-toolbar color="transparent" flat>
      <v-toolbar-title>{{ $t('fuel_history') }}</v-toolbar-title>
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

      <!-- Download as XLS button -->
      <client-only>
        <v-divider vertical inset class="mx-3" />
        <download-excel :fields="downloadFields" :data="items" :name="exportName">
          <v-btn :title="`${$t('save')} .xls`" color="primary" large icon>
            <v-icon v-text="'mdi-cloud-download'" />
          </v-btn>
        </download-excel>
      </client-only>
    </v-toolbar>
    <v-data-table
      :dense="items && !!items.length"
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
      <template #top>
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
                        <v-btn text @click="$refs.start_dialog.save(start), $fetch()" v-text="$t('ok')" />
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
                        <v-btn text @click="$refs.end_dialog.save(end), $fetch()" v-text="$t('ok')" />
                      </v-date-picker>
                    </v-dialog>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-switch
                      v-model="use_bill_date"
                      :label="$t(`use_bill_date`)"
                      :loading="$fetchState.pending"
                      class="mt-1"
                      inset
                      @change="$fetch()"
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-divider />
      </template>
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

      <template #item.product="{ item }">
        <v-chip :outlined="!$vuetify.theme.dark" x-small>
          {{ item.product }}
        </v-chip>
      </template>

      <template #item.product_type="{ item }">
        <v-chip :outlined="!$vuetify.theme.dark" x-small>
          {{ item.product_type }}
        </v-chip>
      </template>

      <template #item.unit_price="{ item }">
        {{ item.unit_price | currency(3, 3) }}
      </template>

      <template #item.amount="{ item }">
        {{ item.amount | currency }}
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { downloadFields } from '@/mixins/datatables'
/**
 * Displays Fuel History for vehicle in vuex
 */
export default {
  mixins: [downloadFields],
  /**
   * Fetch fuel history
   */
  async fetch () {
    await this.fetchFuelHistory({
      ...this.query,
      vehicle: this.vehicle_number
    })
  },
  data: vm => ({
    end_dialog: false,
    panels_expanded: [0],
    search: '',
    start_dialog: false,

    use_bill_date: vm.$route.query.use_bill_date || false,
    start: vm.$route.query.start || vm.$moment().subtract(30, 'days').format('YYYY-MM-DD'),
    end: vm.$route.query.end || vm.$moment().format('YYYY-MM-DD')
  }),
  computed: {
    // Vuex Getters
    ...mapGetters({
      items: 'vehicle-dashboard/getFuelHistory',
      loading: 'vehicle-dashboard/getFuelLoading',
      vehicle_number: 'vehicle-dashboard/getVehicleNumber'
    }),
    // Datatable columns
    columns () {
      return [
        'service_date',
        'bill_date',
        'fuel_company_name',
        'product',
        'product_type',
        'unit_price',
        'quantity',
        'amount'
      ]
    },
    // Datatable headers
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
          text: this.$i18n.t('fuel_company_name'),
          value: 'fuel_company_name',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('product'),
          value: 'product',
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
          text: this.$i18n.t('unit_price'),
          value: 'unit_price',
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
    // Route Query Parameters
    query () {
      return {
        start: this.start,
        end: this.end,
        use_bill_date: this.use_bill_date
      }
    }
  },
  mounted () {
    // clear query on mount
    if (this.$route.query) {
      this.$router.push({ query: undefined })
    }
  },
  methods: {
    // Vuex Actions
    ...mapActions({
      fetchFuelHistory: 'vehicle-dashboard/fetchFuelHistory'
    })
  }
}
</script>
