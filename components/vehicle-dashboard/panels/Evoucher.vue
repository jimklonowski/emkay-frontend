<template>
  <v-card flat tile>
    <v-skeleton-loader :loading="$fetchState.pending" type="card">
      <v-card-text>
        <v-alert type="info" icon="mdi-calendar" color="primary">
          {{ $t('evoucher_header') }}
        </v-alert>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <!-- <p class="body-2 mx-4 text-justify" v-html="$tc('evoucher_message', [currentOdometerText, currentOdometerDate])" /> -->
        <i18n path="evoucher_message" tag="p" class="body-2 mx-4 text-justify">
          <span place="miles"><strong>{{ currentOdometerText }}</strong></span>
          <span place="date"><strong>{{ currentOdometerDate }}</strong></span>
        </i18n>
        <v-subheader class="justify-center">
          {{ $t('evoucher_disregard_message') }}
        </v-subheader>

        <v-card class="ma-8" outlined>
          <v-card-title class="body-2 font-weight-light">
            {{ $t('evoucher_services_header') }} <strong class="ml-2">{{ $tc('formatters.miles', $options.filters.number(evoucher.next_pm_odometer)) }}</strong>.
          </v-card-title>
          <v-divider />
          <v-card-text>
            <p class="caption">
              {{ evoucher.special_text }}
            </p>
            <v-list flat dense>
              <v-list-item v-for="(service, s) in evoucher.services" :key="`service-${s}`">
                <v-list-item-title v-text="service" />
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <span>{{ nextOdometerText }}</span>
            <v-spacer />
            <span>{{ $t('voucher_number') }} #{{ evoucher.maintenance_voucher_number || '--' }}</span>
          </v-card-actions>
        </v-card>

        <v-alert type="info" color="primary" dense>
          {{ $t('evoucher_instruction_header') }}
        </v-alert>
        <v-row>
          <v-col cols="12" md="6">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <p class="body-2 text-justify" v-html="$t('evoucher_instruction_message')" />
          </v-col>
          <v-col cols="12" md="6">
            <v-card outlined>
              <v-list dense>
                <v-list-item>
                  <v-list-item-title v-text="$t('authorized_only_on_vin')" />
                  <v-list-item-subtitle>{{ evoucher.vin || '--' }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title v-text="$t('vehicle_number')" />
                  <v-list-item-subtitle>{{ evoucher.vehicle_number || '--' }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title v-text="$t('year_make_model')" />
                  <v-list-item-subtitle>{{ yearMakeModel || '--' }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title v-text="$t('odometer')" />
                  <v-list-item-subtitle>{{ currentOdometerText }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
      <!-- <v-card-text v-else>
        no voucher found
      </v-card-text> -->
    </v-skeleton-loader>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  /**
   * Fetch eVoucher
   */
  async fetch () {
    await this.fetchEvoucher()
  },
  computed: {
    /**
     * Vuex Getters
     */
    ...mapGetters({
      evoucher: 'vehicle-dashboard/getEvoucher',
      vehicle_number: 'vehicle-dashboard/getVehicleNumber'
    }),
    evoucherServices () {
      return this.evoucher && this.evoucher.services && this.evoucher.services.filter(Boolean).join(' :: ')
    },
    hasEvoucher: vm => Object.keys(vm.evoucher).length > 0,
    currentOdometerDate: vm => vm.$options.filters.date(vm.evoucher.odometer_date || vm.$moment()),
    currentOdometerText: vm => vm.$i18n.tc('formatters.miles', vm.$options.filters.number(vm.evoucher.odometer)),
    nextOdometerText: vm => vm.$i18n.tc('formatters.miles', vm.$options.filters.number(vm.evoucher.next_pm_odometer)),
    yearMakeModel: vm => [vm.evoucher.model_year, vm.evoucher.vehicle_make, vm.evoucher.vehicle_model].filter(Boolean).join(' ')
  },
  methods: {
    /**
     * Vuex Actions
     */
    ...mapActions({
      fetchEvoucher: 'vehicle-dashboard/fetchEvoucher'
    })
  }
}
</script>
