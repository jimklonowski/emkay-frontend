<template>
  <v-card tile>
    <v-stepper v-model="currentStep" class="elevation-0" tile>
      <v-stepper-header>
        <v-stepper-step :complete="currentStep > 1" :step="1">
          {{ $t('requestor_information') }}
        </v-stepper-step>
        <v-divider />
        <v-stepper-step :complete="currentStep > 2" :step="2" :color="model.type === 'transport_out_of_storage' ? 'grey' : 'primary'">
          {{ $t('pickup_information') }}
          <small v-show="model.type === 'transport_out_of_storage'">Skipped if transporting out of storage</small>
        </v-stepper-step>
        <v-divider />
        <v-stepper-step :complete="currentStep > 3" :step="3">
          {{ $t('assign_driver_on_delivery') }}
          <small v-if="model.type === 'store_this_vehicle'">Skipped if storing this vehicle</small>
          <small v-else>Optional</small>
        </v-stepper-step>
        <v-divider />
        <v-stepper-step :complete="currentStep > 4" :step="4">
          {{ $t('delivery_information') }}
          <small v-show="model.type === 'store_this_vehicle'">Skipped if storing this vehicle</small>
        </v-stepper-step>
        <v-divider />
        <v-stepper-step :complete="currentStep > 5" :step="5">
          {{ $t('additional_services') }}
        </v-stepper-step>
      </v-stepper-header>
      <v-divider />
      <v-stepper-items>
        <!-- Step 1 -->
        <v-stepper-content :complete="currentStep > 1" step="1">
          <v-row>
            <v-dialog v-model="dialog" max-width="800">
              <template #activator="{ on }">
                <v-btn color="primary" depressed v-on="on">
                  <v-icon class="mr-2" v-text="'mdi-comment-question'" />
                  {{ $t('request_quote') }}
                </v-btn>
              </template>
              <transport-storage-quote-form />
            </v-dialog>
          </v-row>
          <ValidationObserver ref="step1" v-slot="{ handleSubmit }">
            <v-form @submit.prevent="handleSubmit(nextStep)">
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-row>
                      <v-col cols="12" sm="6">
                        <ValidationProvider v-slot="{ errors }" :name="$t('type')" vid="type" rules="required">
                          <v-radio-group
                            v-model="model.type"
                            :label="$t('type')"
                            :error-messages="errors"
                          >
                            <v-radio :label="$t('transport_this_vehicle')" value="transport_this_vehicle" />
                            <v-radio :label="$t('store_this_vehicle')" value="store_this_vehicle" />
                            <v-radio :label="$t('transport_out_of_storage')" value="transport_out_of_storage" />
                          </v-radio-group>
                        </ValidationProvider>
                      </v-col>
                      <v-col cols="12" sm="6">
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
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-row>
                      <v-col cols="12">
                        <ValidationProvider v-slot="{ errors }" :name="$t('contact_name')" vid="contact_name" rules="required">
                          <v-text-field
                            v-model="model.requestor_contact_name"
                            :error-messages="errors"
                            :label="$t('contact_name')"
                            dense
                            outlined
                          />
                        </ValidationProvider>
                      </v-col>
                      <v-col cols="8">
                        <ValidationProvider v-slot="{ errors }" :name="$t('phone')" vid="phone" rules="required">
                          <v-text-field
                            v-model="model.requestor_phone"
                            :error-messages="errors"
                            :label="$t('phone')"
                            dense
                            outlined
                          />
                        </ValidationProvider>
                      </v-col>
                      <v-col cols="4">
                        <ValidationProvider v-slot="{ errors }" :name="$t('extension')" vid="extension">
                          <v-text-field
                            v-model="model.requestor_phone_ext"
                            :error-messages="errors"
                            :label="$t('extension')"
                            dense
                            outlined
                          />
                        </ValidationProvider>
                      </v-col>
                      <v-col cols="12">
                        <ValidationProvider v-slot="{ errors }" :name="$t('email')" vid="email" rules="required">
                          <v-text-field
                            v-model="model.requestor_email"
                            :error-messages="errors"
                            :label="$t('email')"
                            dense
                            outlined
                          />
                        </ValidationProvider>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
                <v-row>
                  <v-spacer />
                  <v-btn v-if="currentStep < 5" type="submit" color="primary">
                    {{ $t('next') }}
                  </v-btn>
                </v-row>
              </v-container>
            </v-form>
          </ValidationObserver>
        </v-stepper-content>
        <!-- Step 2 -->
        <v-stepper-content :complete="currentStep > 2" step="2">
          <ValidationObserver ref="step2" v-slot="{ handleSubmit }">
            <v-form @submit.prevent="handleSubmit(nextStep)">
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-row>
                      <v-col cols="12">
                        <v-dialog
                          ref="pickup_dialog"
                          v-model="pickup_dialog"
                          :return-value.sync="model.pickup_date"
                          persistent
                          width="290px"
                        >
                          <template #activator="{ on }">
                            <ValidationProvider v-slot="{ errors }" :name="$t('pickup_date')" vid="pickup_date" rules="required|not_past">
                              <v-text-field
                                :value="$moment(model.pickup_date).format('L')"
                                :error-messages="errors"
                                :label="$t('pickup_date')"
                                prepend-inner-icon="mdi-calendar"
                                dense
                                outlined
                                readonly
                                v-on="on"
                              />
                            </ValidationProvider>
                          </template>
                          <v-date-picker
                            v-model="model.pickup_date"
                            :locale="$moment.locale()"
                            color="primary"
                            header-color="primary"
                            scrollable
                          >
                            <v-spacer />
                            <v-btn text @click="pickup_dialog = false" v-text="$t('cancel')" />
                            <v-btn @click="$refs.pickup_dialog.save(model.pickup_date)" v-text="$t('ok')" />
                          </v-date-picker>
                        </v-dialog>
                      </v-col>
                      <v-col cols="12" md="6">
                        <ValidationProvider v-slot="{ errors }" :name="$t('address_type')" vid="address_type" rules="required">
                          <v-select
                            v-model="model.pickup_address_type"
                            :error-messages="errors"
                            :label="$t('address_type')"
                            :items="addressTypes"
                            dense
                            outlined
                          />
                        </ValidationProvider>
                      </v-col>
                      <v-col cols="12">
                        <ValidationProvider v-slot="{ errors }" :name="$t('address_1')" vid="address_1" rules="required">
                          <v-text-field v-model="model.pickup_address_1" :error-messages="errors" :label="$t('address_1')" dense outlined />
                        </ValidationProvider>
                      </v-col>
                      <v-col cols="12">
                        <ValidationProvider v-slot="{ errors }" :name="$t('address_2')" vid="address_2">
                          <v-text-field v-model="model.pickup_address_2" :error-messages="errors" :label="$t('address_2')" dense outlined />
                        </ValidationProvider>
                      </v-col>
                      <v-col cols="12">
                        <ValidationProvider v-slot="{ errors }" :name="$t('city')" vid="city" rules="required">
                          <v-text-field v-model="model.pickup_city" :error-messages="errors" :label="$t('city')" dense outlined />
                        </ValidationProvider>
                      </v-col>
                      <v-col cols="6">
                        <ValidationProvider v-slot="{ errors }" :name="$t('state_province')" vid="state_province" rules="required">
                          <v-text-field v-model="model.pickup_state_province" :error-messages="errors" :label="$t('state_province')" dense outlined />
                        </ValidationProvider>
                      </v-col>
                      <v-col cols="6">
                        <ValidationProvider v-slot="{ errors }" :name="$t('postal_code')" vid="postal_code" rules="required">
                          <v-text-field v-model="model.pickup_postal_code" :error-messages="errors" :label="$t('postal_code')" dense outlined />
                        </ValidationProvider>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-row>
                      <v-col cols="12">
                        <ValidationProvider v-slot="{ errors }" :name="$t('contact_name')" vid="contact_name" rules="required">
                          <v-text-field v-model="model.pickup_contact_name" :error-messages="errors" :label="$t('contact_name')" dense outlined />
                        </ValidationProvider>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <ValidationProvider v-slot="{ errors }" :name="$t('phone_type')" vid="phone_type" rules="required">
                          <v-select
                            v-model="model.pickup_phone_type"
                            :error-messages="errors"
                            :label="$t('phone_type')"
                            :items="phoneTypes"
                            dense
                            outlined
                          />
                        </ValidationProvider>
                      </v-col>
                      <v-col cols="8">
                        <ValidationProvider v-slot="{ errors }" :name="$t('phone')" vid="phone" rules="required">
                          <v-text-field v-model="model.pickup_phone" :error-messages="errors" :label="$t('phone')" dense outlined />
                        </ValidationProvider>
                      </v-col>
                      <v-col cols="4">
                        <ValidationProvider v-slot="{ errors }" :name="$t('extension')" vid="extension">
                          <v-text-field v-model="model.pickup_phone_ext" :error-messages="errors" :label="$t('extension')" dense outlined />
                        </ValidationProvider>
                      </v-col>
                      <v-col cols="12">
                        <ValidationProvider v-slot="{ errors }" :name="$t('email')" vid="email" rules="required">
                          <v-text-field v-model="model.pickup_email" :error-messages="errors" :label="$t('email')" dense outlined />
                        </ValidationProvider>
                      </v-col>
                      <v-col cols="12">
                        <ValidationProvider v-slot="{ errors }" :name="$t('employee_terminated')" vid="employee_terminated">
                          <v-checkbox v-model="model.employee_terminated" :error-messages="errors" :label="$t('employee_terminated')" dense />
                        </ValidationProvider>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
                <v-row>
                  <v-spacer />
                  <v-btn text @click.prevent="prevStep">
                    {{ $t('back') }}
                  </v-btn>
                  <v-btn type="submit" color="primary">
                    {{ $t('next') }}
                  </v-btn>
                </v-row>
              </v-container>
            </v-form>
          </ValidationObserver>
        </v-stepper-content>
        <!-- Step 3 -->
        <v-stepper-content :complete="currentStep > 3" step="3">
          <ValidationObserver ref="step3" v-slot="{ handleSubmit }">
            <v-form @submit.prevent="handleSubmit(nextStep)">
              <v-banner>
                Upon completion of this transport order, the EMKAY system will be updated to show the selected driver and contact information as assigned to this vehicle.
                <template #actions>
                  <v-btn text color="primary" @click.prevent="$snotify.error('todo')">
                    Select Driver
                  </v-btn>
                </template>
              </v-banner>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-subheader v-text="'Assigned To:'" />
                    <v-row v-text="model.assigned_driver_name" />
                    <v-row v-text="model.assigned_driver_address_1" />
                    <v-row v-if="model.assigned_driver_address_2" v-text="model.assigned_driver_address_2" />
                    <v-row v-text="assignedDriverCityStateZip" />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <ValidationProvider v-slot="{ errors }" :name="$t('use_as_delivery_address')" vid="use_as_delivery_address">
                      <v-checkbox
                        v-model="model.use_as_delivery_address"
                        :error-messages="errors"
                        :label="$t('use_as_delivery_address')"
                        @change="populateDeliveryAddress"
                      />
                    </ValidationProvider>
                  </v-col>
                </v-row>
                <v-row>
                  <v-spacer />
                  <v-btn text @click.prevent="prevStep">
                    {{ $t('back') }}
                  </v-btn>
                  <v-btn type="submit" color="primary">
                    {{ $t('next') }}
                  </v-btn>
                </v-row>
              </v-container>
            </v-form>
          </ValidationObserver>
        </v-stepper-content>
        <!-- Step 4 -->
        <v-stepper-content :complete="currentStep > 4" step="4">
          <ValidationObserver ref="step4" v-slot="{ handleSubmit }">
            <v-form @submit.prevent="handleSubmit(nextStep)">
              <!-- use a hidden field to pass forward the pickupdate, and allow cross-step validation of dates in different forms/observers -->
              <ValidationProvider :name="$t('pickup_date')" vid="pickup_date">
                <input :value="model.pickup_date" type="hidden">
              </ValidationProvider>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-row>
                      <v-col cols="12">
                        <v-dialog
                          ref="delivery_dialog"
                          v-model="delivery_dialog"
                          :return-value.sync="model.delivery_date"
                          persistent
                          width="290px"
                        >
                          <template #activator="{ on }">
                            <ValidationProvider v-slot="{ errors }" :name="$t('delivery_date')" vid="delivery_date" rules="required|not_past|on_or_after:@pickup_date">
                              <v-text-field
                                :value="$moment(model.delivery_date).format('L')"
                                :error-messages="errors"
                                :label="$t('delivery_date')"
                                prepend-inner-icon="mdi-calendar"
                                dense
                                outlined
                                readonly
                                v-on="on"
                              />
                            </ValidationProvider>
                          </template>
                          <v-date-picker
                            v-model="model.delivery_date"
                            :locale="$moment.locale()"
                            color="primary"
                            header-color="primary"
                            scrollable
                          >
                            <v-spacer />
                            <v-btn text @click="delivery_dialog = false" v-text="$t('cancel')" />
                            <v-btn @click="$refs.delivery_dialog.save(model.delivery_date)" v-text="$t('ok')" />
                          </v-date-picker>
                        </v-dialog>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <ValidationProvider v-slot="{ errors }" :name="$t('address_type')" vid="address_type" rules="required">
                          <v-select
                            v-model="model.delivery_address_type"
                            :error-messages="errors"
                            :label="$t('address_type')"
                            :items="addressTypes"
                            outlined
                          />
                        </ValidationProvider>
                      </v-col>
                      <v-col cols="12">
                        <ValidationProvider v-slot="{ errors }" :name="$t('address_1')" vid="address_1" rules="required">
                          <v-text-field
                            v-model="model.delivery_address_1"
                            :error-messages="errors"
                            :label="$t('address_1')"
                            outlined
                          />
                        </ValidationProvider>
                      </v-col>
                      <v-col cols="12">
                        <ValidationProvider v-slot="{ errors }" :name="$t('address_2')" vid="address_2">
                          <v-text-field
                            v-model="model.delivery_address_2"
                            :error-messages="errors"
                            :label="$t('address_2')"
                            outlined
                          />
                        </ValidationProvider>
                      </v-col>
                      <v-col cols="12">
                        <ValidationProvider v-slot="{ errors }" :name="$t('city')" vid="city" rules="required">
                          <v-text-field
                            v-model="model.delivery_city"
                            :error-messages="errors"
                            :label="$t('city')"
                            outlined
                          />
                        </ValidationProvider>
                      </v-col>
                      <v-col cols="6">
                        <ValidationProvider v-slot="{ errors }" :name="$t('state_province')" vid="state_province" rules="required">
                          <v-text-field
                            v-model="model.delivery_state_province"
                            :error-messages="errors"
                            :label="$t('state_province')"
                            outlined
                          />
                        </ValidationProvider>
                      </v-col>
                      <v-col cols="6">
                        <ValidationProvider v-slot="{ errors }" :name="$t('postal_code')" vid="postal_code" rules="required">
                          <v-text-field
                            v-model="model.delivery_postal_code"
                            :error-messages="errors"
                            :label="$t('postal_code')"
                            outlined
                          />
                        </ValidationProvider>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-row>
                      <v-col cols="12">
                        <ValidationProvider v-slot="{ errors }" :name="$t('contact_name')" vid="contact_name" rules="required">
                          <v-text-field
                            v-model="model.delivery_contact_name"
                            :error-messages="errors"
                            :label="$t('contact_name')"
                            outlined
                          />
                        </ValidationProvider>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <ValidationProvider v-slot="{ errors }" :name="$t('phone_type')" vid="phone_type" rules="required">
                          <v-select
                            v-model="model.delivery_phone_type"
                            :error-messages="errors"
                            :label="$t('phone_type')"
                            :items="phoneTypes"
                            outlined
                          />
                        </ValidationProvider>
                      </v-col>
                      <v-col cols="8">
                        <ValidationProvider v-slot="{ errors }" :name="$t('phone')" vid="phone" rules="required">
                          <v-text-field
                            v-model="model.delivery_phone"
                            :error-messages="errors"
                            :label="$t('phone')"
                            outlined
                          />
                        </ValidationProvider>
                      </v-col>
                      <v-col cols="4">
                        <ValidationProvider v-slot="{ errors }" :name="$t('extension')" vid="extension">
                          <v-text-field
                            v-model="model.delivery_phone_ext"
                            :error-messages="errors"
                            :label="$t('extension')"
                            outlined
                          />
                        </ValidationProvider>
                      </v-col>
                      <v-col cols="12">
                        <ValidationProvider v-slot="{ errors }" :name="$t('email')" vid="email" rules="required">
                          <v-text-field
                            v-model="model.delivery_email"
                            :error-messages="errors"
                            :label="$t('email')"
                            outlined
                          />
                        </ValidationProvider>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
                <v-row>
                  <v-spacer />
                  <v-btn text @click.prevent="prevStep">
                    {{ $t('back') }}
                  </v-btn>
                  <v-btn type="submit" color="primary">
                    {{ $t('next') }}
                  </v-btn>
                </v-row>
              </v-container>
            </v-form>
          </ValidationObserver>
        </v-stepper-content>
        <!-- Step 1 -->
        <v-stepper-content :complete="currentStep > 5" step="5">
          <ValidationObserver ref="step5" v-slot="{ handleSubmit }">
            <v-form @submit.prevent="handleSubmit(submitTranstorOrder)">
              <v-container>
                <v-row>
                  <v-col cols="12" md="6">
                    <ValidationProvider v-slot="{ errors }" :name="$t('approve_auto_detail')" vid="approve_auto_detail">
                      <v-checkbox
                        v-model="model.approve_auto_detail"
                        :error-messages="errors"
                        :label="$t('approve_auto_detail')"
                      />
                    </ValidationProvider>
                  </v-col>
                  <v-col cols="12" md="6">
                    <ValidationProvider v-slot="{ errors }" :name="$t('approve_oil_change')" vid="approve_oil_change">
                      <v-checkbox
                        v-model="model.approve_oil_change"
                        :error-messages="errors"
                        :label="$t('approve_oil_change')"
                      />
                    </ValidationProvider>
                  </v-col>
                  <v-col cols="12" md="6">
                    <ValidationProvider v-slot="{ errors }" :name="$t('other_services')" vid="other_services">
                      <v-textarea
                        v-model="model.other_services"
                        :error-messages="errors"
                        :label="$t('other_services')"
                        outlined
                      />
                    </ValidationProvider>
                  </v-col>
                  <v-col cols="12" md="6">
                    <ValidationProvider v-slot="{ errors }" :name="$t('special_instructions')" vid="special_instructions">
                      <v-textarea
                        v-model="model.special_instructions"
                        :error-messages="errors"
                        :label="$t('special_instructions')"
                        outlined
                      />
                    </ValidationProvider>
                  </v-col>
                </v-row>
                <v-row>
                  <v-spacer />
                  <v-btn text @click.prevent="prevStep">
                    {{ $t('back') }}
                  </v-btn>
                  <v-btn type="submit" color="primary" @click="$snotify.info('todo')">
                    {{ $t('submit') }}
                  </v-btn>
                </v-row>
              </v-container>
            </v-form>
          </ValidationObserver>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import TransportStorageQuoteForm from '@/components/vehicle-dashboard/forms/TransportStorageQuoteForm'
export default {
  components: {
    TransportStorageQuoteForm
  },
  data: vm => ({
    dialog: false,
    loading: false,
    currentStep: 1,
    delivery_dialog: false,
    pickup_dialog: false,
    model: {
      type: '',
      transport_method: '',
      // requestor info
      requestor_contact_name: '',
      requestor_phone: '',
      requestor_phone_ext: '',
      requestor_email: '',
      // pickup info
      pickup_date: vm.$moment().format('YYYY-MM-DD'),
      pickup_address_type: '',
      pickup_address_1: '',
      pickup_address_2: '',
      pickup_city: '',
      pickup_state_province: '',
      pickup_postal_code: '',
      pickup_phone_type: '',
      pickup_phone: '',
      pickup_phone_ext: '',
      pickup_email: '',
      pickup_contact_name: '',
      employee_terminated: '',
      // delivery info
      delivery_date: vm.$moment().format('YYYY-MM-DD'),
      delivery_address_type: '',
      delivery_address_1: '',
      delivery_address_2: '',
      delivery_city: '',
      delivery_state_province: '',
      delivery_postal_code: '',
      delivery_phone_type: '',
      delivery_phone: '',
      delivery_phone_ext: '',
      delivery_email: '',
      delivery_contact_name: '',
      // assigned driver
      assigned_driver_name: '',
      assigned_driver_address_1: '',
      assigned_driver_address_2: '',
      assigned_driver_city: '',
      assigned_driver_state_province: '',
      assigned_driver_postal_code: '',
      use_as_delivery_address: '',
      // options
      approve_auto_detail: '',
      approve_oil_change: '',
      other_services: '',
      special_instructions: ''
    }
  }),
  computed: {
    /**
     * Vuex Getters
     */
    ...mapGetters({
      vehicle_number: 'vehicle-dashboard/getVehicleNumber',
      driver_number: 'vehicle-dashboard/getDriverNumber',
      driver_details: 'vehicle-dashboard/getDriverDetails',
      quote: 'vehicle-dashboard/getTransportStorageQuote'
    }),
    assignedDriverCityStateZip () {
      const city_state = [this.model.assigned_driver_city, this.model.assigned_driver_state_province].filter(Boolean).join(', ')
      return [city_state, this.model.assigned_driver_postal_code].filter(Boolean).join(' ')
    },
    hasQuote: vm => Object.keys(this.quote).length > 0,
    addressTypes () {
      return [
        { text: this.$i18n.t('residential'), value: 'Residential' },
        { text: this.$i18n.t('business'), value: 'Business' }
      ]
    },
    phoneTypes () {
      return [
        { text: this.$i18n.t('home'), value: 'Home' },
        { text: this.$i18n.t('cell'), value: 'Cell' },
        { text: this.$i18n.t('office'), value: 'Office' }
      ]
    }
  },
  mounted () {
    this.populateDriver()
    // this.populateQuote()
  },
  methods: {
    // populate form model with driver details
    populateDriver () {
      this.model.requestor_contact_name = this.driver_details.last_name
      this.model.requestor_phone = this.driver_details.phone
      this.model.requestor_phone_ext = this.driver_details.phone_ext
      this.model.requestor_email = this.driver_details.email
      this.model.assigned_driver_name = [this.driver_details.last_name, this.driver_details.first_name].filter(Boolean).join(', ')
      this.model.assigned_driver_address_1 = this.driver_details.address_1
      this.model.assigned_driver_address_2 = this.driver_details.address_2
      this.model.assigned_driver_city = this.driver_details.city
      this.model.assigned_driver_state_province = this.driver_details.state_province
      this.model.assigned_driver_postal_code = this.driver_details.postal_code
    },
    populateQuote () {
      if (this.hasQuote) {
        this.model.transport_method = this.quote.transport_method
        this.model.pickup_city = this.quote.origin_city
        this.model.pickup_postal_code = this.quote.origin_postal_code
        this.model.pickup_state_province = this.quote.origin_state_province
        this.model.delivery_city = this.quote.destination_city
        this.model.delivery_postal_code = this.quote.destination_postal_code
        this.model.delivery_state_province = this.quote.destination_state_province
      }
    },
    populateDeliveryAddress (useDriver) {
      if (useDriver) {
        this.model.delivery_contact_name = this.model.assigned_driver_name
        this.model.delivery_address_1 = this.model.assigned_driver_address_1
        this.model.delivery_address_2 = this.model.assigned_driver_address_2
        this.model.delivery_city = this.model.assigned_driver_city
        this.model.delivery_state_province = this.model.assigned_driver_state_province
        this.model.delivery_postal_code = this.model.assigned_driver_postal_code
        this.model.delivery_email = this.driver_details.email
        this.model.delivery_phone = this.driver_details.phone
        this.model.delivery_phone_ext = this.driver_details.phone_ext
      } else {
        this.model.delivery_contact_name = ''
        this.model.delivery_address_1 = ''
        this.model.delivery_address_2 = ''
        this.model.delivery_city = ''
        this.model.delivery_state_province = ''
        this.model.delivery_postal_code = ''
        this.model.delivery_email = ''
        this.model.delivery_phone = ''
        this.model.delivery_phone_ext = ''
      }
    },
    nextStep () {
      this.currentStep++
      // skip the pickup info step if transporting from storage
      if (this.currentStep === 2 && this.model.type === 'transport_out_of_storage') {
        this.currentStep++
      }
      // skip the assign new driver step AND delivery info step if storing this vehicle
      if (this.currentStep === 3 && this.model.type === 'store_this_vehicle') {
        this.currentStep += 2
      }
    },
    prevStep () {
      this.currentStep--
      // skip
      if (this.currentStep === 2 && this.model.type === 'transport_out_of_storage') {
        this.currentStep--
      }
      // skip
      if (this.currentStep === 4 && this.model.type === 'store_this_vehicle') {
        this.currentStep -= 2
      }
    },
    submitTranstorOrder () {
      console.log('submit')
    }
  }
}
</script>
