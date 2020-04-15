<template>
  <v-card>
    <v-card-text class="pa-0">
      <v-stepper v-model="step" vertical class="elevation-0 transparent">
        <!-- Step 1: Load Profile or New -->
        <v-stepper-step :complete="step > 1" step="1" class="font-roboto">
          {{ step1Header }}
        </v-stepper-step>
        <v-stepper-content step="1" class="ma-0 pa-0">
          <v-container>
            <v-row>
              <v-col cols="12">
                <my-reports-profiles />
              </v-col>
              <v-col cols="12">
                <v-btn @click="startNewReport">
                  Or create a new report
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-stepper-content>
        <!-- Step 2: Pick Report Type -->
        <v-stepper-step :complete="step > 2" step="2" class="font-roboto">
          {{ step2Header }}
        </v-stepper-step>
        <v-stepper-content step="2">
          <v-list color="transparent" class="font-roboto-condensed" dense shaped>
            <v-list-item-group v-model="model.report_type">
              <v-list-item v-for="(report, r) in report_types" :key="`type-${r}`" :value="report.type" active-class="primary--text text--accent-4" @click="selectReportType">
                <v-list-item-avatar>
                  <v-icon v-text="report.icon" />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ $t(report.type) }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-stepper-content>
        <!-- Step 3: Pick Columns -->
        <v-stepper-step :complete="step > 3" step="3" class="font-roboto">
          {{ step3Header }}
        </v-stepper-step>
        <v-stepper-content step="3">
          <v-list color="transparent" class="font-roboto-condensed" dense shaped subheader>
            <v-list-item-group v-model="model.columns" class="row no-gutters" multiple>
              <v-col v-for="(column_group, g) in column_groups" :key="`group-${g}`" cols="12" sm="6" md="4">
                <v-toolbar color="primary" class="mx-1 font-lato my-2" flat dark dense>
                  <v-toolbar-title>{{ $t(column_group.group) }}</v-toolbar-title>
                </v-toolbar>
                <template v-for="(column, c) in column_group.columns">
                  <v-list-item :key="`col-${g}-${c}`" :value="column" active-class="primary--text text--accent-4" class="mx-1">
                    <template #default="{ active }">
                      <v-list-item-content>{{ $t(column) }}</v-list-item-content>
                      <v-list-item-action>
                        <v-checkbox :input-value="active" :true-value="column" />
                      </v-list-item-action>
                    </template>
                  </v-list-item>
                </template>
              </v-col>
            </v-list-item-group>
          </v-list>
        </v-stepper-content>
        <!-- Step 4: Pick Scope -->
        <v-stepper-step :complete="step > 4" step="4" class="font-roboto">
          {{ step4Header }}
        </v-stepper-step>
        <v-stepper-content step="4">
          <v-subheader v-text="$t('filters')" />
          <v-row>
            <v-col cols="12" sm="6">
              <v-menu
                ref="start_dialog"
                :close-on-content-click="false"
                :return-value.sync="model.start"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template #activator="{ on }">
                  <v-text-field
                    :value="$moment(model.start).format('L')"
                    :label="$t('start_date')"
                    prepend-inner-icon="mdi-calendar"
                    outlined
                    dense
                    readonly
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="model.start"
                  no-title
                  scrollable
                >
                  <v-spacer />
                  <v-btn text @click="start_dialog = false" v-text="$t('cancel')" />
                  <v-btn text @click="$refs.start_dialog.save(model.start)" v-text="$t('ok')" />
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" sm="6">
              <v-menu
                ref="end_dialog"
                :close-on-content-click="false"
                :return-value.sync="model.end"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template #activator="{ on }">
                  <v-text-field
                    :value="$moment(model.end).format('L')"
                    :label="$t('end_date')"
                    prepend-inner-icon="mdi-calendar"
                    outlined
                    dense
                    readonly
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="model.end"
                  no-title
                  scrollable
                >
                  <v-spacer />
                  <v-btn text @click="end_dialog = false" v-text="$t('cancel')" />
                  <v-btn text @click="$refs.end_dialog.save(model.end)" v-text="$t('ok')" />
                </v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
          <v-subheader v-text="$t('centers')" />
          <v-row>
            <center-picker v-model="model.centers" :return-value.sync="model.centers" :return-object="false" />
          </v-row>
        </v-stepper-content>
        <!-- Step 5: The Report -->
        <v-stepper-step :complete="step === 5" step="5" class="font-roboto" complete-icon="mdi-finance">
          {{ $t('my_report') }}
        </v-stepper-step>
        <v-stepper-content step="5" class="ma-0 pa-0">
          <v-card flat>
            <v-divider />
            <v-toolbar color="transparent" flat>
              <v-toolbar-title>{{ model.report_title }}</v-toolbar-title>
              <v-spacer />
              <v-text-field
                v-model="search"
                :label="$t('search')"
                prepend-inner-icon="mdi-magnify"
                background-color="transparent"
                class="mr-1"
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
              <excel-downloader :download-fields="downloadFields" :items="report_data" :export-name="exportName" />
            </v-toolbar>
            <v-divider />
            <!-- Datatable -->
            <v-skeleton-loader :loading="report_loading" type="table">
              <v-data-table
                :items="report_data"
                :headers="report_headers"
                :items-per-page="25"
                :loading="report_loading"
                :mobile-breakpoint="0"
                :search="search"
                outlined
                class="striped"
              />
            </v-skeleton-loader>
          </v-card>
        </v-stepper-content>
      </v-stepper>
    </v-card-text>
    <v-card-actions>
      <v-btn tabindex="-1" text color="error" @click="reset">
        {{ $t('reset') }}
      </v-btn>
      <v-spacer />
      <v-btn v-show="step > 1" text class="mr-2" @click="step--">
        {{ $t('previous_step') }}
      </v-btn>
      <v-btn v-show="step < 5" color="primary" depressed @click="step++">
        {{ $t('next_step') }}
      </v-btn>
      <!-- Save Dialog -->
      <v-dialog v-model="save_dialog" max-width="650" scrollable>
        <template #activator="{ on }">
          <v-btn v-show="step === 5" color="accent" large v-on="on">
            <v-icon class="mr-2" v-text="'mdi-content-save'" />
            {{ $t('save_configuration') }}
          </v-btn>
        </template>
        <ValidationObserver ref="saveReportForm" v-slot="{ handleSubmit }" tag="form" @submit.prevent>
          <v-card :loading="save_loading">
            <v-card-title>{{ $t('save_report') }}</v-card-title>
            <v-divider />
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <ValidationProvider v-slot="{ errors }" :name="$t('report_title')" rules="required|max:40">
                      <v-text-field
                        v-model="model.report_title"
                        :counter="40"
                        :error-messages="errors"
                        :label="$t('report_title')"
                        prepend-icon="mdi-content-save-edit"
                        clearable
                        dense
                        outlined
                        autocomplete="off"
                      />
                    </ValidationProvider>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-checkbox v-model="model.auto_send" :label="$t('auto_send')" />
                  </v-col>
                  <v-col v-show="model.auto_send" cols="12">
                    <v-radio-group
                      v-model="model.report_schedule"
                      :label="$t('schedule')"
                      background-color="transparent"
                      color="primary"
                      dense
                      mandatory
                      rounded
                      row
                    >
                      <v-radio :label="$t('daily')" value="daily" />
                      <v-radio :label="$t('weekly')" value="weekly" />
                      <v-radio :label="$t('monthly')" value="monthly" />
                    </v-radio-group>
                  </v-col>
                  <v-col v-show="model.auto_send" cols="12">
                    <v-combobox
                      v-model="model.email_recipients"
                      :items="suggested_emails"
                      :label="$t('email_recipients')"
                      :search-input.sync="email_input"
                      prepend-inner-icon="mdi-email-plus"
                      clearable
                      dense
                      multiple
                      outlined
                      small-chips
                      @blur="email_input = ''"
                    >
                      <template #prepend-item>
                        <v-subheader v-text="$t('select_recipients_or_add')" />
                        <v-divider />
                      </template>
                      <template #no-data>
                        <v-list-item>
                          <v-list-item-action class="align-center">
                            <v-list-item-action-text>
                              {{ $t('press') }}
                            </v-list-item-action-text>
                            <kbd>{{ $t('enter') }}</kbd>
                          </v-list-item-action>
                          <v-list-item-content>
                            <span>
                              <v-chip class="mx-2 font-weight-medium">
                                {{ email_input }}
                              </v-chip>
                            </span>
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                      <template #selection="{ attrs, item, select, selected }">
                        <v-chip
                          v-bind="attrs"
                          :input-value="selected"
                          close
                          @click="select"
                          @click:close="removeEmail(item)"
                        >
                          <strong>{{ item }}</strong>
                        </v-chip>
                      </template>
                    </v-combobox>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-btn
                :loading="save_loading"
                type="submit"
                color="primary"
                block
                small
                depressed
                @click="handleSubmit(saveReport)"
                v-text="$t('submit')"
              />
            </v-card-actions>
          </v-card>
        </ValidationObserver>
      </v-dialog>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { sleep } from '@/utility/helpers'
export default {
  layout: 'my-reports',
  components: {
    'center-picker': () => import(/* webpackChunkName: "CenterPicker" */ '@/components/core/CenterPicker.vue'),
    'excel-downloader': () => import(/* webpackChunkName: "ExcelDownloader" */ '@/components/core/ExcelDownloader.vue'),
    'my-reports-profiles': () => import(/* webpackChunkName: "MyReportsProfiles" */ '@/components/reporting/MyReportsProfiles.vue')
  },
  data: vm => ({
    email_input: '',
    end_dialog: false,
    save_dialog: false,
    save_loading: false,
    search: '',
    start_dialog: false,
    step: 1,

    // Model
    model: {
      id: null,
      auto_send: false,
      centers: [],
      columns: [],
      email_recipients: [],
      report_schedule: 'monthly',
      report_title: '',
      report_type: null,
      start: vm.$moment().subtract(1, 'years').format('YYYY-MM-DD'),
      end: vm.$moment().format('YYYY-MM-DD')
    }
  }),
  computed: {
    ...mapGetters({
      column_groups: 'my-reports/getColumnGroups',
      profile: 'my-reports/getProfile',
      report_data: 'my-reports/getReportData',
      report_loading: 'my-reports/getReportLoading',
      report_types: 'my-reports/getReportTypes',
      suggested_emails: 'my-reports/getSuggestedEmails'
    }),
    downloadFields: vm => Object.assign({}, ...vm.model.columns.map(column => ({ [vm.$i18n.t(column)]: column }))),
    report_headers () {
      return this.model.columns.map((column, index) => {
        return {
          text: this.$i18n.t(column),
          value: column,
          class: 'report-column',
          divider: index < this.model.columns.length - 1
        }
      })
    },
    step1Header: vm => vm.$i18n.t('my_reports'),
    step2Header: vm => (vm.step <= 2) ? vm.$i18n.t('report_type') : `${vm.$i18n.t('report_type')}: ${vm.$i18n.t(vm.model.report_type)}`,
    step3Header: vm => (vm.step <= 3) ? vm.$i18n.t('report_columns') : `${vm.$i18n.tc('columns_selected', vm.model.columns.length)}`,
    step4Header: vm => (vm.step <= 4) ? vm.$i18n.t('report_scope') : `${vm.$i18n.t('report_scope')}: ${vm.$moment(vm.model.start).format('L')} - ${vm.$moment(vm.model.end).format('L')}`,
    defaultModel () {
      return {
        id: null,
        auto_send: false,
        centers: [],
        columns: [],
        email_recipients: [],
        report_schedule: 'monthly',
        report_title: '',
        report_type: null,
        start: this.$moment().subtract(1, 'years').format('YYYY-MM-DD'),
        end: this.$moment().format('YYYY-MM-DD')
      }
    },
    exportName () {
      const extension = '.xls'
      const acct = this.$auth.user.account
      const title = this.model.report_title
      const date = this.$moment().format()
      const filename = [acct, title, date].filter(Boolean).join('-').concat(extension).replace(/\s/g, '')
      return filename
    }
  },
  watch: {
    async 'model.report_type' () {
      this.model.report_type && await this.fetchColumns(this.model.report_type)
    },
    profile () {
      if (this.profile.id) {
        console.log(`Profile changed to ${this.profile.id}`)
        this.model = { ...this.defaultModel, ...this.profile }
        this.step = 5
      }
    },
    async step () {
      if (this.step === 5) {
        try {
          await this.generateReport(this.model)
        } catch (error) {
          debugger
        }
      }
    }
  },
  methods: {
    ...mapActions({
      clearProfile: 'my-reports/clearProfile',
      fetchColumns: 'my-reports/fetchColumnGroups',
      generateReport: 'my-reports/fetchReportData'
    }),
    removeEmail (email) {
      this.model.email_recipients.splice(this.model.email_recipients.indexOf(email), 1)
      this.model.email_recipients = [...this.model.email_recipients]
    },
    async saveReport () {
      try {
        this.save_loading = true
        await sleep(3000)
        console.log('save!')
      } catch (error) {
        console.error(error)
      } finally {
        this.save_loading = false
      }
    },
    selectReportType () {
      this.model.columns = []
      this.step = 3
    },
    startNewReport () {
      console.log('Starting new profile.')
      this.clearProfile()
      this.model = { ...this.defaultModel }
      this.step = 2
    },
    reset () {
      console.log('Starting Over')
      this.clearProfile()
      this.model = { ...this.defaultModel }
      this.step = 1
    }
  }
}
</script>
