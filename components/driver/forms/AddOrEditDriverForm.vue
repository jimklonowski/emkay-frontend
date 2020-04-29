<template>
  <ValidationObserver ref="driverForm" v-slot="{ handleSubmit }" tag="form" @submit.prevent>
    <!-- <v-form @submit.prevent="handleSubmit(submitDriver)"> -->
    <v-card>
      <v-toolbar color="primary" dark flat tile>
        <v-toolbar-title class="font-lato">
          {{ title }}
        </v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="close">
          <v-icon v-text="'mdi-close'" />
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-tabs v-model="tab" grow hide-slider>
          <v-tab>{{ $t('driver_details') }}</v-tab>
          <v-tab>{{ $t('custom_labels') }}</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <ValidationProvider v-slot="{ errors }" :name="$t('employee_id')" rules="alpha_dash|max:9">
                    <v-text-field
                      v-model="model.employee_id"
                      :label="$t('employee_id')"
                      :error-messages="errors"
                      dense
                      outlined
                    />
                  </ValidationProvider>
                </v-col>
                <v-col cols="12" md="6">
                  <ValidationProvider v-slot="{ errors }" :name="$t('driver_first_name')" rules="required|max:25">
                    <v-text-field
                      v-model="model.first_name"
                      :label="$t('driver_first_name')"
                      :error-messages="errors"
                      dense
                      outlined
                    />
                  </ValidationProvider>
                </v-col>
                <v-col cols="12" md="6">
                  <ValidationProvider v-slot="{ errors }" :name="$t('driver_last_name')" rules="required|max:25">
                    <v-text-field
                      v-model="model.last_name"
                      :label="$t('driver_last_name')"
                      :error-messages="errors"
                      dense
                      outlined
                    />
                  </ValidationProvider>
                </v-col>
                <v-col cols="12">
                  <ValidationProvider v-slot="{ errors }" :name="$t('address_1')" rules="max:30">
                    <v-text-field
                      v-model="model.address_1"
                      :label="$t('driver_address_1')"
                      :error-messages="errors"
                      dense
                      outlined
                    />
                  </ValidationProvider>
                </v-col>
                <v-col cols="12">
                  <ValidationProvider v-slot="{ errors }" :name="$t('address_2')" rules="max:30">
                    <v-text-field
                      v-model="model.address_2"
                      :label="$t('driver_address_2')"
                      :error-messages="errors"
                      dense
                      outlined
                    />
                  </ValidationProvider>
                </v-col>
                <v-col cols="12">
                  <ValidationProvider v-slot="{ errors }" :name="$t('postal_code')" rules="required|max:10">
                    <v-text-field
                      v-model="model.postal_code"
                      :label="$t('driver_postal_code')"
                      :error-messages="errors"
                      dense
                      outlined
                    />
                  </ValidationProvider>
                </v-col>
                <v-col cols="12" md="6">
                  <ValidationProvider v-slot="{ errors }" :name="$t('driver_city')" rules="max:25">
                    <v-text-field
                      v-model="model.city"
                      :label="$t('driver_city')"
                      :error-messages="errors"
                      dense
                      outlined
                    />
                  </ValidationProvider>
                </v-col>
                <v-col cols="12" md="6">
                  <ValidationProvider v-slot="{ errors }" :name="$t('driver_state_province')" rules="alpha">
                    <state-province-picker
                      v-model="model.state_province"
                      :label="$t('driver_state_province')"
                      :error-messages="errors"
                      dense
                      outlined
                    />
                  </ValidationProvider>
                </v-col>
                <v-col cols="12">
                  <ValidationProvider v-slot="{ errors }" :name="$t('driver_county')" rules="max:25">
                    <v-text-field
                      v-model="model.county"
                      :label="$t('driver_county')"
                      :error-messages="errors"
                      dense
                      outlined
                    />
                  </ValidationProvider>
                </v-col>
                <v-col cols="12">
                  <ValidationProvider v-slot="{ errors }" :name="$t('driver_email_address')" rules="email|max:60">
                    <v-text-field
                      v-model="model.email"
                      :label="$t('driver_email_address')"
                      :error-messages="errors"
                      type="email"
                      dense
                      outlined
                    />
                  </ValidationProvider>
                </v-col>
                <v-col cols="12" md="6">
                  <ValidationProvider v-slot="{ errors }" :name="$t('driver_phone')" rules="digits:10">
                    <v-text-field
                      v-model="model.phone"
                      :label="$t('driver_phone')"
                      :error-messages="errors"
                      type="tel"
                      dense
                      outlined
                    />
                  </ValidationProvider>
                </v-col>
                <v-col cols="12" md="6">
                  <ValidationProvider v-slot="{ errors }" :name="$t('driver_mobile')" rules="digits:10">
                    <v-text-field
                      v-model="model.mobile"
                      :label="$t('driver_mobile')"
                      :error-messages="errors"
                      type="tel"
                      dense
                      outlined
                    />
                  </ValidationProvider>
                </v-col>
              </v-row>
            </v-container>
          </v-tab-item>
          <v-tab-item>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <ValidationProvider v-slot="{ errors }" :name="$t('driver_misc_1')" rules="max:40">
                    <v-text-field
                      v-model="model.misc_1"
                      :label="custom_labels.driver_use_label_1 || $t('driver_use_label_1')"
                      :error-messages="errors"
                      dense
                      outlined
                    />
                  </ValidationProvider>
                </v-col>
                <v-col cols="12">
                  <ValidationProvider v-slot="{ errors }" :name="$t('driver_misc_2')" rules="max:40">
                    <v-text-field
                      v-model="model.misc_2"
                      :label="custom_labels.driver_use_label_2 || $t('driver_use_label_2')"
                      :error-messages="errors"
                      dense
                      outlined
                    />
                  </ValidationProvider>
                </v-col>
                <v-col cols="12">
                  <ValidationProvider v-slot="{ errors }" :name="$t('driver_misc_3')" rules="max:40">
                    <v-text-field
                      v-model="model.misc_3"
                      :label="custom_labels.driver_use_label_3 || $t('driver_use_label_3')"
                      :error-messages="errors"
                      dense
                      outlined
                    />
                  </ValidationProvider>
                </v-col>
                <v-col cols="12">
                  <ValidationProvider v-slot="{ errors }" :name="$t('driver_misc_4')" rules="max:40">
                    <v-text-field
                      v-model="model.misc_4"
                      :label="custom_labels.driver_use_label_4 || $t('driver_use_label_4')"
                      :error-messages="errors"
                      dense
                      outlined
                    />
                  </ValidationProvider>
                </v-col>
              </v-row>
            </v-container>
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="primary"
          type="submit"
          :loading="loading"
          block
          depressed
          @click="handleSubmit(submitDriver)"
        >
          {{ $t('submit') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  <!-- </v-form> -->
  </ValidationObserver>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { SnotifyPosition } from 'vue-snotify'
// import { stateNameToAbbreviation } from '@/utility/geography'
import StateProvincePicker from '@/components/core/StateProvincePicker'
export default {
  components: { StateProvincePicker },
  props: {
    driverNumber: {
      type: String,
      default: ''
    }
  },
  async fetch () {
    if (this.driverNumber) {
      await this.fetchDriver({ driver: this.driverNumber })
      // copy fetched driver into form model
      this.model = { ...this.driver }
    } else {
      this.model = { ...this.defaultModel }
    }
  },
  fetchOnServer: false,
  data: () => ({
    loading: false,
    postal_code_search: '',
    postal_code_search_results: [],
    tab: 0,
    model: {}
  }),
  computed: {
    ...mapGetters({
      driver: 'drivers/getDriver',
      custom_labels: 'account/getCustomLabels'
    }),
    defaultModel () {
      return {
        employee_id: '',
        reference_number: '',
        first_name: '',
        last_name: '',
        postal_code: '',
        address_1: '',
        address_2: '',
        city: '',
        state_province: '',
        county: '',
        country: '',
        email: '',
        phone: '',
        mobile: '',
        misc_1: '',
        misc_2: '',
        misc_3: '',
        misc_4: ''
      }
    },
    title: vm => vm.driverNumber ? vm.$i18n.t('edit_driver') : vm.$i18n.t('add_driver'),
    subtitle: vm => vm.driverNumber
  },
  watch: {
    async driverNumber () {
      await this.$fetch()
    }
  },
  methods: {
    ...mapActions({
      fetchDriver: 'drivers/fetchDriver'
    }),
    close () {
      this.$refs.driverForm.reset()
      this.$emit('close')
    },
    // async lookupZipCode () {
    //   try {
    //     this.loading = true
    //     this.postal_code_search_results = []
    //     const { data: { data } } = await this.$axios.post('/vertex/address', {
    //       postalAddress: {
    //         postalCode: this.postal_code_search,
    //         country: this.model.country
    //       },
    //       asOfDate: this.$moment().format('YYYY-MM-DD')
    //     })
    //     const results = data.lookupResults.filter(x => x.confidenceIndicator >= 70)
    //     results.forEach(result => {
    //       const parts = result.jurisdictions.reduce((obj, item) => Object.assign(obj, { [item.jurisdictionLevel]: item.value }), {})
    //       // add a city/state result if it contains at least CITY/STATE/COUNTRY and confidenceIndicator sufficiently high
    //       if (
    //         Object.prototype.hasOwnProperty.call(parts, 'COUNTRY') &&
    //         Object.prototype.hasOwnProperty.call(parts, 'CITY') &&
    //         (Object.prototype.hasOwnProperty.call(parts, 'STATE') || Object.prototype.hasOwnProperty.call(parts, 'PROVINCE'))
    //       ) {
    //         const state_province = parts.COUNTRY === 'UNITED STATES' ? parts.STATE : parts.PROVINCE
    //         this.postal_code_search_results.push({
    //           confidence: result.confidenceIndicator,
    //           country: parts.COUNTRY,
    //           city: parts.CITY,
    //           postal_code: this.model.postal_code,
    //           state_province: stateNameToAbbreviation(state_province),
    //           county: parts.COUNTY
    //         })
    //       }
    //     })
    //   } catch (error) {
    //     this.$snotify.error('ERROR!', error.message)
    //   } finally {
    //     this.loading = false
    //   }
    // },
    async submitDriver () {
      try {
        this.loading = true
        if (this.driverNumber) {
          // updating existing driver
          await this.$axios.post('/drivers/update', this.model)
        } else {
          // adding new driver
          await this.$axios.post('/drivers/add', this.model)
        }
        // fire the saved event to inform any listening parents that the driver was saved.  vehicle dashboard uses this to refresh the driver in vuex
        this.$emit('saved')
        this.$snotify.success(this.$i18n.t('driver_saved'), this.$i18n.t('success'), { position: SnotifyPosition.centerBottom })
      } catch (error) {
        this.$snotify.error(error, this.$i18n.t('error'), { position: SnotifyPosition.centerBottom })
        console.error(error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
