<template>
  <v-app>
    <emkay-navigation />
    <v-content>
      <nuxt />
    </v-content>
    <emkay-footer />
    <client-only>
      <vue-snotify />
    </client-only>
  </v-app>
</template>

<script>
import EmkayNavigation from '@/components/core/EmkayNavigation'
import EmkayFooter from '@/components/core/EmkayFooter'
export default {
  components: {
    EmkayNavigation,
    EmkayFooter
  }
}
</script>
