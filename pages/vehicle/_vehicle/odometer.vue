<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card outlined tile class="report">
          <v-toolbar flat color="transparent">
            <v-toolbar-title>{{ title }}</v-toolbar-title>
            <v-spacer />
            <!-- <v-text-field
              v-model="search"
              :label="$t('search')"
              background-color="transparent"
              prepend-inner-icon="mdi-magnify"
              clearable
              dense
              flat
              hide-details
              outlined
              rounded
              single-line
              solo
            /> -->

            <client-only>
              <!-- Report Odometer modal -->
              <v-dialog v-model="report_odometer_dialog" max-width="800px">
                <template #activator="{ on }">
                  <v-btn color="primary" class="mr-2" v-on="on">
                    <v-icon class="mr-2" v-text="'mdi-counter'" />
                    {{ $t('report_odometer') }}
                  </v-btn>
                </template>
                <ReportOdometerForm :vehicle="vehicle_number" />
              </v-dialog>

              <v-divider vertical inset class="mx-3" />

              <!-- Download as XLS button -->
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

          <v-skeleton-loader :loading="loading" type="table">
            <v-data-table
              :dense="items && !!items.length"
              :footer-props="{ itemsPerPageOptions: [10, 25, 50, 100, -1] }"
              :headers="headers"
              :items="items"
              :items-per-page="25"
              :loading="loading"
              :mobile-breakpoint="0"
              :search="search"
              :sort-by="['date']"
              :sort-desc="[true]"
              class="striped"
            >
              <template #item.date="{ item }">
                {{ item.date | date }}
              </template>
              <template #item.odometer="{ item }">
                {{ item.odometer | number }}
              </template>
            </v-data-table>
          </v-skeleton-loader>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
import { downloadFields } from '@/mixins/datatables'
import { updateQuery, vehicleRoute } from '@/mixins/routing'

import ReportOdometerForm from '@/components/vehicle-dashboard/forms/ReportOdometerForm'

export default {
  name: 'Odometer',
  components: {
    ReportOdometerForm
  },
  layout: 'vehicle-dashboard',
  mixins: [downloadFields, updateQuery, vehicleRoute],
  async asyncData ({ $moment, params, query, store }) {
    const vehicle = store.getters['vehicle-dashboard/getVehicleNumber']
    const report_length = 30
    const start = query.start || $moment().subtract(report_length, 'days').format('YYYY-MM-DD')
    const end = query.end || $moment().format('YYYY-MM-DD')
    // Fetch odometer data
    await store.dispatch('vehicle-dashboard/fetchOdometerHistory', { start, end, vehicle })
    return {
      start_dialog: false,
      start,
      end_dialog: false,
      end,
      panels_expanded: [0],
      search: '',
      report_odometer_dialog: false,
      uploading_odometer: false
    }
  },
  computed: {
    ...mapGetters({
      items: 'vehicle-dashboard/getOdometerHistory',
      loading: 'vehicle-dashboard/getOdometerLoading',
      vehicle_number: 'vehicle-dashboard/getVehicleNumber'
    }),
    columns () {
      return [
        'date',
        'odometer',
        'type'
      ]
    },
    headers () {
      return [
        {
          text: this.$i18n.t('odometer_date'),
          value: 'date',
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
          text: this.$i18n.t('reading_type'),
          value: 'type',
          class: 'report-column'
        }
      ]
    },
    query () {
      return { start: this.start, end: this.end }
    },
    title: vm => vm.$i18n.t('odometer_history')
  },
  head () {
    return {
      title: `${this.vehicle_number} - ${this.title}`,
      meta: [
        { hid: 'og:description', property: 'og:description', content: this.title }
      ]
    }
  },
  watchQuery: ['start', 'end']
}
</script>
