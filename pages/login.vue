<template>
  <v-container class="login" fill-height>
    <v-row justify="center">
      <v-col cols="auto">
        <v-card
          :style="{ opacity: $vuetify.theme.dark ? 0.7 : 1.0 }"
          outlined
          raised
        >
          <v-card-title>
            {{ !forgot ? $t('login') : $t('forgot_password') }}
          </v-card-title>
          <v-card-text :style="{ width: forgot ? '500px' : '300px' }">
            <!-- Show login form -->
            <login-form v-if="!forgot" />

            <!-- Show forgot password form -->
            <forgot-password-form v-else />
          </v-card-text>
          <v-card-actions>
            <v-btn
              tabindex="-1"
              block
              small
              text
              @click="forgot = !forgot"
            >
              {{ !forgot ? $t('forgot_password') : $t('back') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import LoginForm from '@/components/account/forms/LoginForm'
import ForgotPasswordForm from '@/components/account/forms/ForgotPasswordForm'
export default {
  name: 'Login',
  auth: 'guest',
  layout: 'guest',
  components: {
    LoginForm,
    ForgotPasswordForm
  },
  data: () => ({
    forgot: false
  }),
  head () {
    const title = this.$i18n.t('login')
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
.login {
  &::before {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 50% 50%;

    .theme--dark & {
      background-image: url(~@/assets/images/coveredcar--dark.jpg);
      opacity: 0.5;
    }
    .theme--light & {
      background-image: url(~@/assets/images/coveredcar--light.jpg);
      opacity: 1.0;
    }
  }
}
</style>
