<template>
  <v-card outlined tile class="report">
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
                      prepend-icon="mdi-calendar"
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
                      prepend-icon="mdi-calendar"
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
            </v-row>
          </v-container>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-divider />

    <!-- Report Content -->
    <v-data-table
      :dense="items && !!items.length"
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
      <template #item.accident_date="{ item }">
        {{ item.accident_date | datetime }}
      </template>
      <template #item.claim_amount="{ item }">
        {{ item.claim_amount | currency }}
      </template>
      <template #item.subrogation_amount="{ item }">
        {{ item.subrogation_amount | currency }}
      </template>
      <template #item.actions="{ item }">
        <v-dialog v-model="claim_dialog" max-width="1200" scrollable>
          <template #activator="{ on }">
            <v-btn color="primary" small text tile v-on="on">
              <v-icon class="mr-2" v-text="'mdi-eye'" />
              {{ $t('view') }}
            </v-btn>
          </template>
          <AccidentClaim :claim-number="item.claim_number" @close-dialog="claim_dialog = false" />
        </v-dialog>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { downloadFields } from '@/mixins/datatables'
import AccidentClaim from '@/components/vehicle-dashboard/panels/AccidentClaim'
export default {
  components: {
    AccidentClaim
  },
  mixins: [downloadFields],
  /**
   * Fetch Accident History
   */
  async fetch () {
    await this.fetchAccidentHistory(this.query)
  },
  data: vm => ({
    end_dialog: false,
    panels_expanded: [0],
    claim_dialog: false,
    search: '',
    start_dialog: false,
    title: vm.$i18n.t('accident_history'),

    start: vm.$route.query.start || vm.$moment().subtract(30, 'days').format('YYYY-MM-DD'),
    end: vm.$route.query.end || vm.$moment().format('YYYY-MM-DD')
  }),
  computed: {
    /**
     * Vuex Getters
     */
    ...mapGetters({
      items: 'vehicle-dashboard/getAccidentHistory',
      vehicle_number: 'vehicle-dashboard/getVehicleNumber'
    }),
    /**
     * Datatable columns
     */
    columns () {
      return [
        'accident_date',
        'claim_number',
        'claim_type',
        'claim_amount',
        'subrogation_amount',
        ''
      ]
    },
    /**
     * Datatable headers
     */
    headers () {
      return [
        {
          text: this.$i18n.t('accident_date'),
          value: 'accident_date',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('claim_number'),
          value: 'claim_number',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('claim_type'),
          value: 'claim_type',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('claim_amount'),
          value: 'claim_amount',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('subrogation_amount'),
          value: 'subrogation_amount',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('actions'),
          value: 'actions',
          class: 'report-column'
        }
      ]
    },
    /**
     * Request Parameters
     */
    query () {
      return {
        start: this.start,
        end: this.end,
        vehicle: this.vehicle_number
      }
    }
  },
  methods: {
    /**
     * Vuex Actions
     */
    ...mapActions({
      fetchAccidentHistory: 'vehicle-dashboard/fetchAccidentHistory'
    })
  }
}
</script>
