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
export default {
  components: {
    EmkayNavigation,
    AccountNavigation,
    EmkayFooter
  },
  middleware: ['check-auth', 'account']
}
</script>
