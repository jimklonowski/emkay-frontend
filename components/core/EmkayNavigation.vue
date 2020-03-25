<template>
  <nav>
    <client-only>
      <v-navigation-drawer
        v-if="$auth.loggedIn"
        :value="sidebar"
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

        <v-list nav>
          <template v-for="(item, i) in sidebar_items">
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
          <!-- <v-list-group
            v-for="(item, i) in sidebar_items"
            :key="`menu-${i}`"
            :to="localePath(item.to)"
            exact
            nuxt
          >
            <template #activator>
              <v-list-item-action>
                <v-icon v-text="item.icon" />
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{ $t(item.key) }}</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item
              v-for="subItem in item.items"
              :key="subItem.key"
            >
              <v-list-item-content>
                <v-list-item-title v-text="$t(subItem.key)" />
              </v-list-item-content>
            </v-list-item>
          </v-list-group> -->
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
      <v-app-bar-nav-icon @click="toggleSidebar" />
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
    </v-app-bar>
  </nav>
</template>

<script>
import { mapActions } from 'vuex'
import { account, ordering, reporting } from '@/static/mega-menus'
import DarkModeToggle from '@/components/core/DarkModeToggle'
import LanguagePicker from '@/components/core/LanguagePicker'
import MegaMenu from '@/components/core/MegaMenu'
export default {
  menus: {
    account,
    ordering,
    reporting
  },
  components: {
    DarkModeToggle,
    LanguagePicker,
    MegaMenu
  },
  computed: {
    accountMenu: vm => vm.$options.menus.account,
    orderingMenu: vm => vm.$options.menus.ordering,
    reportingMenu: vm => vm.$options.menus.reporting,
    // sidebar: vm => vm.$store.getters['account/getSidebar'],
    sidebar: {
      get () {
        return this.$store.getters['account/getSidebar']
      },
      set (val) {
        this.setSidebar(val)
      }
    },
    sidebar_items () {
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
            { key: 'fleet_reports', icon: '', to: { path: '/fleet-reports' } },
            { key: 'my_reports', icon: '', to: { path: '/my-reports' } }
          ]
        },
        { key: 'ordering', icon: 'mdi-timetable', to: { path: '/ordering' } }
        // { key: 'fleet_dashboard', icon: 'mdi-chart-areaspline', to: { path: '/fleet' } },
        // { key: 'my_reports', icon: 'mdi-file-certificate', to: { path: '/my-reports' } },
        // { key: 'reports', icon: 'mdi-file-chart-outline', to: { path: '/reports' } },
        // { key: 'vehicle_dashboard', icon: 'mdi-car-cruise-control', to: { path: '/vehicle' } }
      ]
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
