<template>
  <v-skeleton-loader :loading="!initialized" type="table">
    <v-data-table
      :footer-props="{ itemsPerPageOptions: [10, 25, 50, 100, -1] }"
      :headers="headers"
      :items="items"
      :items-per-page="25"
      :loading="loading"
      :mobile-breakpoint="0"
      :search="search"
      :sort-by="['date']"
      :sort-desc="[true]"
      class="striped"
    >
      <template #items.details="{ items }">
        <v-dialog v-model="authorization_profile_dialog">
          <template #activator="{ on }">
            <v-btn color="primary" small text tile v-on="on">
              <v-icon class="mr-2" v-text="'mdi-eye'" />
              {{ $t('view') }}
            </v-btn>
          </template>
          {{ items }}
        </v-dialog>
      </template>
    </v-data-table>
  </v-skeleton-loader>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { downloadFields } from '@/mixins/datatables'
export default {
  mixins: [downloadFields],
  data: () => ({
    authorization_profile_dialog: false,
    initialized: false,
    search: ''
  }),
  computed: {
    ...mapGetters({
      items: 'vehicle-dashboard/getFuelAuthorizationProfiles',
      loading: 'vehicle-dashboard/getFuelAuthorizationProfilesLoading',
      vehicle_number: 'vehicle-dashboard/getVehicleNumber'
    }),
    columns () {
      return [
        'id',
        'authorization_profile',
        'center',
        'sort',
        'vehicle_type',
        'restrictions',
        'card_type'
      ]
    },
    headers () {
      return [
        {
          text: this.$i18n.t('id'),
          value: 'id',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('authorization_profile'),
          value: 'authorization_profile',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('center'),
          value: 'center',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('sort'),
          value: 'sort',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('vehicle_type'),
          value: 'vehicle_type',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('restrictions'),
          value: 'restrictions',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('card_type'),
          value: 'card_type',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('details'),
          value: 'details',
          class: 'report-column'
        }
      ]
    }
  },
  async mounted () {
    await this.fetchFuelAuthorizationProfiles({ vehicle: this.vehicle_number })
    this.initialized = true
  },
  methods: {
    ...mapActions({
      fetchFuelAuthorizationProfiles: 'vehicle-dashboard/fetchFuelAuthorizationProfiles'
    })
  }
}
</script>
