<template>
  <v-app>
    <emkay-navigation />
    <v-content>
      <account-navigation />
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
import AccountNavigation from '@/components/account/AccountNavigation'
import EmkayFooter from '@/components/core/EmkayFooter'
import { htmlLang } from '@/mixins/meta'
export default {
  name: 'Account',
  components: {
    EmkayNavigation,
    AccountNavigation,
    EmkayFooter
  },
  mixins: [htmlLang],
  middleware: ['check-auth', 'account']
}
</script>
