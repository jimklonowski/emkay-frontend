<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    offset-y
  >
    <template #activator="{ on }">
      <v-btn :title="$t('language')" icon v-on="on">
        <v-icon v-text="icon" />
      </v-btn>
    </template>
    <v-card>
      <v-list>
        <v-list-item v-for="locale in availableLocales" :key="locale.code">
          <v-btn
            :disabled="$i18n.locale === locale.code"
            :outlined="$i18n.locale === locale.code"
            small
            text
            block
            nuxt
            @click="changeLocale(locale)"
          >
            {{ locale.name }}
          </v-btn>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  data: () => ({
    icon: 'mdi-web',
    menu: false
  }),
  computed: {
    availableLocales: vm => vm.$i18n.locales
  },
  methods: {
    changeLocale (locale) {
      let langRoute = this.switchLocalePath(locale.code)
      // remove trailing slash if '/'
      langRoute = (langRoute === '/') ? langRoute : langRoute.replace(/\/$/, '')
      this.$router.replace(langRoute)
    }
  }
}
</script>
