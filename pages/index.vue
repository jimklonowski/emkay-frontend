<template>
  <v-container class="welcome" fill-height>
    <v-row justify="center">
      <v-col cols="auto">
        <h1 class="display-3 font-weight-thin" v-text="$t('welcome_to_emkay')" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// import { mapGetters } from 'vuex'
// import { SnotifyPosition } from 'vue-snotify'
export default {
  name: 'Home',
  middleware: 'auth',
  /**
   * Page Meta
   */
  head () {
    const title = this.$i18n.t('home')
    return {
      title,
      meta: [
        { hid: 'og:description', property: 'og:description', content: title }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.welcome {
  user-select: none;
  &::before {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url(~@/assets/images/road.jpg);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    opacity: 0.3;
  }
}
</style>
