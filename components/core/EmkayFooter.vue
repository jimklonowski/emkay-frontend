<template>
  <v-footer fixed app>
    <v-btn
      :ripple="false"
      color="secondary"
      disabled
      depressed
      x-small
      text
      nuxt
    >
      <v-icon class="mr-2" x-small v-text="'mdi-copyright'" />
      {{ $moment().year() }} - {{ $t('emkay_inc') }}
    </v-btn>
    <v-spacer />
  </v-footer>
</template>

<script>
export default {
  data: () => ({
    menus: []
  })
}
</script>
