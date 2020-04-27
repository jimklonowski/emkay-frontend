<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-text-field v-model="postal_code" :label="$t('postal_code')" />
      </v-col>
      <v-col cols="12">
        <v-btn @click="lookupZipCode">
          Validate
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Test',
  data: () => ({
    postal_code: ''
  }),
  methods: {
    async lookupZipCode () {
      const { data: { data } } = await this.$axios.post('/vertex/address', {
        postalAddress: { postalCode: this.postal_code },
        asOfDate: this.$moment().format('YYYY-MM-DD')
      })
      debugger
      console.log(data)
    }
  }
}
</script>
