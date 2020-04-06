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
  // computed: {
  //   /**
  //    * Vuex Getters
  //    */
  //   ...mapGetters({
  //     login_messages: 'account/getLoginMessages'
  //   })
  // },
  // mounted () {
  //   this.$nextTick(() => this.showLoginMessages())
  // },
  // methods: {
  //   /**
  //    * Loop through login messages and show snotify notifications
  //    */
  //   showLoginMessages () {
  //     this.login_messages.forEach(message => {
  //       // If this message has already been dismissed, as indicated by a cookie, don't show it
  //       if (this.$cookies.get(message.suppressionCookie)) {
  //         console.log(message.suppressionCookie)
  //       } else {
  //         // show the notification. add a cookie if dismiss button is pressed
  //         const detailsActions = (toast) => window.open(message.link)
  //         const dismissAction = (toast) => {
  //           this.$snotify.remove(toast.id)
  //           this.$cookies.set(message.suppressionCookie, true, { maxAge: message.cookieAge || 60 * 60 * 24 })
  //         }
  //         this.$snotify.info(message.text, message.title, {
  //           showProgressBar: true,
  //           timeout: 5000,
  //           buttons: [
  //             { text: 'Details', action: detailsActions, bold: true },
  //             { text: 'Dismiss', action: dismissAction }
  //           ],
  //           position: SnotifyPosition.centerBottom
  //         })
  //       }
  //     })
  //   }
  // },
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

<style scoped>
.welcome::before {
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
</style>
