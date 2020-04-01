<template>
  <v-app>
    <emkay-navigation />
    <v-content>
      <my-reports-navigation />
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
import MyReportsNavigation from '@/components/reporting/MyReportsNavigation'
import EmkayFooter from '@/components/core/EmkayFooter'
import { htmlLang } from '@/mixins/meta'
export default {
  components: {
    EmkayNavigation,
    MyReportsNavigation,
    EmkayFooter
  },
  middleware: ['check-auth', 'account'],
  mixins: [htmlLang]
}
</script>
