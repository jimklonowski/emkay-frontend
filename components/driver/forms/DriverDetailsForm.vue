<template>
  <ValidationObserver ref="driverForm" v-slot="{ handleSubmit }" tag="form" @submit.prevent>
    <!-- <v-form @submit.prevent="handleSubmit(submitDriver)"> -->
    <v-card :loading="loading">
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
        <v-row v-if="vehicle_history.length > 0">
          <v-subheader>{{ $t('vehicle_history') }}</v-subheader>
          <v-col cols="12">
            <v-simple-table>
              <template #default>
                <thead>
                  <tr>
                    <th>{{ $t('vehicle_#') }}</th>
                    <th>{{ $t('year_make_model') }}</th>
                    <th>{{ $t('status') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(vehicle, v) in vehicle_history" :key="`vehicle-${v}`">
                    <td>{{ vehicle.vehicle_number }}</td>
                    <td>{{ [vehicle.model_year, vehicle.vehicle_make, vehicle.vehicle_model].filter(Boolean).join(' ') }}</td>
                    <td>{{ vehicle.status }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
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
                          @change="invalidateAddress"
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
                          @change="invalidateAddress"
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
                          @change="invalidateAddress"
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
                          @change="invalidateAddress"
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
                          @change="invalidateAddress"
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
                          @change="invalidateAddress"
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
          </v-col>
        </v-row>
      </v-card-text>
      <v-dialog v-model="address_dialog" max-width="750">
        <v-card>
          <v-toolbar flat>
            <v-toolbar-title v-text="$t('address')" />
            <v-spacer />
          </v-toolbar>
          <v-divider />
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-list>
                  <v-subheader>{{ $t('entered_address') }}</v-subheader>
                  <v-list-item>
                    <v-list-item-content>
                      <span v-text="model.address_1" />
                      <span v-text="model.address_2" />
                      <span v-text="cityStateZip(model.city, model.state_province, model.postal_code)" />
                      <span v-text="model.county" />
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col cols="12" md="6">
                <v-list>
                  <v-subheader>{{ $t('addresses_found') }}</v-subheader>
                  <template v-if="validated_addresses.length === 0">
                    <v-list-item>{{ $t('no_addresses_found') }}</v-list-item>
                  </template>
                  <template v-for="(address, a) in validated_addresses" v-else>
                    <v-list-item :key="`address-${a}`" :title="$t('use_this_address')" link @click="replaceAddress(address)">
                      <v-list-item-content>
                        <span v-text="address.streetAddress1" />
                        <span v-text="address.streetAddress2" />
                        <span v-text="cityStateZip(address.city, address.mainDivision, address.postalCode)" />
                        <span v-text="address.subDivision" />
                      </v-list-item-content>
                    </v-list-item>
                    <v-divider :key="`divider-${a}`" />
                  </template>
                  <template v-if="fuzzy_addresses.length > 0">
                    <!-- <v-subheader>Partial Addresses Found</v-subheader> -->
                    <template v-for="(address, a) in fuzzy_addresses">
                      <v-list-item :key="`faddress-${a}`" :title="$t('use_this_address')" link @click="replaceAddress(address)">
                        <v-list-item-content>
                          <span v-text="address.streetAddress1" />
                          <span v-text="address.streetAddress2" />
                          <span v-text="cityStateZip(address.city, address.mainDivision, address.postalCode)" />
                          <span v-text="address.subDivision" />
                        </v-list-item-content>
                      </v-list-item>
                      <v-divider :key="`fdivider-${a}`" />
                    </template>
                  </template>
                </v-list>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
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
  </ValidationObserver>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { SnotifyPosition } from 'vue-snotify'
// import { stateNameToAbbreviation } from '@/utility/geography'
import StateProvincePicker from '@/components/core/StateProvincePicker'
import { cityStateZip, stateNameToAbbreviation } from '@/utility/geography'
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
      // this.model = { ...this.driver }
      this.model = {
        reference_number: this.driver.reference_number,
        first_name: this.driver.first_name,
        last_name: this.driver.last_name,
        address_1: this.driver.address_1,
        address_2: this.driver.address_2,
        city: this.driver.city,
        state_province: this.driver.state_province,
        county: this.driver.county,
        postal_code: this.driver.postal_code,
        phone: this.driver.phone,
        email: this.driver.email,
        geocode: null,
        mobile: this.driver.mobile,
        employee_id: this.driver.employee_id,
        misc_1: this.driver.misc_1,
        misc_2: this.driver.misc_2,
        misc_3: this.driver.misc_3,
        misc_4: this.driver.misc_4,
        country: this.driver.driver_country
      }

      await this.fetchVehicleHistory({ driver: this.driverNumber })
    } else {
      this.model = { ...this.defaultModel }
    }
  },
  fetchOnServer: false,
  data: () => ({
    address_validated: false,
    address_dialog: false,
    fuzzy_addresses: [],
    loading: false,
    model: {},
    postal_code_search: '',
    postal_code_search_results: [],
    tab: 0,
    validated_addresses: []
  }),
  computed: {
    ...mapGetters({
      driver: 'drivers/getDriver',
      custom_labels: 'account/getCustomLabels',
      vehicle_history: 'drivers/getVehicleHistory'
    }),
    defaultModel () {
      return {
        reference_number: '',
        first_name: '',
        last_name: '',
        address_1: '',
        address_2: '',
        city: '',
        state_province: '',
        county: '',
        postal_code: '',
        phone: '',
        email: '',
        geocode: '',
        mobile: '',
        employee_id: '',
        misc_1: '',
        misc_2: '',
        misc_3: '',
        misc_4: '',
        country: ''
      }
    },
    title: vm => vm.driverNumber ? vm.$i18n.t('update_driver') : vm.$i18n.t('add_driver'),
    subtitle: vm => vm.driverNumber
  },
  watch: {
    async driverNumber () {
      await this.$fetch()
    }
  },
  methods: {
    ...mapActions({
      fetchDriver: 'drivers/fetchDriver',
      fetchVehicleHistory: 'driver/fetchVehicleHistory'
    }),
    cityStateZip,
    close () {
      this.$refs.driverForm.reset()
      this.invalidateAddress()
      this.$emit('close')
    },
    invalidateAddress () {
      this.address_validated = false
      this.validated_addresses = []
      this.fuzzy_addresses = []
    },
    replaceAddress (address) {
      this.model.geocode = address.taxAreaId
      this.model.address_1 = address.streetAddress1
      this.model.address_2 = address.streetAddress2
      this.model.city = address.city
      this.model.state_province = address.mainDivision
      this.model.postal_code = address.postalCode
      this.model.county = address.subDivision
      this.model.country = address.country
      this.address_validated = true
      this.address_dialog = false
    },
    async validateAddress () {
      try {
        const { data: { data } } = await this.$axios.post('/vertex/address', {
          postalAddress: {
            streetAddress1: this.model.address_1,
            streetAddress2: this.model.address_2,
            city: this.model.city,
            mainDivision: this.model.state_province,
            subDivision: this.model.county,
            postalCode: this.model.postal_code,
            country: this.model.driver_country
          },
          asOfDate: this.$moment().format('YYYY-MM-DD')
        })
        // iterate vertex results and populate array of validated addresses to present to user to choose from
        const results = data.lookupResults.filter(x => x.confidenceIndicator >= 50)
        results.forEach(result => {
          const taxAreaId = result.taxAreaId
          if (result.postalAddresses) {
            // if there is a postalAddresses array, we are good
            result.postalAddresses.forEach(address => {
              // add the taxareaid to the address object then add to list
              this.validated_addresses.push({
                ...address,
                taxAreaId
              })
            })
          } else {
            // vertex might have validated the city/state/country and given a taxareaid, but not validated the address.  create a fuzzy-result
            // it turns out that this is the case for canada
            const parts = result.jurisdictions.reduce((obj, item) => Object.assign(obj, { [item.jurisdictionLevel]: item.value }), {})
            const usa = parts.COUNTRY === 'UNITED STATES'
            const state_province = usa ? parts.STATE : parts.PROVINCE

            // keep the user-inputted address lines and postal code, but use the city/state/county from vertex. add the taxAreaId and add to fuzzy list
            this.fuzzy_addresses.push({
              streetAddress1: this.model.address_1,
              streetAddress2: this.model.address_2,
              city: parts.CITY,
              mainDivision: stateNameToAbbreviation(state_province),
              subDivision: parts.COUNTY,
              postalCode: this.model.postal_code,
              country: usa ? 'USA' : 'CAN',
              taxAreaId
            })
          }
        })
        this.address_dialog = true
      } catch (error) {
        this.$snotify.error(this.$i18n.t('address_error'), this.$i18n.t('error'), { position: SnotifyPosition.centerBottom })
      }
    },
    async submitDriver () {
      try {
        if (!this.address_validated) {
          await this.validateAddress()
          return
        }
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
