<template>
  <v-card outlined class="report">
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
    <v-skeleton-loader :loading="$fetchState.pending" type="table">
      <v-data-table
        :footer-props="{ itemsPerPageOptions: [10, 25, 50, 100, -1] }"
        :headers="headers"
        :items="items"
        :items-per-page="25"
        :loading="$fetchState.pending"
        :mobile-breakpoint="0"
        :search="search"
        :sort-by="['vehicle_number']"
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
      </v-data-table>
    </v-skeleton-loader>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { downloadFields } from '@/mixins/datatables'
import { updateQuery } from '@/mixins/routing'
/**
 * Short Term Rental Detail Report
 */
export default {
  name: 'ShortTermRentalDetailReport',
  components: {
    'center-picker': () => import(/* webpackChunkName: "CenterPicker" */ '@/components/core/CenterPicker.vue')
  },
  mixins: [downloadFields, updateQuery],
  /**
   * Async Fetch
   * See: https://nuxtjs.org/api/pages-fetch#nuxt-gt-2-12
   */
  async fetch () {
    await this.fetchShortTermRentalDetailReport(this.query)
  },
  fetchOnServer: false, // https://nuxtjs.org/api/pages-fetch#options
  data: vm => ({
    start_dialog: false,
    end_dialog: false,
    centers_dialog: false,
    centers_selected: [],
    panels_expanded: [0],
    search: '',
    search_centers: '',
    title: vm.$i18n.t('short_term_rental_detail_report'),

    start: vm.$route.query.start || vm.$moment().subtract(30, 'days').format('YYYY-MM-DD'),
    end: vm.$route.query.end || vm.$moment().format('YYYY-MM-DD')
  }),
  computed: {
    /**
     * Vuex Getters
     */
    ...mapGetters({
      items: 'reports/getData',
      error: 'reports/getError'
    }),
    /**
     * Datatable columns
     */
    columns () {
      return [
        'voucher_number',
        'vehicle_number',
        'client_vehicle_number',
        'center_code',
        'center_name',
        'model_year',
        'vehicle_make',
        'vehicle_model',
        'vehicle_category',
        'start_date',
        'end_date',
        'days_in_rental',
        'auth_days',
        'number_of_days_ext',
        'number_of_ext',
        'last_auth_date',
        'days_past_auth_days',
        'driver_name',
        'status',
        'reason',
        'rental_cost',
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
          text: this.$i18n.t('voucher_number'),
          value: 'voucher_number',
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
          divider: true
        },
        {
          text: this.$i18n.t('vehicle_category'),
          value: 'vehicle_category',
          class: 'report-column',
          width: 150,
          divider: true
        },
        {
          text: this.$i18n.t('start_date'),
          value: 'start_date',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('end_date'),
          value: 'end_date',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('days_in_rental'),
          value: 'days_in_rental',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('auth_days'),
          value: 'auth_days',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('number_of_days_ext'),
          value: 'number_of_days_ext',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('number_of_ext'),
          value: 'number_of_ext',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('last_auth_date'),
          value: 'last_auth_date',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('days_past_auth_days'),
          value: 'days_past_auth_days',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('driver_name'),
          value: 'driver_name',
          class: 'report-column',
          width: 200,
          divider: true
        },
        {
          text: this.$i18n.t('status'),
          value: 'status',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('reason'),
          value: 'reason',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('rental_cost'),
          value: 'rental_cost',
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
  /**
   * Re-fetch data on query change
   */
  watch: {
    '$route.query': '$fetch'
  },
  methods: {
    /**
     * Vuex Actions
     */
    ...mapActions({
      fetchShortTermRentalDetailReport: 'reports/fetchShortTermRentalDetailReport'
    })
  },
  /**
   * Page Meta
   */
  head () {
    return {
      title: this.title,
      meta: [
        { hid: 'og:description', property: 'og:description', content: this.title }
      ]
    }
  }
}
</script>
