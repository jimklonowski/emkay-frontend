<template>
  <v-card tile>
    <v-card-title>{{ $t('request_quote') }}</v-card-title>
    <ValidationObserver ref="quoteForm" v-slot="{ handleSubmit }">
      <v-form @submit.prevent="handleSubmit(requestQuote)">
        <v-container>
          <v-row>
            <v-col cols="12" lg="6">
              <ValidationProvider v-slot="{ errors }" :name="$t('transport_method')" vid="transport_method" rules="required">
                <v-radio-group
                  v-model="model.transport_method"
                  :label="$t('transport_method')"
                  :error-messages="errors"
                >
                  <v-radio :label="$t('driven')" value="driven" />
                  <v-radio :label="$t('trucked')" value="trucked" />
                </v-radio-group>
              </ValidationProvider>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-subheader v-text="$t('origin')" />
              <v-row>
                <v-col cols="12" xl="5">
                  <ValidationProvider v-slot="{ errors }" :name="$t('city')" vid="origin_city" rules="required">
                    <v-text-field
                      v-model="model.origin_city"
                      :error-messages="errors"
                      :label="$t('city')"
                      outlined
                    />
                  </ValidationProvider>
                </v-col>
                <v-col cols="7" lg="6" xl="3">
                  <ValidationProvider v-slot="{ errors }" :name="$t('state_province')" vid="origin_state_province" rules="required">
                    <v-text-field
                      v-model="model.origin_state_province"
                      :error-messages="errors"
                      :label="$t('state_province')"
                      outlined
                    />
                  </ValidationProvider>
                </v-col>
                <v-col cols="5" lg="6" xl="4">
                  <ValidationProvider v-slot="{ errors }" :name="$t('postal_code')" vid="origin_postal_code" rules="required">
                    <v-text-field
                      v-model="model.origin_postal_code"
                      :error-messages="errors"
                      :label="$t('postal_code')"
                      outlined
                    />
                  </ValidationProvider>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-subheader v-text="$t('destination')" />
                  <v-row>
                    <v-col cols="12" xl="5">
                      <ValidationProvider v-slot="{ errors }" :name="$t('city')" vid="destination_city" rules="required">
                        <v-text-field
                          v-model="model.destination_city"
                          :error-messages="errors"
                          :label="$t('city')"
                          outlined
                        />
                      </ValidationProvider>
                    </v-col>
                    <v-col cols="7" lg="6" xl="3">
                      <ValidationProvider v-slot="{ errors }" :name="$t('state_province')" vid="destination_state_province" rules="required">
                        <v-text-field
                          v-model="model.destination_state_province"
                          :error-messages="errors"
                          :label="$t('state_province')"
                          outlined
                        />
                      </ValidationProvider>
                    </v-col>
                    <v-col cols="5" lg="6" xl="4">
                      <ValidationProvider v-slot="{ errors }" :name="$t('postal_code')" vid="destination_postal_code" rules="required">
                        <v-text-field
                          v-model="model.destination_postal_code"
                          :error-messages="errors"
                          :label="$t('postal_code')"
                          outlined
                        />
                      </ValidationProvider>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-btn tabindex="-1" text @click.stop="reset" v-text="$t('reset')" />
                  <v-btn :loading="loading" type="submit" color="success darken-1" v-text="$t('request_quote')" />
                </v-col>
              </v-row>
            </v-col>
            <!-- Show Quote -->
            <v-col cols="12" lg="6">
              <v-scale-transition>
                {{ quote }}
              </v-scale-transition>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </ValidationObserver>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { SnotifyPosition } from 'vue-snotify'
export default {
  data: () => ({
    model: {},
    loading: false,
    showQuote: false
  }),
  computed: {
    /**
     * Vuex Getters
     */
    ...mapGetters({
      vehicle_number: 'vehicle-dashboard/getVehicleNumber',
      quote: 'vehicle-dashboard/getTransportStorageQuote'
    }),
    defaultModel () {
      return {
        type: null,
        transport_method: null,
        origin_city: null,
        origin_state_province: null,
        origin_postal_code: null,
        destination_city: null,
        destination_state_province: null,
        destination_postal_code: null
      }
    },
    hasQuote: vm => Object.keys(this.quote).length > 0
  },
  mounted () {
    this.reset()
  },
  methods: {
    /**
     * Vuex Actions
     */
    ...mapActions({
      fetchQuote: 'vehicle-dashboard/fetchTransportStorageQuote'
    }),
    reset () {
      this.$refs.quoteForm.reset()
      this.model = { ...this.defaultModel }
    },
    async requestQuote () {
      try {
        this.loading = true
        await this.fetchQuote(this.model)
      } catch (error) {
        this.$snotify.error(error, this.$i18n.t('error'), { position: SnotifyPosition.centerBottom })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
