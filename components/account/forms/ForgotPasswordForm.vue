<template>
  <ValidationObserver ref="forgotPasswordForm" v-slot="{ handleSubmit }">
    <v-form @submit.prevent="handleSubmit(submitForm)">
      <v-container>
        <v-row>
          <v-alert type="info">
            [i18n]Please enter your email and we'll send you instructions for viewing your Account Number and User Name.
          </v-alert>
          <v-col cols="12">
            <ValidationProvider v-slot="{ errors }" :name="$t('email')" rules="required|email">
              <v-text-field
                v-model="email"
                :label="$t('email')"
                :error-messages="errors"
                autocomplete="off"
              />
            </ValidationProvider>
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
            {{ $t('forgot_password') }}
          </v-btn>
        </v-row>
      </v-container>
    </v-form>
  </ValidationObserver>
</template>

<script>
import { SnotifyPosition } from 'vue-snotify'
export default {
  data: () => ({
    loading: false,
    email: ''
  }),
  methods: {
    async submitForm () {
      try {
        this.loading = true
        await this.$axios.post('//todo', this.email)
      } catch (error) {
        this.$snotify.error(error.message, this.$i18n.t('error'), { position: SnotifyPosition.centerBottom })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
