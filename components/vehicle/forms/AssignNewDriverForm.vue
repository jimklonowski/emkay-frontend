<template>
  <ValidationObserver ref="vehicleForm" v-slot="{ handleSubmit }" tag="form" @submit.prevent>
    <v-card>
      <v-toolbar color="primary" flat dark>
        <v-toolbar-title>{{ $t('assign_new_driver') }}</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <ValidationProvider v-slot="{ errors }" :name="$t('driver_name')" rules="required">
                <v-autocomplete
                  v-model="driver"
                  :label="$t('driver_name')"
                  :items="drivers"
                  :search-input.sync="search"
                  :error-messages="errors"
                  item-value="driver_number"
                  item-text="driver_name"
                  dense
                  outlined
                  return-object
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
          :loading="loading"
          block
          depressed
          @click="handleSubmit(assignNewDriver)"
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
export default {
  props: {
    vehicleNumber: {
      type: String,
      required: true
    }
  },
  async fetch () {
    await this.fetchDrivers()
  },
  fetchOnServer: false,
  data: () => ({
    driver: null,
    loading: false,
    search: ''
  }),
  computed: {
    ...mapGetters({
      driver_list: 'drivers/getDrivers'
    }),
    drivers () {
      return this.driver_list.map(x => (
        {
          driver_name: [x.last_name, x.first_name].filter(Boolean).join(', '),
          driver_number: x.reference_number
        }
      )).filter(x => !!x.driver_name)
    }
  },
  methods: {
    ...mapActions({
      fetchDrivers: 'drivers/fetchDrivers'
    }),
    async assignNewDriver () {
      try {
        this.loading = true
        const { data: { success, message } } = await this.$axios.post('vehicle/reassign', { vehicle_number: this.vehicleNumber, driver_number: this.driver })
        if (!success) { throw new Error(message) }
        this.$emit('saved')
      } catch (error) {
        this.$snotify.error(error.message, this.$i18n.t('error'), { position: SnotifyPosition.centerBottom })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
