<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :items-per-page="5"
    :loading="$fetchState.pending"
    :mobile-breakpoint="0"
    :sort-by="['date']"
    :sort-desc="[true]"
    class="striped"
  >
    <!-- <template #top>
      <v-container>
        <v-dialog v-model="dialog" max-width="800">
          <template #activator="{ on }">
            <v-btn color="primary" depressed v-on="on">
              <v-icon class="mr-2" v-text="'mdi-note-plus'" />
              {{ $t('add_note') }}
            </v-btn>
          </template>
          <add-note-form />
        </v-dialog>
      </v-container>
      <v-divider />
    </template> -->
  </v-data-table>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  /**
   * Fetch Transports
   */
  async fetch () {
    await this.fetchTransportHistory({ vehicle: this.vehicle_number })
  },
  data: () => ({
    dialog: false
  }),
  computed: {
    /**
     * Vuex Getters
     */
    ...mapGetters({
      items: 'vehicle-dashboard/getTransportHistory',
      vehicle_number: 'vehicle-dashboard/getVehicleNumber'
    }),
    /**
     * Datatable headers
     */
    headers () {
      return [
        {
          text: this.$i18n.t('order_date'),
          value: 'order_date',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('order_#'),
          value: 'order_#',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('pickup_location'),
          value: 'pickup_location',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('delivery_location'),
          value: 'delivery_location',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('actions'),
          value: 'actions',
          class: 'report-column'
        }
      ]
    }
  },
  methods: {
    /**
     * Vuex Actions
     */
    ...mapActions({
      fetchTransportHistory: 'vehicle-dashboard/fetchTransportHistory'
    })
  }
}
</script>
