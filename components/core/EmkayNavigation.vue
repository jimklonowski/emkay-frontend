<template>
  <nav>
    <client-only>
      <v-navigation-drawer
        v-if="$auth.loggedIn"
        :value="left_sidebar"
        clipped
        fixed
        disable-route-watcher
        app
      >
        <template v-if="$auth.loggedIn" #prepend>
          <v-list-item class="pa-4">
            <v-list-item-avatar color="primary darken-2 white--text">
              {{ avatar_text }}
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ current_account }}</v-list-item-title>
              <v-list-item-subtitle>{{ current_user }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider />
        </template>

        <v-list nav>
          <template v-for="(item, i) in left_sidebar_items">
            <v-list-group v-if="item.children" :key="`item-${i}`">
              <template #activator>
                <v-list-item-action>
                  <v-icon v-text="item.icon" />
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title v-text="$t(item.key)" />
                </v-list-item-content>
              </template>
              <v-list-item
                v-for="(child, c) in item.children"
                :key="`item-child-${c}`"
                :to="localePath(child.to)"
                dense
                exact
                nuxt
              >
                <v-list-item-action>
                  <v-icon v-text="child.icon" />
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title v-text="$t(child.key)" />
                </v-list-item-content>
              </v-list-item>
            </v-list-group>
            <v-list-item v-else :key="`item-${i}`" :to="localePath(item.to)" exact nuxt>
              <v-list-item-action>
                <v-icon v-text="item.icon" />
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title v-text="$t(item.key)" />
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list>

        <template v-if="$auth.loggedIn" #append>
          <v-divider />
          <v-list-item nav @click="logout">
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
      <v-app-bar-nav-icon aria-label="Open Sidebar" @click="toggleLeftSidebar" />
      <v-toolbar-title v-text="$t('emkay')" />

      <v-spacer />

      <v-toolbar-items v-show="$auth.loggedIn">
        <mega-menu :menu="accountMenu" />
        <mega-menu :menu="orderingMenu" />
        <mega-menu :menu="reportingMenu" />
      </v-toolbar-items>

      <v-divider vertical inset class="mx-4" />

      <dark-mode-toggle class="mx-1" />
      <language-picker class="mx-1" />
      <v-btn v-show="$auth.loggedIn" icon @click="toggleMessagesSidebar">
        <v-badge color="error" dot left overlap offset-x="12">
          <v-icon v-text="'mdi-bell'" />
        </v-badge>
      </v-btn>
    </v-app-bar>

    <messages-sidebar v-show="$auth.loggedIn" />
  </nav>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { account, ordering, reporting } from '@/assets/mega-menus'
import DarkModeToggle from '@/components/core/DarkModeToggle'
import LanguagePicker from '@/components/core/LanguagePicker'
import MegaMenu from '@/components/core/MegaMenu'
import MessagesSidebar from '@/components/core/MessagesSidebar'
export default {
  components: {
    DarkModeToggle,
    LanguagePicker,
    MegaMenu,
    MessagesSidebar
  },
  data: () => ({
    right_sidebar: false
  }),
  computed: {
    ...mapGetters({
      login_messages: 'account/getLoginMessages'
    }),
    accountMenu: () => account,
    orderingMenu: () => ordering,
    reportingMenu: () => reporting,
    left_sidebar: {
      get () {
        return this.$store.getters['account/getLeftSidebar']
      },
      set (val) {
        this.setLeftSidebar(val)
      }
    },
    left_sidebar_items () {
      return [
        { key: 'home', icon: 'mdi-home', to: { path: '/' } },
        { key: 'account', icon: 'mdi-apps', to: { path: '/account' } },
        {
          key: 'dashboards',
          icon: 'mdi-car-cruise-control',
          to: {},
          children: [
            { key: 'fleet_dashboard', icon: '', to: { path: '/fleet' } },
            { key: 'vehicle_dashboard', icon: '', to: { path: '/vehicle' } }
          ]
        },
        {
          key: 'reporting',
          icon: 'mdi-file-chart-outline',
          to: {},
          children: [
            { key: 'fleet_reports', icon: '', to: { path: '/reporting' } },
            { key: 'my_reports', icon: '', to: { path: '/my-reports' } }
          ]
        },
        { key: 'ordering', icon: 'mdi-timetable', to: { path: '/ordering' } }
      ]
    },
    current_account: vm => vm.$auth.user.account,
    current_user: vm => vm.$auth.user.username,
    avatar_text: vm => vm.$auth.user.account && vm.$auth.user.account.substr(0, 2)
  },
  methods: {
    ...mapActions({
      logout: 'account/logout',
      setLeftSidebar: 'account/setLeftSidebar',
      toggleLeftSidebar: 'account/toggleLeftSidebar',
      toggleMessagesSidebar: 'account/toggleRightSidebar'
    })
  }
}
</script>
