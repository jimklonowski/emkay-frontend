<template>
  <v-card :loading="loading" outlined>
    <ValidationObserver ref="reportOdometer" v-slot="{ handleSubmit }">
      <v-form @submit.prevent="handleSubmit(submitOdometer)">
        <v-card-title class="font-lato" v-text="$t('report_odometer')" />
        <v-divider />
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-dialog
                  ref="start_date"
                  v-model="start_dialog"
                  :return-value.sync="start"
                  persistent
                  width="290px"
                >
                  <template #activator="{ on }">
                    <ValidationProvider v-slot="{ errors, valid }" :name="$t('start_date')" rules="required">
                      <v-text-field
                        v-model="start"
                        :label="$t('start_date')"
                        :error-messages="errors"
                        :success="valid"
                        prepend-inner-icon="mdi-calendar"
                        readonly
                        outlined
                        dense
                        v-on="on"
                      />
                    </ValidationProvider>
                  </template>
                  <v-date-picker
                    v-model="start"
                    scrollable
                    outlined
                    dense
                  >
                    <v-spacer />
                    <v-btn text @click="start_dialog = false" v-text="$t('cancel')" />
                    <v-btn color="primary" @click="$refs.start_date.save(start)" v-text="$t('ok')" />
                  </v-date-picker>
                </v-dialog>
              </v-col>
              <v-col cols="12">
                <v-dialog
                  ref="end_date"
                  v-model="end_dialog"
                  :return-value.sync="end"
                  persistent
                  width="290px"
                >
                  <template #activator="{ on }">
                    <ValidationProvider v-slot="{ errors, valid }" :name="$t('end_date')" rules="required">
                      <v-text-field
                        v-model="end"
                        :label="$t('end_date')"
                        :error-messages="errors"
                        :success="valid"
                        prepend-inner-icon="mdi-calendar"
                        readonly
                        outlined
                        dense
                        v-on="on"
                      />
                    </ValidationProvider>
                  </template>
                  <v-date-picker
                    v-model="end"
                    scrollable
                    outlined
                    dense
                  >
                    <v-spacer />
                    <v-btn text @click="end_dialog = false" v-text="$t('cancel')" />
                    <v-btn color="primary" @click="$refs.end_date.save(end)" v-text="$t('ok')" />
                  </v-date-picker>
                </v-dialog>
              </v-col>
              <v-col cols="12">
                <ValidationProvider v-slot="{ errors, valid }" :name="$t('ending_odometer')" rules="required">
                  <v-text-field
                    v-model="ending_odometer"
                    :label="$t('ending_odometer')"
                    :error-messages="errors"
                    :success="valid"
                    type="number"
                    autocomplete="off"
                    min="0"
                    outlined
                    dense
                  />
                </ValidationProvider>
              </v-col>
              <v-col cols="12">
                <ValidationProvider v-slot="{ errors, valid }" :name="$t('personal_mileage')" rules="required">
                  <v-text-field
                    v-model="personal_mileage"
                    :label="$t('personal_mileage')"
                    :error-messages="errors"
                    :success="valid"
                    type="number"
                    min="0"
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
            type="submit"
            color="primary lighten-1"
            block
            small
            depressed
            v-text="$t('submit')"
          />
        </v-card-actions>
      </v-form>
    </ValidationObserver>
  </v-card>
</template>

<script>
import { SnotifyPosition } from 'vue-snotify'
export default {
  props: {
    vehicle: {
      type: String,
      required: true
    }
  },
  data: () => ({
    loading: false,
    start: null,
    start_dialog: false,
    end: null,
    end_dialog: false,
    ending_odometer: null,
    personal_mileage: null
  }),
  methods: {
    async submitOdometer () {
      this.loading = true
      setTimeout(() => {
        this.$snotify.info('TODO: form submitted', 'submit', { position: SnotifyPosition.centerTop })
        this.loading = false
      }, 1000)
      await console.log('submit odometer')
    }
  }
}
</script>

<style>

</style>
