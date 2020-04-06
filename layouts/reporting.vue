<template>
  <v-app>
    <emkay-navigation />
    <v-content>
      <reporting-navigation />
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <emkay-footer />
    <client-only>
      <scroll-top-fab />
      <vue-snotify />
    </client-only>
  </v-app>
</template>

<script>
import EmkayNavigation from '@/components/core/EmkayNavigation'
import ReportingNavigation from '@/components/reporting/ReportingNavigation'
import EmkayFooter from '@/components/core/EmkayFooter'
import ScrollTopFab from '@/components/core/ScrollTopFab'
import { htmlLang } from '@/mixins/meta'
export default {
  components: {
    EmkayNavigation,
    ReportingNavigation,
    EmkayFooter,
    ScrollTopFab
  },
  middleware: ['check-auth', 'account'],
  mixins: [htmlLang]
}
</script>
