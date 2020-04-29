<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-dialog v-model="dialog" max-width="850" scrollable>
          <template #activator="{ on }">
            <v-btn v-on="on">
              Edit Driver
            </v-btn>
          </template>
          <add-or-edit-driver-form driver-number="271967" @close="dialog = false" />
        </v-dialog>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-btn-toggle v-model="country" mandatory @change="reset, postal_code = ''">
          <v-btn value="USA">
            USA
          </v-btn>
          <v-btn value="CAN">
            CAN
          </v-btn>
        </v-btn-toggle>
        <v-subheader>Look Up City, State/Province, County with Postal Code</v-subheader>
        <!-- <v-text-field v-model="postal_code" :label="$t('postal_code')" hint="Look Up" persistent-hint outlined>
          <template #message="{ message }">
            <v-btn x-small text @click="lookupZipCode">
              {{ message }}
            </v-btn>
          </template>
        </v-text-field> -->
      </v-col>
      <v-col cols="12">
        <v-autocomplete
          :label="$t('postal_code')"
          :menu-props="{ bottom: true, offsetY: true }"
          :search-input.sync="postal_code"
          :items="postal_code_results"
          item-value="postal_code"
          item-text="postal_code"
          no-filter
          outlined
        >
          <template #item="{ item, on }">
            <v-list-item link v-on="on" @click="populateAddressForm(item)">
              <v-list-item-content>
                {{ item.city }}, {{ item.state_province }} {{ item.postal_code }} {{ item.county }}
              </v-list-item-content>
              <v-list-item-action>
                <v-list-item-action-text>{{ item.confidence }} %</v-list-item-action-text>
              </v-list-item-action>
            </v-list-item>
          </template>
        </v-autocomplete>
      </v-col>
      <v-col cols="12">
        <v-text-field v-model="address_1" :label="$t('address_1')" outlined />
      </v-col>
      <v-col cols="12">
        <v-text-field v-model="address_2" :label="$t('address_2')" outlined />
      </v-col>
      <v-col cols="12">
        <v-text-field v-model="city" :label="$t('city')" outlined />
      </v-col>
      <v-col cols="12">
        <v-text-field v-model="state_province" :label="$t('state_province')" outlined />
      </v-col>
      <v-col cols="12">
        <v-text-field v-model="county" :label="$t('county')" outlined />
      </v-col>
      <v-col cols="12">
        <v-btn :loading="loading" block @click="validateAddress">
          <v-icon class="mr-2" v-text="'mdi-check-circle'" />
          Validate Address
        </v-btn>
      </v-col>
      <v-col v-if="validated" cols="12">
        <v-alert v-if="postal_address_results.length === 0" type="error">
          No addresses found
        </v-alert>
        <pre v-else>{{ postal_address_results }}</pre>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AddOrEditDriverForm from '@/components/driver/forms/AddOrEditDriverForm'
export default {
  name: 'Test',
  components: { AddOrEditDriverForm },
  data: () => ({
    country: 'USA',
    postal_code: '',
    address_1: '',
    address_2: '',
    city: '',
    state_province: '',
    county: '',
    postal_code_results: [],
    postal_address_results: [],
    postal_address_errors: [],
    validated: false,
    loading: false,
    dialog: false
  }),
  watch: {
    async postal_code () {
      if (this.postal_code && this.postal_code.length >= 5) {
        await this.lookupZipCode()
      }
    }
  },
  methods: {
    async lookupZipCode () {
      this.postal_code_results = []
      try {
        const { data: { data, meta } } = await this.$axios.post('/vertex/address', {
          postalAddress: {
            postalCode: this.postal_code,
            country: this.country
          },
          asOfDate: this.$moment().format('YYYY-MM-DD')
        })
        console.log(meta)
        // const resultArray = data.lookupResults
        const resultArray = data.lookupResults.filter(x => x.confidenceIndicator >= 70)
        resultArray.forEach(result => {
          // extract the parts
          const parts = result.jurisdictions.reduce((obj, item) => Object.assign(obj, { [item.jurisdictionLevel]: item.value }), {})

          // create a result if we at least have a city, state/province, country
          if (Object.prototype.hasOwnProperty.call(parts, 'CITY') && (Object.prototype.hasOwnProperty.call(parts, 'STATE') || Object.prototype.hasOwnProperty.call(parts, 'PROVINCE')) && Object.prototype.hasOwnProperty.call(parts, 'COUNTRY')) {
            this.postal_code_results.push({
              confidence: result.confidenceIndicator,
              country: parts.COUNTRY,
              city: parts.CITY,
              postal_code: this.postal_code,
              state_province: parts.COUNTRY === 'UNITED STATES' ? parts.STATE : parts.PROVINCE,
              county: parts.COUNTY
            })
          }
        })
      } catch (error) {
        this.$snotify.error('ERROR!', error)
      }
      // debugger
    },
    populateAddressForm (item) {
      this.reset()
      this.city = item.city
      this.state_province = item.state_province
      this.county = item.county
    },
    reset () {
      this.city = ''
      this.state_province = ''
      this.county = ''
      this.address_1 = ''
      this.address_2 = ''
    },
    async validateAddress () {
      try {
        this.postal_address_results = []
        this.loading = true
        this.validated = false
        const { data: { data, meta } } = await this.$axios.post('/vertex/address', {
          postalAddress: {
            streetAddress1: this.address_1,
            streetAddress2: this.address_2,
            city: this.city,
            mainDivision: this.state_province,
            subDivision: this.county,
            postalCode: this.postal_code,
            country: this.country
          },
          asOfDate: this.$moment().format('YYYY-MM-DD')
        })
        console.log(meta)
        console.log(data)
        const resultArray = data.lookupResults.filter(x => x.confidenceIndicator >= 70)
        resultArray.forEach(result => {
          result.postalAddresses && result.postalAddresses.forEach(address => {
            this.postal_address_results.push({
              address_1: address.streetAddress1,
              address_2: address.streetAddress2,
              city: address.city,
              state_province: address.mainDivision,
              postal_code: address.postalCode,
              county: address.subDivision,
              country: address.country
            })
          })
        })
      } catch (error) {
        this.$snotify.error(error, 'ERROR!')
      } finally {
        this.loading = false
        this.validated = true
      }
    }
  }
}
</script>
