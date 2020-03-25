<template>
  <ValidationObserver ref="labelsForm" v-slot="{ handleSubmit }" tag="form" @submit.prevent>
    <v-card :loading="loading" outlined>
      <v-card-title>{{ $t('customize_fleet_labels') }}</v-card-title>
      <v-card-subtitle>{{ $t('custom_labels_warning') }}</v-card-subtitle>
      <v-divider />
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" lg="6">
              <v-subheader>{{ $t('custom_labels') }}</v-subheader>
              <ValidationProvider v-for="item in client_labels" :key="item.key" v-slot="{ errors }" :name="$t(item.key)" rules="max:40">
                <v-text-field
                  v-model="model[item.key]"
                  :label="$t(item.key)"
                  :error-messages="errors"
                  outlined
                  dense
                />
              </ValidationProvider>
            </v-col>
            <v-col cols="12" lg="6">
              <v-subheader>{{ $t('driver_labels') }}</v-subheader>
              <ValidationProvider v-for="item in driver_labels" :key="item.key" v-slot="{ errors }" :name="$t(item.key)" rules="max:40">
                <v-text-field
                  v-model="model[item.key]"
                  :label="$t(item.key)"
                  :error-messages="errors"
                  outlined
                  dense
                />
              </ValidationProvider>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn :loading="loading" @click="handleSubmit(submitLabels)">
          {{ $t('submit') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </ValidationObserver>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
// import { sleep } from '@/utility/helpers'
export default {
  name: 'CustomizeFleetLabels',
  asyncData ({ store }) {
    // copy existing labels into model
    const loadedLabels = store.getters['account/getCustomLabels']
    const model = { ...loadedLabels }
    console.log(model)
    return { model }
  },
  data: () => ({
    loading: false,
    model: {}
  }),
  computed: {
    ...mapGetters({
      client_labels: 'account/getClientLabels',
      driver_labels: 'account/getDriverLabels'
    })
  },
  methods: {
    ...mapActions({
      updateLabels: 'account/updateCustomLabels'
    }),
    async submitLabels () {
      try {
        this.loading = true
        await this.updateLabels(this.model)
        this.$snotify.success('ok')
      } catch (error) {
        debugger
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
