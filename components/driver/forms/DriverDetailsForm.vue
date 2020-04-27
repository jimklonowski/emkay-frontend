<template>
  <ValidationObserver ref="driverForm" v-slot="{ handleSubmit }">
    <v-form autocomplete="off" @submit.prevent="handleSubmit(submitDriver)">
      <v-card :loading="loading" outlined>
        <v-card-title>
          <slot name="title">
            {{ title }}
            <v-spacer />
            <v-btn icon @click="close">
              <v-icon v-text="'mdi-close'" />
            </v-btn>
          </slot>
        </v-card-title>
        <v-card-subtitle>
          <slot name="subtitle">
            {{ subtitle }}
          </slot>
        </v-card-subtitle>
        <v-divider />
        <v-card-text>
          <v-container>
            <v-row dense>
              <v-col cols="12" lg="6">
                <v-subheader class="overline">
                  {{ $t('driver_details') }}
                </v-subheader>
                <v-row class="mx-1" dense>
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
                  <v-col cols="6">
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
                  <v-col cols="6">
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
                  <v-col cols="12">
                    <ValidationProvider v-slot="{ errors }" :name="$t('driver_address_1')" rules="max:30">
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
                    <ValidationProvider v-slot="{ errors }" :name="$t('driver_address_2')" rules="max:30">
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
                    <!-- <state-province-picker v-model="model.state_province" autocomplete="off" @change="invalidateAddress" /> -->
                    <v-autocomplete
                      v-model="model.state_province"
                      :items="states_provinces"
                      dense
                      outlined
                      @change="invalidateAddress"
                    />
                    <!-- <ValidationProvider v-slot="{ errors }" :name="$t('driver_state_province')" rules="alpha">
                      <v-text-field
                        v-model="model.state_province"
                        :label="$t('driver_state_province')"
                        :error-messages="errors"
                        dense
                        outlined
                        @change="invalidateAddress"
                      />
                    </ValidationProvider> -->
                  </v-col>
                  <v-col cols="12" md="6">
                    <ValidationProvider v-slot="{ errors }" :name="$t('driver_postal_code')" rules="max:10">
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
                  <v-col cols="6">
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
                  <v-col cols="6">
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
              </v-col>
              <v-col cols="12" lg="6">
                <v-subheader class="overline">
                  {{ $t('driver_labels') }}
                </v-subheader>
                <v-row class="mx-1" dense>
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
                <v-row dense>
                  <v-col cols="12">
                    <slot name="history" />
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-dialog v-model="address_dialog" max-width="850">
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
                    <v-subheader>Entered Address</v-subheader>
                    <v-list-item>
                      <v-list-item-content>
                        <span v-text="model.address_1" />
                        <span v-text="model.address_2" />
                        <span v-text="cityStateZip(model.city, model.state_province, model.postal_code)" />
                        <span v-text="model.county" />
                        <!-- <p v-text="model.country" /> -->
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-col>
                <v-col cols="12" md="6">
                  <v-list>
                    <v-subheader>Full Addresses Found</v-subheader>
                    <template v-if="validated_addresses.length === 0">
                      <v-list-item>
                        <v-list-item-content>No addresses found</v-list-item-content>
                      </v-list-item>
                      <!-- <v-divider /> -->
                    </template>
                    <template v-for="(address, a) in validated_addresses" v-else>
                      <v-list-item :key="`address-${a}`" title="Use this address" link @click="replaceAddress(address)">
                        <v-list-item-content>
                          <span v-text="address.streetAddress1" />
                          <span v-text="address.streetAddress2" />
                          <span v-text="cityStateZip(address.city, address.mainDivision, address.postalCode)" />
                          <span v-text="address.subDivision" />
                          <!-- <p v-text="address.country" /> -->
                        </v-list-item-content>
                      </v-list-item>
                      <v-divider :key="`divider-${a}`" />
                    </template>
                    <template v-if="fuzzy_addresses.length > 0">
                      <v-subheader>Partial Addresses Found</v-subheader>
                      <template v-for="(address, a) in fuzzy_addresses">
                        <v-list-item :key="`faddress-${a}`" title="Use this address" link @click="fuzzyReplace(address)">
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
        <v-divider />
        <slot name="actions">
          <v-card-actions>
            <v-spacer />
            <v-fade-transition>
              <span v-show="hasChanges" v-if="driverId" class="font-italic text--disabled caption px-2">{{ $t('unsaved_changes') }}</span>
            </v-fade-transition>
            <!-- <v-btn :disabled="!hasChanges" type="submit" color="primary" depressed>
              {{ $t('save') }}
            </v-btn> -->
            <v-btn type="submit" color="primary" depressed>
              {{ $t('save') }}
            </v-btn>
          </v-card-actions>
        </slot>
      </v-card>
    </v-form>
  </ValidationObserver>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { SnotifyPosition } from 'vue-snotify'
import isEqual from 'lodash.isequal'
import state_abbreviations from '@/assets/json/state_abbreviations'
import province_abbreviations from '@/assets/json/province_abbreviations'
export default {
  props: {
    driverId: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    address_dialog: false,
    address_validated: false,
    loading: false,
    model: {},
    fuzzy_addresses: [],
    validated_addresses: []
  }),
  computed: {
    ...mapGetters({
      custom_labels: 'account/getCustomLabels',
      driver: 'drivers/getDriver',
      vehicle_history: 'drivers/getVehicleHistory'
    }),
    states: () => Object.entries(state_abbreviations).map(([value, text]) => ({ text, value })),
    provinces: () => Object.entries(province_abbreviations).map(([value, text]) => ({ text, value })),
    states_provinces () {
      const list = []
      list.push({ header: 'USA', divider: true })
      list.push(...this.states)
      list.push({ header: 'CAN', divider: true })
      list.push(...this.provinces)
      return list
    },
    defaultItem () {
      return {
        reference_number: '',
        last_name: '',
        first_name: '',
        address_1: '',
        address_2: '',
        city: '',
        state_province: '',
        postal_code: '',
        county: '',
        driver_country: '',
        phone: '',
        mobile: '',
        email: '',
        employee_id: '',
        misc_1: '',
        misc_2: '',
        misc_3: '',
        misc_4: '',
        vehicle_number: ''
      }
    },
    title: vm => vm.driverId ? vm.$i18n.t('edit_driver') : vm.$i18n.t('add_driver'),
    subtitle: vm => vm.driverId,
    hasChanges: vm => !isEqual(vm.model, vm.driver)
  },
  watch: {
    async driverId () {
      console.log(`DriverId changed: ${this.driverId}`)
      await this.populateModel(this.driverId)
    }
  },
  async mounted () {
    await this.populateModel(this.driverId)
  },
  methods: {
    ...mapActions({
      initialize: 'drivers/initDriver',
      addDriver: 'drivers/addDriver',
      updateDriver: 'drivers/updateDriver'
    }),
    stateAbbreviationToName (abbreviation) {
      const item = this.states.find(x => x.value === abbreviation) || this.provinces.find(x => x.value === abbreviation)
      return item.text
    },
    stateNameToAbbreviation (name) {
      const item = this.states.find(x => x.text.toUpperCase() === name.toUpperCase()) || this.provinces.find(x => x.text.toUpperCase() === name.toUpperCase())
      return item.value
    },
    cityStateZip (city, state, zip) {
      const city_state = [city, state].filter(Boolean).join(', ')
      return [city_state, zip].filter(Boolean).join(' ')
    },
    async populateModel (id) {
      if (id) {
        try {
          console.log(`Populating form model for editing driver ${id}`)
          await this.initialize({ driver: id })
          this.model = { ...this.driver }
        } catch (error) {
          this.$nuxt.error({ statusCode: 404, message: error.message })
        }
      } else {
        console.log('Populating form model for adding new driver')
        this.model = { ...this.defaultItem }
      }
    },
    async close () {
      await this.populateModel(this.driverId)
      this.$refs.driverForm.reset()
      this.$emit('close')
    },
    replaceAddress (address) {
      this.address_dialog = false
      // // copy the clicked-on address into the form
      // // i dont like the vertex responses, need to figure out the best way to do this
      this.model.address_1 = address.streetAddress1
      this.model.address_2 = address.streetAddress2
      this.model.city = address.city
      this.model.state_province = address.mainDivision
      this.model.postal_code = address.postalCode
      this.model.county = address.subDivision
      this.model.country = address.country

      this.address_validated = true
    },
    fuzzyReplace (address) {
      this.address_dialog = false
      this.model.city = address.city
      this.model.state_province = this.stateNameToAbbreviation(address.mainDivision)
      this.model.county = address.subDivision
      // this.model.postal_code =
      this.address_validated = true
    },
    invalidateAddress () {
      this.address_validated = false
      this.validated_addresses = []
      this.fuzzy_addresses = []
    },
    async validateAddress () {
      this.invalidateAddress()
      const { data: { data } } = await this.$axios.post('/vertex/address', {
        postalAddress: {
          streetAddress1: this.model.address_1,
          streetAddress2: this.model.address_2,
          city: this.model.city,
          mainDivision: this.stateAbbreviationToName(this.model.state_province),
          subDivision: this.model.county,
          postalCode: this.model.postal_code,
          country: this.model.driver_country
        },
        asOfDate: this.$moment().format('YYYY-MM-DD')
      })
      // console.log(meta)
      const results = data.lookupResults
      results.forEach(result => {
        if (result === undefined) {
          console.error('Address not found!')
        } else if (result.postalAddresses !== undefined) {
          this.validated_addresses.push(...result.postalAddresses)
        } else {
          // no postal addresses found, check individual jurisdictions validations
          // const jurisdictions = result.jurisdictions.map(x => { return { [x.jurisdictionLevel]: x.value } })
          const jurisdictions = result.jurisdictions.reduce((obj, item) => Object.assign(obj, { [item.jurisdictionLevel]: item.value }), {})

          const fuzzy_address = {
            streetAddress1: this.model.address_1,
            streetAddress2: this.model.address_2,
            city: jurisdictions.CITY,
            mainDivision: jurisdictions.COUNTRY === 'UNITED STATES' ? jurisdictions.STATE : jurisdictions.PROVINCE,
            subDivision: jurisdictions.COUNTY,
            country: jurisdictions.COUNTRY === 'UNITED STATES' ? 'USA' : 'CAN'
          }
          this.fuzzy_addresses.push(fuzzy_address)
        }
      })
      this.address_dialog = true
    },
    async submitDriver () {
      try {
        this.loading = true
        if (!this.address_validated) {
          this.loading = false
          await this.validateAddress()
          return
        }
        if (this.driverId) {
          // updating existing driver
          await this.updateDriver(this.model)
        } else {
          // adding new driver
          await this.addDriver(this.model)
        }
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
