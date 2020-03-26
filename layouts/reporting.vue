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
      <vue-snotify />
    </client-only>
  </v-app>
</template>

<script>
import EmkayNavigation from '@/components/core/EmkayNavigation'
import ReportingNavigation from '@/components/reporting/ReportingNavigation'
import EmkayFooter from '@/components/core/EmkayFooter'
export default {
  components: {
    EmkayNavigation,
    ReportingNavigation,
    EmkayFooter
  },
  middleware: ['check-auth', 'account']
}
</script>
