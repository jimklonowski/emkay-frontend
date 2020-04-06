<template>
  <ValidationObserver ref="loginForm" v-slot="{ handleSubmit }">
    <v-form @submit.prevent="handleSubmit(submitLogin)">
      <v-container>
        <v-row>
          <v-col cols="12">
            <ValidationProvider v-slot="{ errors, valid }" :name="$t('account')" rules="required">
              <v-text-field
                v-model="model.account"
                :label="$t('account')"
                :error-messages="errors"
                :success="valid"
                autocomplete="account"
              />
            </ValidationProvider>
          </v-col>
          <v-col cols="12">
            <ValidationProvider v-slot="{ errors, valid }" :name="$t('username')" rules="required">
              <v-text-field
                v-model="model.username"
                :label="$t('username')"
                :error-messages="errors"
                :success="valid"
                autocomplete="username"
              />
            </ValidationProvider>
          </v-col>
          <v-col cols="12">
            <ValidationProvider v-slot="{ errors }" :name="$t('password')" rules="required">
              <v-text-field
                v-model="model.password"
                :label="$t('password')"
                :error-messages="errors"
                type="password"
                autocomplete="current-password"
              />
            </ValidationProvider>
          </v-col>
          <v-col cols="12">
            <v-checkbox
              v-model="remember"
              :label="$t('remember_me')"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-btn
            :loading="loading"
            type="submit"
            color="primary"
            block
            depressed
            large
          >
            {{ $t('login') }}
          </v-btn>
        </v-row>
      </v-container>
    </v-form>
  </ValidationObserver>
</template>

<script>
import { mapActions } from 'vuex'
import { SnotifyPosition } from 'vue-snotify'
export default {
  data: () => ({
    loading: false,
    remember: false,
    // credentials
    model: {
      account: '',
      username: '',
      password: ''
    }
  }),
  methods: {
    ...mapActions({
      login: 'account/login'
    }),
    async submitLogin () {
      try {
        this.loading = true
        await this.login(this.model)
        // TODO: remember credentials feature?
      } catch (error) {
        this.$snotify.error(error.message, this.$i18n.t('error'), { position: SnotifyPosition.centerBottom })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
