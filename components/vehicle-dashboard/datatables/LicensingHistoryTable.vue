<template>
  <v-card class="report" outlined tile>
    <v-toolbar color="transparent" flat>
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
    <v-data-table
      :footer-props="{ itemsPerPageOptions: [10, 25, 50, 100, -1] }"
      :headers="headers"
      :items="items"
      :items-per-page="25"
      :loading="$fetchState.pending"
      :mobile-breakpoint="0"
      :search="search"
      :sort-by="['expiration_date']"
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
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { downloadFields } from '@/mixins/datatables'
export default {
  mixins: [downloadFields],
  /**
   * Fetch Licensing History
   */
  async fetch () {
    await this.fetchLicensingHistory(this.query)
  },
  data: vm => ({
    end_dialog: false,
    panels_expanded: [0],
    search: '',
    start_dialog: false,
    title: vm.$i18n.t('licensing_history'),

    start: vm.$route.query.start || vm.$moment().subtract(30, 'days').format('YYYY-MM-DD'),
    end: vm.$route.query.end || vm.$moment().format('YYYY-MM-DD')
  }),
  computed: {
    /**
     * Vuex Getters
     */
    ...mapGetters({
      items: 'vehicle-dashboard/getLicensingHistory',
      vehicle_number: 'vehicle-dashboard/getVehicleNumber'
    }),
    /**
     * Datatable columns
     */
    columns () {
      return [
        'expiration_date',
        'license_plate_number',
        'license_plate_state_province',
        'sticker_number',
        'title',
        'status',
        'needs'
      ]
    },
    /**
     * Datatable headers
     */
    headers () {
      return [
        {
          text: this.$i18n.t('expiration_date'),
          value: 'expiration_date',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('license_plate_number'),
          value: 'license_plate_number',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('license_plate_state_province'),
          value: 'license_plate_state_province',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('sticker_number'),
          value: 'sticker_number',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('title'),
          value: 'title',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('status'),
          value: 'status',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('needs'),
          value: 'needs',
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
      fetchLicensingHistory: 'vehicle-dashboard/fetchLicensingHistory'
    })
  }
}
</script>
