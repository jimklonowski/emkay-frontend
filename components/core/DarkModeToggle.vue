<template>
  <v-btn
    :title="$t('dark_mode')"
    icon
    @click.stop="toggleDarkMode()"
  >
    <v-icon v-text="$vuetify.theme.dark ? 'mdi-brightness-4' : 'mdi-brightness-7'" />
  </v-btn>
</template>

<script>
export default {
  methods: {
    toggleDarkMode () {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
      this.$cookies.set('dark_mode', this.$vuetify.theme.dark, { path: '/', maxAge: 60 * 60 * 24 * 7, secure: true })
    }
  }
}
</script>
