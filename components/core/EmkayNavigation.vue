<template>
  <nav>
    <v-navigation-drawer
      v-model="sidebar"
      clipped
      fixed
      disable-route-watcher
      app
    >
      <template v-if="$auth.loggedIn" #prepend>
        logged in prepend
      </template>
      <v-list>
        menu items
      </v-list>
      <template v-if="$auth.loggedIn" #append>
        logged in append
      </template>
    </v-navigation-drawer>
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
    }
  },
  methods: {
    ...mapActions({
      setSidebar: 'account/setSidebar',
      toggleSidebar: 'account/toggleSidebar'
    })
  }
}
</script>
