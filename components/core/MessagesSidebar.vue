<template>
  <v-navigation-drawer
    v-model="right_sidebar"
    app
    clipped
    temporary
    right
    width="350"
  >
    <template #prepend>
      <h1 class="pa-4 text-center">
        Message Center
      </h1>
    </template>
    <v-list subheader>
      <v-subheader class="subtitle-1 mt-8 font-lato">
        {{ $t('emkay_updates') }}
      </v-subheader>
      <template v-for="(login_message, m) in login_messages">
        <v-list-item :key="`login_message-${m}`" link three-line @click="open(login_message.link)">
          <v-list-item-content>
            <p class="overline grey--text">
              {{ login_message.date | date }}
            </p>
            <v-list-item-title class="subtitle-2" v-text="login_message.title" />
            <v-list-item-subtitle class="caption" v-text="login_message.text" />
          </v-list-item-content>
        </v-list-item>
        <v-divider :key="`lm-divider-${m}`" />
      </template>

      <v-subheader class="subtitle-1 mt-8 font-lato">
        {{ $t('fleet_messages') }}
      </v-subheader>
      <template v-for="(fleet_message, m) in fleet_messages">
        <v-list-item :key="`fleet_message-${m}`" link two-line>
          <v-list-item-content>
            <p class="overline grey--text">
              {{ fleet_message.date | date }}
            </p>
            <v-list-item-title>
              {{ [fleet_message.to, fleet_message.from].filter(Boolean).join(', ') }}
            </v-list-item-title>
            <v-list-item-subtitle v-text="fleet_message.title" />
            <v-list-item-subtitle class="caption" v-text="fleet_message.text" />
          </v-list-item-content>
        </v-list-item>
        <v-divider :key="`fm-divider-${m}`" />
      </template>
      <div class="d-flex">
        <v-spacer />
        <nuxt-link to="/fleet-messages" class="text-decoration-none subtitle-2 pa-2">
          {{ $t('fleet_messages') }}
        </nuxt-link>
      </div>
      <v-subheader class="subtitle-1 mt-8 font-lato">
        {{ $t('critical_alerts') }}
      </v-subheader>
      <template v-for="(alert, a) in critical_alerts">
        <v-list-item :key="`alert-${a}`" link>
          <v-list-item-title class="subtitle-2">
            <v-chip class="mr-2" small>
              {{ alert.value }}
            </v-chip>
            <span v-text="$t(alert.key)" />
          </v-list-item-title>
        </v-list-item>
        <v-divider :key="`ca-divider-${a}`" />
      </template>
      <div class="d-flex">
        <v-spacer />
        <nuxt-link :to="localePath({ path: '/account/critical-alerts' })" class="text-decoration-none subtitle-2 pa-2">
          {{ $t('critical_alerts') }}
        </nuxt-link>
      </div>
    </v-list>
    <!-- <template #append>
      append
    </template> -->
  </v-navigation-drawer>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      critical_alerts: 'account/getCriticalAlerts',
      fleet_messages: 'account/getFleetMessages',
      login_messages: 'account/getLoginMessages'
    }),
    right_sidebar: {
      get () {
        return this.$store.getters['account/getRightSidebar']
      },
      set (val) {
        this.setRightSidebar(val)
      }
    }
  },
  methods: {
    ...mapActions({
      setRightSidebar: 'account/setRightSidebar'
    }),
    open (link) {
      window.open(link)
    }
  }
}
</script>
