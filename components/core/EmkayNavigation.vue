<template>
  <nav>
    <client-only>
      <v-navigation-drawer
        v-model="sidebar"
        clipped
        fixed
        disable-route-watcher
        app
      >
        <template v-if="$auth.loggedIn" #prepend>
          <v-list-item class="pa-4">
            <v-list-item-avatar color="primary darken-2 white--text">
              {{ avatarText }}
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ account }}</v-list-item-title>
              <v-list-item-subtitle>{{ user }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider />
        </template>

        <v-list>
          menu items
        </v-list>

        <template v-if="$auth.loggedIn" #append>
          <v-list-item @click="logout">
            <v-list-item-action>
              <v-icon v-text="'mdi-logout'" />
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ $t('logout') }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-navigation-drawer>
    </client-only>

    <v-app-bar
      height="64"
      clipped-left
      clipped-right
      fixed
      app
    >
      <v-app-bar-nav-icon @click.stop="toggleSidebar" />
      <v-toolbar-title v-text="$t('emkay')" />

      <v-spacer />

      <v-toolbar-items>
        menu items
      </v-toolbar-items>

      <v-divider vertical inset class="mx-4" />
      dark mode toggle
      language picker
    </v-app-bar>
  </nav>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  computed: {
    sidebar: {
      get () {
        return this.$store.getters['account/getSidebar']
      },
      set (val) {
        this.setSidebar(val)
      }
    },
    account: vm => vm.$auth.user.account,
    user: vm => vm.$auth.user.username,
    avatarText: vm => vm.$auth.user.account && vm.$auth.user.account.substr(0, 2)
  },
  methods: {
    ...mapActions({
      logout: 'account/logout',
      setSidebar: 'account/setSidebar',
      toggleSidebar: 'account/toggleSidebar'
    })
  }
}
</script>
