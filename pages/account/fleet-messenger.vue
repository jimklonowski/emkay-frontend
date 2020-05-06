<template>
  <v-card>
    <v-card-title class="font-lato">
      {{ $t('fleet_messenger') }}
    </v-card-title>
    <v-tabs v-model="tab" background-color="transparent" grow centered>
      <v-tab>{{ $t('new_message') }}</v-tab>
      <v-tab>{{ $t('distribution_lists') }}</v-tab>
      <v-tab>{{ $t('chat') }}</v-tab>
      <v-tab>{{ $t('history') }}</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab" style="background-color:transparent;">
      <v-tab-item>
        <v-card-text>
          <new-message />
        </v-card-text>
      </v-tab-item>
      <v-tab-item>
        <v-card-text>
          <distribution-lists />
        </v-card-text>
      </v-tab-item>
      <v-tab-item>
        <v-card-text>
          TODO: chat
        </v-card-text>
      </v-tab-item>
      <v-tab-item>
        <v-card-text>
          TODO: history
        </v-card-text>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex'
import DistributionLists from '@/components/account/fleet-messenger/DistributionLists'
import NewMessage from '@/components/account/fleet-messenger/NewMessage'
export default {
  name: 'FleetMessenger',
  components: {
    DistributionLists,
    NewMessage
  },
  async fetch () {
    await this.fetchDrivers()
  },
  data: () => ({
    tab: 0
  }),
  methods: {
    ...mapActions({
      fetchDrivers: 'drivers/fetchDrivers'
    })
  }
}
</script>
