<template>
  <v-form @submit.prevent="validateAddress">
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-text-field v-model="inputAddress.streetAddress1" :label="$t('address_1')" outlined />
        </v-col>
        <v-col cols="12">
          <v-text-field v-model="inputAddress.streetAddress2" :label="$t('address_2')" outlined />
        </v-col>
        <v-col cols="6">
          <v-text-field v-model="inputAddress.city" :label="$t('city')" outlined />
        </v-col>
        <v-col cols="6">
          <v-text-field v-model="inputAddress.mainDivision" :label="$t('state_province')" outlined />
        </v-col>
        <v-col cols="6">
          <v-text-field v-model="inputAddress.postalCode" :label="$t('postal_code')" outlined />
        </v-col>
        <v-col cols="6">
          <v-text-field v-model="inputAddress.subDivision" :label="$t('county')" outlined />
        </v-col>
      </v-row>
      <v-row>
        <v-btn type="submit" :color="getColor">
          <v-icon class="mr-2" v-text="getIcon" />
          Validate
        </v-btn>
        <v-dialog v-model="dialog" max-width="850">
          <v-card>
            <v-toolbar flat>
              <v-toolbar-title>Address Corrections</v-toolbar-title>
              <v-spacer />
            </v-toolbar>
            <v-divider />
            <v-card-text class="d-flex">
              <v-list width="50%">
                <v-subheader>Entered Address:</v-subheader>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-subtitle v-text="$t('address_1')" />
                    <v-list-item-title v-text="inputAddress.streetAddress1" />
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-subtitle v-text="$t('address_2')" />
                    <v-list-item-title v-text="inputAddress.streetAddress2" />
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-subtitle v-text="[$t('city'), $t('state_province')].join(', ')" />
                    <v-list-item-title v-text="[inputAddress.city, inputAddress.mainDivision].join(', ')" />
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-subtitle v-text="[$t('postal_code'), $t('county')].join(' ')" />
                    <v-list-item-title v-text="[inputAddress.postalCode, inputAddress.subDivision].join(' ')" />
                  </v-list-item-content>
                </v-list-item>
              </v-list>
              <v-list v-if="returnedAddress === undefined" width="50%">
                <v-alert type="error">
                  No Valid Address Found
                </v-alert>
              </v-list>
              <v-list v-else width="50%">
                <v-subheader>Address Found:</v-subheader>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-subtitle v-text="$t('address_1')" />
                    <v-list-item-title v-text="returnedAddress.streetAddress1" />
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-subtitle v-text="$t('address_2')" />
                    <v-list-item-title v-text="returnedAddress.streetAddress2" />
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-subtitle v-text="[$t('city'), $t('state_province')].join(', ')" />
                    <v-list-item-title v-text="[returnedAddress.city, returnedAddress.mainDivision].join(', ')" />
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-subtitle v-text="[$t('postal_code'), $t('county')].join(' ')" />
                    <v-list-item-title v-text="[returnedAddress.postalCode, returnedAddress.subDivision].join(' ')" />
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-chip v-show="confidence !== undefined" :color="getColor">
                    Confidence Level {{ confidence }}
                  </v-chip>
                </v-list-item>
              </v-list>
            </v-card-text>
            <v-card-actions>
              <v-tooltip v-if="meta !== undefined" bottom>
                <template #activator="{ on }">
                  <v-icon class="mx-2 text--disabled" v-on="on" v-text="'mdi-help-circle-outline'" />
                </template>
                <span>Address validated by {{ meta.app }} in {{ meta['timeElapsed(ms)'] }} ms</span>
              </v-tooltip>
              <v-spacer />
              <v-btn text @click.stop="dialog = false" v-text="$t('cancel')" />
              <v-btn v-if="found" color="primary" depressed @click.stop="useReturnedAddress">
                Use Corrected Address
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </v-container>
    <pre>{{ returnedAddress }}</pre>
  </v-form>
</template>

<script>
export default {
  data: () => ({
    confidence: undefined,
    corrections_accepted: undefined,
    dialog: false,
    found: undefined,
    inputAddress: {
      streetAddress1: 'EMKAY, Inc',
      streetAddress2: '805 w thorndale avvv',
      city: 'Itasc',
      mainDivision: 'il',
      subDivision: '',
      postalCode: '60143',
      country: ''
    },
    meta: {},
    returnedAddress: undefined
  }),
  computed: {
    getColor () {
      switch (this.corrections_accepted) {
        case true: return 'success'
        case false: return 'error'
        default: return 'primary'
      }
    },
    getIcon () {
      switch (this.corrections_accepted) {
        case true: return 'mdi-check-circle'
        case false: return 'mdi-close-circle'
        default: return 'mdi-help-circle'
      }
    }
  },
  methods: {
    async validateAddress () {
      const { data: { data, meta } } = await this.$axios.post('/vertex/address', { postalAddress: this.inputAddress, asOfDate: '' })
      this.meta = meta
      const results = data.lookupResults
      const firstResult = results[0]
      if (firstResult === undefined || firstResult.postalAddresses === undefined) {
        this.found = false
        this.confidence = 0
        this.returnedAddress = undefined
        this.corrections_accepted = false
      } else {
        this.found = true
        this.confidence = Number(firstResult.confidenceIndicator)
        this.returnedAddress = firstResult.postalAddresses[0]
        this.corrections_accepted = undefined
      }
      this.dialog = true
    },
    useReturnedAddress () {
      console.log('use it')
      this.inputAddress = this.returnedAddress
      this.dialog = false
      this.corrections_accepted = true
    }
  }
}
</script>
