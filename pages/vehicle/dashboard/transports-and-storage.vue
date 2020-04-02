<template>
  <v-card outlined tile>
    <v-toolbar height="72" elevation="1" tile color="transparent">
      <v-tabs
        v-model="tab"
        centered
        grow
        icons-and-text
        mandatory
      >
        <v-tab>
          {{ $t('transport_storage_status') }}
          <v-icon v-text="'mdi-calendar-clock'" />
        </v-tab>
        <v-tab>
          {{ $t('create_transport_storage_order') }}
          <v-icon v-text="'mdi-truck-delivery'" />
        </v-tab>
      </v-tabs>
    </v-toolbar>
    <v-divider />
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <transport-history-table />
      </v-tab-item>
      <v-tab-item>
        <transport-storage-request-form />
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import DatatableLoading from '@/components/vehicle-dashboard/datatables/DatatableLoading'
export default {
  name: 'VehicleTransportsAndStorage',
  layout: 'vehicle-dashboard',
  components: {
    'transport-history-table': () => ({
      component: import(/* webpackChunkName: "TransportHistoryTable" */ '@/components/vehicle-dashboard/datatables/TransportHistoryTable.vue'),
      loading: DatatableLoading,
      delay: 0
    }),
    'transport-storage-request-form': () => ({
      component: import(/* webpackChunkName: "TransportStorageRequestForm" */ '@/components/vehicle-dashboard/forms/TransportStorageRequestForm.vue'),
      loading: DatatableLoading,
      delay: 0
    })
  },
  /**
   * Preselect datatable history tab or create new request tab
   */
  asyncData ({ app, route }) {
    switch (route.hash.substr(1)) {
      case 'new': return { tab: 1 }
      case 'history':
      default: return { tab: 0 }
    }
  },
  computed: {
    ...mapGetters({
      vehicle_number: 'vehicle-dashboard/getVehicleNumber'
    })
  },
  /**
   * Clear hash on mounted
   */
  mounted () {
    if (this.$route.hash.length > 0) {
      this.$router.replace({ hash: undefined })
    }
  },
  /**
   * Page Meta
   */
  head () {
    const title = `${this.vehicle_number} - ${this.$t('transports_and_storage')}`
    return {
      title,
      meta: [
        { hid: 'og:description', property: 'og:description', content: title }
      ]
    }
  }
}
</script>
