<template>
  <v-btn
    :title="$t('dark_mode')"
    icon
    @click.stop="$vuetify.theme.dark = !$vuetify.theme.dark"
  >
    <v-icon v-text="$vuetify.theme.dark ? 'mdi-brightness-4' : 'mdi-brightness-7'" />
  </v-btn>
</template>
