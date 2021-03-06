<template>
  <v-card outlined class="report">
    <v-toolbar flat color="transparent">
      <v-toolbar-title>{{ $t('manage_drivers') }}</v-toolbar-title>
      <v-spacer />
      <v-text-field
        v-model="search"
        :label="$t('search')"
        prepend-inner-icon="mdi-magnify"
        background-color="transparent"
        class="mr-2"
        clearable
        dense
        flat
        hide-details
        outlined
        rounded
        single-line
        solo
      />
      <client-only>
        <v-divider vertical inset class="mx-3" />
        <v-dialog v-model="driver_dialog" max-width="850" persistent scrollable>
          <template #activator="{ on }">
            <v-btn color="primary" rounded depressed v-on="on" @click="driverId = undefined">
              <v-icon class="mr-2" v-text="'mdi-account-plus'" />
              {{ $t('add_new_driver') }}
            </v-btn>
          </template>
          <driver-details-form
            :driver-number="driverId"
            @close="driver_dialog = false"
            @saved="saved"
          />
        </v-dialog>
      </client-only>
    </v-toolbar>
    <v-divider />
    <v-skeleton-loader :loading="$fetchState.pending" type="table" transition="fade-transition">
      <v-data-table
        :footer-props="{ itemsPerPageOptions: [10, 25, 50, 100, -1] }"
        :headers="headers"
        :items="items"
        :items-per-page="25"
        :loading="$fetchState.pending"
        :mobile-break-point="0"
        :search="search"
        :sort-by="['last_name']"
        :sort-desc="[false]"
        class="striped"
      >
        <!-- Configure the #no-data message (no data from server) -->
        <template #no-data>
          <div class="text-left">
            {{ $t('no_data_found', { 'message': error }) }}
          </div>
        </template>

        <!-- Configure the #no-results message (no rows in filtered search) -->
        <template #no-results>
          <div class="text-left">
            {{ $t('no_search_results', { 'query': search }) }}
          </div>
        </template>

        <!-- Customize rendering of individual columns -->
        <template #item.actions="{ item }">
          <v-btn icon name="edit" @click.stop="editDriver(item)">
            <v-icon v-text="'mdi-account-edit'" />
          </v-btn>
        </template>

        <template #item.driver_vehicle="{ item }">
          <vehicle-number-button :vehicle-number="item.driver_vehicle" />
        </template>

        <template #item.phone="{ item }">
          <v-btn
            v-show="item.phone"
            text
            small
            tile
            @click="dialTo(item.phone)"
          >
            <v-icon class="mr-2" v-text="'mdi-phone'" />
            {{ item.phone | phone }}
          </v-btn>
        </template>

        <template #item.mobile="{ item }">
          <v-btn
            v-show="item.mobile"
            text
            small
            tile
            @click="dialTo(item.mobile)"
          >
            <v-icon class="mr-2" v-text="'mdi-cellphone-iphone'" />
            {{ item.mobile | phone }}
          </v-btn>
        </template>

        <template #item.email="{ item }">
          <v-btn
            v-show="item.email"
            text
            small
            tile
            @click="emailTo(item.email)"
          >
            <v-icon class="mr-2" v-text="'mdi-email-edit'" />
            {{ item.email }}
          </v-btn>
        </template>
      </v-data-table>
    </v-skeleton-loader>
    <!-- <v-card-actions /> -->
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { dialTo, emailTo } from '@/utility/helpers'
import DriverDetailsForm from '@/components/driver/forms/DriverDetailsForm'
// import AddOrEditDriverForm from '@/components/driver/forms/AddOrEditDriverForm'
export default {
  name: 'ManageDrivers',
  components: {
    DriverDetailsForm,
    'vehicle-number-button': () => import(/* webpackChunkName: "VehicleNumberButton" */ '@/components/vehicle-dashboard/VehicleNumberButton.vue')
  },
  async fetch () {
    await this.fetchDrivers()
  },
  fetchOnServer: false, // https://nuxtjs.org/api/pages-fetch#options
  data: () => ({
    driver_dialog: false,
    driverId: undefined,
    search: ''
  }),
  computed: {
    /**
     * Vuex Getters
     */
    ...mapGetters({
      items: 'drivers/getDrivers',
      error: 'drivers/getDriversError',
      loading: 'drivers/getDriversLoading',
      custom_labels: 'account/getCustomLabels'
    }),
    /**
     * Datatable Columns
     */
    columns () {
      return [
        'actions',
        'reference_number',
        'driver_vehicle',
        'last_name',
        'first_name',
        'address_1',
        'address_2',
        'city',
        'state_province',
        'postal_code',
        'county',
        'phone',
        'mobile',
        'email',
        'employee_id',
        'misc_1',
        'misc_2',
        'misc_3',
        'misc_4'
      ]
    },
    /**
     * Datatable headers
     */
    headers () {
      return [
        {
          text: this.$i18n.t('actions'),
          value: 'actions',
          class: 'report-column',
          align: 'center',
          divider: true
        },
        {
          text: this.$i18n.t('driver_reference_number'),
          value: 'reference_number',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('vehicle_number'),
          value: 'driver_vehicle',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('driver_last_name'),
          value: 'last_name',
          class: 'report-column',
          width: 250,
          divider: true
        },
        {
          text: this.$i18n.t('driver_first_name'),
          value: 'first_name',
          class: 'report-column',
          width: 150,
          divider: true
        },
        {
          text: this.$i18n.t('driver_address_1'),
          value: 'address_1',
          class: 'report-column',
          width: 250,
          divider: true
        },
        {
          text: this.$i18n.t('driver_address_2'),
          value: 'address_2',
          class: 'report-column',
          width: 250,
          divider: true
        },
        {
          text: this.$i18n.t('driver_city'),
          value: 'city',
          class: 'report-column',
          width: 250,
          divider: true
        },
        {
          text: this.$i18n.t('driver_state_province'),
          value: 'state_province',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('driver_postal_code'),
          value: 'postal_code',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('driver_county'),
          value: 'county',
          class: 'report-column',
          width: 250,
          divider: true
        },
        {
          text: this.$i18n.t('driver_phone'),
          value: 'phone',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('driver_mobile'),
          value: 'mobile',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('driver_email_address'),
          value: 'email',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('driver_employee_id'),
          value: 'employee_id',
          class: 'report-column',
          divider: true
        },
        {
          text: this.custom_labels.driver_use_label_1 || this.$i18n.t('driver_use_label_1'),
          value: 'misc_1',
          class: 'report-column',
          divider: true
        },
        {
          text: this.custom_labels.driver_use_label_2 || this.$i18n.t('driver_use_label_2'),
          value: 'misc_2',
          class: 'report-column',
          divider: true
        },
        {
          text: this.custom_labels.driver_use_label_3 || this.$i18n.t('driver_use_label_3'),
          value: 'misc_3',
          class: 'report-column',
          divider: true
        },
        {
          text: this.custom_labels.driver_use_label_4 || this.$i18n.t('driver_use_label_4'),
          value: 'misc_4',
          class: 'report-column',
          divider: true
        }
      ]
    }
  },
  methods: {
    /**
     * Vuex Actions
     */
    ...mapActions({
      fetchDrivers: 'drivers/fetchDrivers'
    }),
    dialTo,
    emailTo,
    editDriver (item) {
      this.driverId = item.reference_number
      this.driver_dialog = true
    },
    async saved () {
      console.log('saved!')
      // the form fired the 'saved' event, so re-fetch the drivers
      await this.$fetch()
      this.driver_dialog = false
    }
  },
  /**
   * Page Meta
   */
  head () {
    const title = this.$t('manage_drivers')
    return {
      title,
      meta: [
        { hid: 'og:description', property: 'og:description', content: title }
      ]
    }
  }
}
</script>
