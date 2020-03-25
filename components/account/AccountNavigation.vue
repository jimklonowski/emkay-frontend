<template>
  <v-sheet>
    <v-app-bar
      :src="require('@/assets/images/blurrycar.jpg')"
      :elevate-on-scroll="false"
      dark
      extended
      prominent
      flat
      hide-on-scroll
      elevation="1"
      scroll-threshold="60"
    >
      <template #img="{ props }">
        <v-img
          v-bind="props"
          gradient="to top right, rgba(100,115,201,.7), rgba(25,32,72,.7)"
        />
      </template>
      <v-toolbar-title>
        <nuxt-link :to="localePath({ path: '/account' })" class="text-decoration-none white--text">
          {{ $t('account_management') }}
        </nuxt-link>
      </v-toolbar-title>
      <template #extension>
        <v-tabs
          v-model="tab"
          :dark="false"
          show-arrows
          left
          background-color="transparent"
          color="white"
          @change="$vuetify.goTo(0)"
        >
          <v-tab v-for="(category, c) in menu.categories" :key="`tab-${c}`" text>
            <v-icon v-text="category.icon" />
            {{ $t(category.key) }}
          </v-tab>
        </v-tabs>
      </template>
    </v-app-bar>
    <v-card :style="$vuetify.theme.dark ? 'border-bottom: thin solid rgba(255, 255, 255, 0.12)' : 'border-bottom: thin solid rgba(0, 0, 0, .12)'" flat tile>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-subheader v-text="$t('select_an_action')" />
            <v-tabs-items v-model="tab" style="background-color:transparent;">
              <v-tab-item v-for="(category, c) in menu.categories" :key="`tabitem-${c}`">
                <v-flex>
                  <v-chip
                    v-for="(action, a) in category.items"
                    :key="`action-${c}-${a}`"
                    :to="{ path: localePath(action.to), hash: $route.hash }"
                    :color="$route.path.includes(action.to.path) ? 'primary' : undefined"
                    :outlined="!$route.path.includes(action.to.path)"
                    class="ma-2"
                    nuxt
                  >
                    <v-icon left v-text="action.icon" />
                    {{ $t(action.key) }}
                  </v-chip>
                </v-flex>
              </v-tab-item>
            </v-tabs-items>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-sheet>
</template>

<script>
import { account } from '@/static/mega-menus'
export default {
  data: () => ({
    tab: 0
  }),
  computed: {
    menu () {
      return account
    }
  }
}
</script>
