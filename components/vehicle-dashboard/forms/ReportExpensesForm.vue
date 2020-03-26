<template>
  <v-card>
    <v-card-title>{{ $t('report_expenses') }}</v-card-title>
    <v-card-subtitle>{{ vehicle_number }}</v-card-subtitle>
    <v-divider />
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12" lg="6">
            <ValidationObserver ref="addExpenseForm" v-slot="{ handleSubmit: handleSubmitExpense }">
              <v-form @submit.prevent="handleSubmitExpense(addExpense)">
                <v-card flat>
                  <v-card-title>Add expenses as needed and then submit.</v-card-title>
                  <v-card-text class="pa-0">
                    <v-container>
                      <v-row dense>
                        <v-col cols="12">
                          <ValidationProvider v-slot="{ errors }" :name="$t('category')" rules="required">
                            <v-select
                              v-model="expense.category"
                              :error-messages="errors"
                              :items="categories"
                              :label="$t('category')"
                              :menu-props="{ offsetY: true }"
                              outlined
                              dense
                            />
                          </ValidationProvider>
                        </v-col>
                        <v-col cols="12">
                          <v-textarea
                            v-model="expense.description"
                            :label="$t('description')"
                            outlined
                            dense
                          />
                        </v-col>
                        <v-col cols="6">
                          <v-text-field
                            v-model="expense.quantity"
                            :label="$t('quantity')"
                            type="number"
                            autocomplete="off"
                            outlined
                            dense
                          />
                        </v-col>
                        <v-col cols="6">
                          <ValidationProvider v-slot="{ errors }" :name="$t('amount')" rules="required">
                            <v-text-field
                              v-model="expense.amount"
                              :error-messages="errors"
                              :label="$t('amount')"
                              type="number"
                              prefix="$ "
                              autocomplete="off"
                              outlined
                              dense
                            />
                          </ValidationProvider>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn
                      color="primary"
                      type="submit"
                      block
                      outlined
                      rounded
                      @click="handleSubmitExpense(addExpense)"
                    >
                      {{ $t('add_expense') }}
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-form>
            </ValidationObserver>
          </v-col>
          <v-col cols="12" lg="6">
            <vehicle-detail-panel />
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-divider />
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12">
            <ValidationObserver ref="submitExpensesForm" v-slot="{ handleSubmit, invalid }">
              <v-form @submit.prevent="handleSubmit(submitExpenses)">
                <v-card flat>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12">
                          <v-data-table
                            :headers="headers"
                            :items="expenses"
                            :items-per-page="10"
                            :mobile-breakpoint="0"
                            hide-default-footer
                          >
                            <template #no-data>
                              <div class="text-left">
                                {{ $t('no_expenses_added') }}
                              </div>
                            </template>
                            <template #item.category="{ item }">
                              {{ $t(item.category) }}
                            </template>
                            <template #item.description="{ item }">
                              {{ item.description || '--' }}
                            </template>
                            <template #item.quantity="{ item }">
                              {{ item.quantity || '--' }}
                            </template>
                            <template #item.amount="{ item }">
                              {{ item.amount | currency }}
                            </template>
                            <template #item.action="{ item }">
                              <v-btn icon color="error" @click="removeExpense(item)">
                                <v-icon v-text="'mdi-close'" />
                              </v-btn>
                            </template>
                          </v-data-table>
                        </v-col>
                      </v-row>
                      <v-scale-transition>
                        <v-row v-show="hasExpenses">
                          <v-col cols="6">
                            <ValidationProvider v-slot="{ errors }" :name="$t('odometer_reading')" rules="required">
                              <v-text-field
                                v-model="odometer_reading"
                                :label="$t('odometer_reading')"
                                :error-messages="errors"
                                autocomplete="off"
                                type="number"
                                dense
                                outlined
                                rounded
                              />
                            </ValidationProvider>
                          </v-col>
                          <v-col cols="6">
                            <v-dialog
                              ref="expense_date_dialog"
                              v-model="expense_date_dialog"
                              :return-value.sync="expense_date"
                              persistent
                              width="290px"
                              @keydown.esc="expense_date_dialog = false"
                            >
                              <template #activator="{ on }">
                                <ValidationProvider v-slot="{ errors }" :name="$t('expense_date')" rules="required">
                                  <v-text-field
                                    :value="$moment(expense_date).format('L')"
                                    :label="$t('expense_date')"
                                    :error-messages="errors"
                                    prepend-inner-icon="mdi-calendar"
                                    dense
                                    outlined
                                    rounded
                                    readonly
                                    v-on="on"
                                  />
                                </ValidationProvider>
                              </template>
                              <v-date-picker
                                v-model="expense_date"
                                :locale="$moment.locale()"
                                color="primary"
                                header-color="primary"
                                scrollable
                              >
                                <v-spacer />
                                <v-btn text @click="expense_date_dialog = false" v-text="$t('cancel')" />
                                <v-btn text @click="$refs.expense_date_dialog.save(expense_date)" v-text="$t('ok')" />
                              </v-date-picker>
                            </v-dialog>
                          </v-col>
                        </v-row>
                      </v-scale-transition>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer />
                    <v-btn
                      :loading="loading"
                      :disabled="!hasExpenses || invalid"
                      color="primary"
                      type="submit"
                      block
                      depressed
                      rounded
                    >
                      {{ $t('submit') }}
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-form>
            </ValidationObserver>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { SnotifyPosition } from 'vue-snotify'
import { sleep } from '@/utility/helpers'
import VehicleDetailPanel from '@/components/vehicle-dashboard/panels/VehicleDetailPanel'
export default {
  components: {
    VehicleDetailPanel
  },
  data: vm => ({
    expense_date_dialog: false,
    loading: false,
    expense: { ...vm.defaultExpense },

    expense_date: vm.$moment().format('YYYY-MM-DD'),
    odometer_reading: null,
    expenses: []
  }),
  computed: {
    ...mapGetters({
      vehicle_number: 'vehicle-dashboard/getVehicleNumber'
    }),
    defaultExpense () {
      return {
        category: '',
        description: '',
        quantity: '',
        amount: ''
      }
    },
    categories () {
      return [
        { text: this.$i18n.t('accident_and_subrogation'), value: 'accident_and_subrogation' },
        { text: this.$i18n.t('depreciation'), value: 'depreciation' },
        { text: this.$i18n.t('gas_expense'), value: 'gas_expense' },
        { text: this.$i18n.t('insurance_deduction'), value: 'insurance_deduction' },
        { text: this.$i18n.t('insurance_liability'), value: 'insurance_liability' },
        { text: this.$i18n.t('insurance_physical'), value: 'insurance_physical' },
        { text: this.$i18n.t('license_and_title'), value: 'license_and_title' },
        { text: this.$i18n.t('license_tax'), value: 'license_tax' },
        { text: this.$i18n.t('maintenance_expense'), value: 'maintenance_expense' },
        { text: this.$i18n.t('oil_change_expense'), value: 'oil_change_expense' },
        { text: this.$i18n.t('parking_toll_storage'), value: 'parking_toll_storage' },
        { text: this.$i18n.t('personal_credit'), value: 'personal_credit' },
        { text: this.$i18n.t('tax_expense'), value: 'tax_expense' },
        { text: this.$i18n.t('tire_expense'), value: 'tire_expense' },
        { text: this.$i18n.t('violation_fedex_misc'), value: 'violation_fedex_misc' }
      ]
    },
    hasExpenses: vm => vm.expenses.length > 0,
    headers () {
      return [
        {
          text: this.$i18n.t('category'),
          value: 'category',
          class: 'report-column',
          width: '25%'
        },
        {
          text: this.$i18n.t('description'),
          value: 'description',
          class: 'report-column',
          width: '25%'
        },
        {
          text: this.$i18n.t('quantity'),
          value: 'quantity',
          class: 'report-column',
          width: '16%'
        },
        {
          text: this.$i18n.t('amount'),
          value: 'amount',
          class: 'report-column',
          width: '25%'
        },
        {
          text: this.$i18n.t('action'),
          value: 'action',
          class: 'report-column',
          sortable: false,
          width: '9%'
        }
      ]
    }
  },
  methods: {
    addExpense () {
      this.expenses.push({ ...this.expense })
      this.expense = { ...this.defaultExpense }

      // reset form validation after clearing form
      // https://github.com/logaretm/vee-validate/issues/2576#issuecomment-572425643
      requestAnimationFrame(() => this.$refs.addExpenseForm.reset())
    },
    removeExpense (item) {
      this.expenses.splice(this.expenses.indexOf(item), 1)
    },
    async submitExpenses () {
      try {
        this.loading = true
        await sleep(3000)
      } catch (error) {
        this.$snotify.error('saving error', this.$i18n.t('error'), { position: SnotifyPosition.centerBottom })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
