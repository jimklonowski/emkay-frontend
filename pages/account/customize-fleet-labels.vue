<template>
  <ValidationObserver ref="labelsForm" v-slot="{ handleSubmit }">
    <v-form @submit.prevent="handleSubmit(submitLabels)">
      <v-card :loading="loading" outlined>
        <v-card-title class="font-lato">
          {{ $t('customize_fleet_labels') }}
        </v-card-title>
        <v-card-subtitle>{{ $t('custom_labels_warning') }}</v-card-subtitle>
        <v-divider />
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" md="6">
                <v-subheader class="px-0">
                  {{ $t('custom_labels') }}
                </v-subheader>
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
              <v-col cols="12" md="6">
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
          <v-fade-transition>
            <span v-show="hasChanges" class="font-italic text--disabled body-2 px-4">{{ $t('unsaved_changes') }}</span>
          </v-fade-transition>
          <v-btn :loading="loading" :disabled="!hasChanges" color="primary" type="submit" depressed>
            {{ $t('submit') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </ValidationObserver>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { SnotifyPosition } from 'vue-snotify'
import isEqual from 'lodash.isequal'
/**
 * The customize-fleet-labels page populates a form using the custom labels in vuex:account.
 */
export default {
  name: 'CustomizeFleetLabels',
  data: () => ({
    loading: false,

    // form model
    model: {}
  }),
  computed: {
    ...mapGetters({
      custom_labels: 'account/getCustomLabels',
      client_labels: 'account/getClientLabels',
      driver_labels: 'account/getDriverLabels'
    }),
    /**
     * I wanted to keep the save button disabled unless there had been changes made to the form.  Easy to use Lodash's isEqual to compare objects
     */
    hasChanges: vm => !isEqual(vm.model, vm.custom_labels)
  },
  /**
   * When this page component is mounted, copy custom labels from vuex getter into the model object.
   */
  mounted () {
    this.model = { ...this.custom_labels }
  },
  methods: {
    ...mapActions({
      updateLabels: 'account/updateCustomLabels'
    }),
    async submitLabels () {
      try {
        this.loading = true
        // call the vuex action to update labels using the form model
        await this.updateLabels(this.model)
        this.$snotify.success(this.$i18n.t('labels_updated'), this.$i18n.t('success'), { position: SnotifyPosition.centerBottom })
      } catch (error) {
        this.$snotify.error(error, this.$i18n.t('error'), { position: SnotifyPosition.centerBottom })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
