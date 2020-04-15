<template>
  <span>
    <v-app-bar
      :src="require('@/assets/images/myreports.jpg')"
      :elevate-on-scroll="false"
      dark
      extended
      prominent
      flat
      hide-on-scroll
      elevation="1"
      scroll-threshold="60"
      class="emkay-image-nav"
    >
      <template #img="{ props }">
        <v-img
          v-bind="props"
          gradient="to top right, rgba(100,115,201,.7), rgba(25,32,72,.7)"
        />
      </template>
      <v-toolbar-title>
        <nuxt-link :to="localePath({ path: '/my-reports' })" class="text-decoration-none white--text">
          {{ $t('my_reports') }}
        </nuxt-link>
      </v-toolbar-title>
      <template #extension>
        <div class="body-2 font-weight-light">(i18n)Load a saved report or build your own!</div>
      </template>
    </v-app-bar>
    <!-- <v-card :style="$vuetify.theme.dark ? 'border-bottom: thin solid rgba(255, 255, 255, 0.12)' : 'border-bottom: thin solid rgba(0, 0, 0, .12)'" flat tile>
      <v-expansion-panels v-model="panels_expanded">
        <v-expansion-panel>
          <v-expansion-panel-header>{{ $t('load_a_saved_report') }}</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <my-reports-profiles />
                </v-col>
              </v-row>
            </v-container>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card> -->
  </span>
</template>

<script>
// import { mapActions, mapGetters } from 'vuex'
export default {
  // components: {
  //   'my-reports-profiles': () => import(/* webpackChunkName: "MyReportsProfiles" */ '@/components/reporting/MyReportsProfiles.vue')
  // }
}
</script>
