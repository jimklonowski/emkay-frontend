<template>
  <v-skeleton-loader :loading="!initialized" type="table">
    <v-data-table
      :footer-props="{ itemsPerPageOptions: [10, 25, 50, 100, -1] }"
      :headers="headers"
      :items="items"
      :items-per-page="5"
      :loading="loading"
      :mobile-breakpoint="0"
      :sort-by="['card_#']"
      :sort-desc="[true]"
      class="striped"
    >
      <template #issue_date="{ item }">
        {{ item.issue_date | date }}
      </template>
      <template #item.expiration_date="{ item }">
        {{ item.expiration_date | date }}
      </template>
      <template #item.status="{ item }">
        <v-chip :outlined="$vuetify.theme.dark" x-small>
          {{ item.status }}
        </v-chip>
      </template>
      <template #item.authorization_profile_id="{ item }">
        <v-dialog v-model="authorization_profile_dialog" max-width="1200" scrollable>
          <template #activator="{ on }">
            <v-btn color="primary" small text tile v-on="on">
              <v-icon class="mr-2" v-text="'mdi-eye'" />
              {{ $t('view') }}
            </v-btn>
          </template>
          {{ item.authorization_profile_id }}
        </v-dialog>
      </template>
      <template #item.actions="{ item }">
        <v-dialog v-model="card_request_dialog" max-width="1200" scrollable>
          <template #activator="{ on }">
            <v-btn color="error" small text tile v-on="on">
              <v-icon class="mr-2" v-text="'mdi-credit-card-off'" />
              {{ $t('reorder_or_terminate') }}
            </v-btn>
          </template>
          {{ item.actions }}
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
    card_request_dialog: false,
    initialized: false,
    search: ''
  }),
  computed: {
    ...mapGetters({
      items: 'vehicle-dashboard/getFuelCards',
      loading: 'vehicle-dashboard/getFuelCardsLoading',
      vehicle_number: 'vehicle-dashboard/getVehicleNumber'
    }),
    columns () {
      return [
        'card_number',
        'vendor',
        'issue_date',
        'expiration_date',
        'restrictions',
        'pin',
        'status',
        'authorization_profile_id',
        ''
      ]
    },
    headers () {
      return [
        {
          text: this.$i18n.t('card_#'),
          value: 'card_number',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('vendor'),
          value: 'vendor',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('issue_date'),
          value: 'issue_date',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('expiration_date'),
          value: 'expiration_date',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('restrictions'),
          value: 'restrictions',
          class: 'report-column',
          divider: true,
          width: 300
        },
        {
          text: this.$i18n.t('pin'),
          value: 'pin',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('status'),
          value: 'status',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('authorization_profile'),
          value: 'authorization_profile_id',
          class: 'report-column',
          divider: true,
          align: 'center'
        },
        {
          text: this.$i18n.t('actions'),
          value: 'actions',
          class: 'report-column',
          align: 'center'
        }
      ]
    }
  },
  async mounted () {
    await this.fetchFuelCards({ vehicle: this.vehicle_number })
    this.initialized = true
  },
  methods: {
    ...mapActions({
      fetchFuelCards: 'vehicle-dashboard/fetchFuelCards'
    })
  }
}
</script>
