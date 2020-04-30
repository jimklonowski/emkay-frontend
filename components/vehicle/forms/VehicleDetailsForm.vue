<template>
  <ValidationObserver ref="vehicleForm" v-slot="{ handleSubmit }" tag="form" @submit.prevent>
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
        <v-row>
          <v-col cols="12" md="8" order="2" order-md="1">
            <v-list dense>
              <v-list-item>
                <v-list-item-title v-text="$t('vehicle_number')" />
                <v-list-item-subtitle v-text="vehicle_number" />
              </v-list-item>
              <v-list-item>
                <v-list-item-title v-text="$t('vin')" />
                <v-list-item-subtitle v-text="vehicle.vin" />
              </v-list-item>
              <v-list-item>
                <v-list-item-title v-text="$t('year_make_model')" />
                <v-list-item-subtitle v-text="year_make_model" />
              </v-list-item>
              <v-list-item>
                <v-list-item-title v-text="$t('driver')" />
                <v-list-item-subtitle v-text="driver_name" />
              </v-list-item>
            </v-list>
          </v-col>
          <v-col cols="12" md="4" order="1" order-md="2">
            <v-dialog v-model="reassign_dialog" max-width="750">
              <template #activator="{ on }">
                <v-btn color="primary" depressed small text v-on="on">
                  {{ $t('assign_new_driver') }}
                </v-btn>
              </template>
              <v-card>
                <v-card-title v-text="$t('assign_new_driver')" />
                <v-card-text v-text="'TODO'" />
              </v-card>
            </v-dialog>
            <!-- <v-dialog v-model="change_plate_dialog" max-width="750">
              <template #activator="{ on }">
                <v-btn color="primary" depressed small text v-on="on">
                  {{ $t('change_plate') }}
                </v-btn>
              </template>
              <v-card>
                <v-card-title v-text="$t('change_plate')" />
                <v-card-text v-text="'TODO'" />
              </v-card>
            </v-dialog> -->
          </v-col>
        </v-row>
        <v-divider />
        <v-row>
          <v-col cols="12">
            <v-tabs v-model="tab" grow hide-slider>
              <v-tab>{{ $t('vehicle_details') }}</v-tab>
              <v-tab>{{ $t('custom_labels') }}</v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab">
              <v-tab-item>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-dialog
                        ref="driver_effective_date_dialog"
                        v-model="driver_effective_date_dialog"
                        :return-value.sync="model.driver_effective_date"
                        persistent
                        width="290px"
                        @keydown.esc="driver_effective_date_dialog = false"
                      >
                        <template #activator="{ on }">
                          <v-text-field
                            :value="$moment(model.driver_effective_date).format('L')"
                            :label="$t('driver_effective_date')"
                            prepend-inner-icon="mdi-calendar"
                            dense
                            outlined
                            readonly
                            v-on="on"
                          />
                        </template>
                        <v-date-picker
                          v-model="model.driver_effective_date"
                          :locale="$moment.locale()"
                          color="primary"
                          header-color="primary"
                          scrollable
                        >
                          <v-spacer />
                          <v-btn text @click="driver_effective_date_dialog = false" v-text="$t('cancel')" />
                          <v-btn text @click="$refs.driver_effective_date_dialog.save(model.driver_effective_date)" v-text="$t('ok')" />
                        </v-date-picker>
                      </v-dialog>
                    </v-col>
                    <v-col cols="12">
                      <ValidationProvider v-slot="{ errors }" :name="$t('client_vehicle_number')" rules="alpha_dash">
                        <v-text-field
                          v-model="model.client_vehicle_number"
                          :label="$t('client_vehicle_number')"
                          :error-messages="errors"
                          dense
                          outlined
                        />
                      </ValidationProvider>
                    </v-col>
                    <v-col cols="12">
                      <ValidationProvider v-slot="{ errors }" :name="$t('bill_sort')">
                        <v-text-field
                          v-model="model.bill_sort"
                          :label="$t('bill_sort')"
                          :error-messages="errors"
                          dense
                          outlined
                        />
                      </ValidationProvider>
                    </v-col>
                    <v-col cols="12">
                      <v-dialog v-model="center_dialog" max-width="750" scrollable>
                        <template #activator="{ on }">
                          <v-text-field
                            :value="[model.center_code, model.center_name].filter(Boolean).join(' - ')"
                            :label="$t('center')"
                            dense
                            outlined
                            readonly
                            v-on="on"
                          />
                        </template>
                        <v-card>
                          <v-card-title v-text="$t('centers')" />
                          <v-card-text>
                            <center-picker
                              v-model="center_tree"
                              :active.sync="center_tree"
                              :activatable="true"
                              :selectable="false"
                              open-all
                              @update:active="selectCenter($event)"
                            />
                          </v-card-text>
                        </v-card>
                      </v-dialog>
                    </v-col>
                    <v-col cols="12">
                      <ValidationProvider v-slot="{ errors }" :name="$t('license_plate_number')">
                        <v-text-field
                          v-model="model.license_plate_number"
                          :label="$t('license_plate_number')"
                          :error-messages="errors"
                          dense
                          outlined
                        />
                      </ValidationProvider>
                    </v-col>
                    <v-col cols="12">
                      <v-dialog
                        ref="license_plate_expiration_date_dialog"
                        v-model="license_plate_expiration_date_dialog"
                        :return-value.sync="model.license_plate_expiration_date"
                        persistent
                        width="290px"
                        @keydown.esc="license_plate_expiration_date_dialog = false"
                      >
                        <template #activator="{ on }">
                          <v-text-field
                            :value="$moment(model.license_plate_expiration_date).format('L')"
                            :label="$t('license_plate_expiration_date')"
                            prepend-inner-icon="mdi-calendar"
                            dense
                            outlined
                            readonly
                            v-on="on"
                          />
                        </template>
                        <v-date-picker
                          v-model="model.license_plate_expiration_date"
                          :locale="$moment.locale()"
                          color="primary"
                          header-color="primary"
                          scrollable
                        >
                          <v-spacer />
                          <v-btn text @click="license_plate_expiration_date_dialog = false" v-text="$t('cancel')" />
                          <v-btn text @click="$refs.license_plate_expiration_date_dialog.save(model.license_plate_expiration_date)" v-text="$t('ok')" />
                        </v-date-picker>
                      </v-dialog>
                    </v-col>
                  </v-row>
                </v-container>
              </v-tab-item>
              <v-tab-item>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <ValidationProvider v-slot="{ errors }" :name="$t('client_use_1')" rules="max:40">
                        <v-text-field
                          v-model="model.client_use_1"
                          :label="custom_labels.client_use_label_1 || $t('client_use_label_1')"
                          :error-messages="errors"
                          dense
                          outlined
                        />
                      </ValidationProvider>
                    </v-col>
                    <v-col cols="12">
                      <ValidationProvider v-slot="{ errors }" :name="$t('client_use_2')" rules="max:40">
                        <v-text-field
                          v-model="model.client_use_2"
                          :label="custom_labels.client_use_label_2 || $t('client_use_label_2')"
                          :error-messages="errors"
                          dense
                          outlined
                        />
                      </ValidationProvider>
                    </v-col>
                    <v-col cols="12">
                      <ValidationProvider v-slot="{ errors }" :name="$t('client_use_3')" rules="max:40">
                        <v-text-field
                          v-model="model.client_use_3"
                          :label="custom_labels.client_use_label_3 || $t('client_use_label_3')"
                          :error-messages="errors"
                          dense
                          outlined
                        />
                      </ValidationProvider>
                    </v-col>
                    <v-col cols="12">
                      <ValidationProvider v-slot="{ errors }" :name="$t('client_use_4')" rules="max:40">
                        <v-text-field
                          v-model="model.client_use_4"
                          :label="custom_labels.client_use_label_4 || $t('client_use_label_4')"
                          :error-messages="errors"
                          dense
                          outlined
                        />
                      </ValidationProvider>
                    </v-col>
                    <v-col cols="12">
                      <ValidationProvider v-slot="{ errors }" :name="$t('client_use_5')" rules="max:40">
                        <v-text-field
                          v-model="model.client_use_5"
                          :label="custom_labels.client_use_label_5 || $t('client_use_label_5')"
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
      <v-card-actions>
        <!-- <v-fade-transition>
          <span v-show="hasChanges" v-if="vehicleNumber" class="font-italic text--disabled caption px-2">
            {{ $t('unsaved_changes') }}
          </span>
        </v-fade-transition> -->
        <v-btn
          color="primary"
          type="submit"
          :loading="loading"
          block
          depressed
          @click="handleSubmit(submitVehicle)"
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
import isEqual from 'lodash.isequal'
import CenterPicker from '@/components/core/CenterPicker'
export default {
  components: { CenterPicker },
  props: {
    vehicleNumber: {
      type: String,
      default: ''
    }
  },
  async fetch () {
    if (this.vehicleNumber) {
      await this.fetchVehicle({ vehicle: this.vehicleNumber })
      // copy fetched vehicle into form model
      this.model = { ...this.vehicle }
      this.model.driver_effective_date = this.driver_effective_date
      this.center_tree = [{ center_code: this.model.center_code, center_name: this.model.center_name, children: [] }]
    } else {
      this.model = { ...this.defaultModel }
      this.center_tree = []
    }
  },
  fetchOnServer: false,
  data: () => ({
    center_tree: [],
    center_dialog: false,
    // change_plate_dialog: false,
    driver_effective_date_dialog: false,
    license_plate_expiration_date_dialog: false,
    loading: false,
    model: {},
    reassign_dialog: false,
    tab: 0
  }),
  computed: {
    ...mapGetters({
      custom_labels: 'account/getCustomLabels',
      driver_effective_date: 'vehicle-dashboard/getDriverEffectiveDate',
      driver_name: 'vehicle-dashboard/getDriverName',
      vehicle: 'vehicle-dashboard/getVehicleDetails',
      vehicle_number: 'vehicle-dashboard/getVehicleNumber',
      year_make_model: 'vehicle-dashboard/getYearMakeModel'
    }),
    defaultModel () {
      return {
        bill_sort: '',
        center_name: '',
        center_code: '',
        vehicle_number: '',
        client_vehicle_number: '',
        client_use_1: '',
        client_use_2: '',
        client_use_3: '',
        client_use_4: '',
        client_use_5: '',
        driver_effective_date: '',
        license_plate_expiration_date: '',
        license_plate_number: ''
      }
    },
    title: vm => vm.vehicleNumber ? vm.$i18n.t('update_vehicle') : vm.$i18n.t('add_vehicle'),
    subtitle: vm => vm.vehicleNumber,
    hasChanges: vm => !isEqual(vm.model, vm.vehicle)
  },
  watch: {
    async vehicleNumber () {
      console.log(`VehicleNumber changed: ${this.vehicleNumber}`)
      await this.$fetch()
    }
  },
  methods: {
    ...mapActions({
      fetchVehicle: 'vehicle-dashboard/fetchVehicleDetails'
    }),
    close () {
      this.$refs.vehicleForm.reset()
      this.$emit('close')
    },
    selectCenter (center) {
      if (center && center[0]) {
        // the user selected a center, vuetify puts it into an array so let's extract it and put it in the model
        this.model.center_code = center[0].center_code
        this.model.center_name = center[0].center_name
      } else {
        // the user de-selected the already-selected center
        // this.center_tree = [{ center_code: this.model.center_code, center_name: this.model.center_name, children: [] }]
        this.model.center_code = ''
        this.model.center_name = ''
      }
      this.center_dialog = false
    },
    async submitVehicle () {
      try {
        this.loading = true
        if (this.vehicleNumber) {
          // updating existing vehicle
          await this.$axios.post('/vehicle/update', this.model)
        } else {
          // adding new vehicle
          await this.$axios.post('/vehicle/add', this.model)
        }
        this.$emit('saved')
        this.$snotify.success(this.$i18n.t('vehicle_saved'), this.$i18n.t('success'), { position: SnotifyPosition.centerBottom })
      } catch (error) {
        this.$snotify.error(error, this.$i18n.t('error'), { position: SnotifyPosition.centerBottom })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
