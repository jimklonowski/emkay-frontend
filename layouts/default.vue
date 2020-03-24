<template>
  <v-app>
    <emkay-navigation />
    <v-content>
      <nuxt />
    </v-content>
    <emkay-footer />
  </v-app>
</template>

<script>
import EmkayFooter from '@/components/core/EmkayFooter'
import EmkayNavigation from '@/components/core/EmkayNavigation'
export default {
  components: {
    EmkayFooter,
    EmkayNavigation
  }
}
</script>
