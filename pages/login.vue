<template>
  <v-container fill-height>
    <v-row justify="center">
      <v-col cols="auto">
        <ValidationObserver ref="loginForm" v-slot="{ handleSubmit }" tag="form" @submit.prevent>
          <v-card
            :loading="loading"
            :width="300"
            :style="{ opacity: $vuetify.theme.dark ? 0.7 : 1.0 }"
            outlined
            raised
          >
            <v-card-title>{{ $t('login') }}</v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <ValidationProvider v-slot="{ errors, valid }" :name="$t('account')" rules="required">
                      <v-text-field
                        v-model="model.account"
                        :label="$t('account')"
                        :error-messages="errors"
                        :success="valid"
                        autocomplete="organization"
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
              </v-container>
            </v-card-text>
            <v-card-actions class="flex-column">
              <v-btn
                :loading="loading"
                type="submit"
                color="primary"
                block
                depressed
                large
                @click="handleSubmit(submitLogin)"
              >
                {{ $t('login') }}
              </v-btn>
              <v-btn tabindex="-1" block small text>
                {{ $t('forgot_password') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </ValidationObserver>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'Login',
  auth: 'guest',
  data: () => ({
    loading: false,
    remember: false,

    // form model
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
      } catch (error) {
        debugger
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
