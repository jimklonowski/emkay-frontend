<template>
  <ValidationObserver ref="documentsForm" v-slot="{ handleSubmit }">
    <v-form @submit.prevent="handleSubmit(submitDocuments)">
      <v-card>
        <v-card-title>{{ $t('upload_document') }}</v-card-title>
        <v-card-subtitle>{{ vehicle_number }}</v-card-subtitle>
        <v-card-text>
          <ValidationProvider v-slot="{ errors, validate }" :name="$t('documents')" rules="required">
            <v-file-input
              :label="$t('upload_documents')"
              :placeholder="$t('select')"
              :show-size="1000"
              :error-messages="errors"
              accept=".jpg, .jpeg, .bmp, .pdf, .png, .tiff"
              color="primary"
              counter
              chips
              multiple
              prepend-icon="mdi-paperclip"
              outlined
              @change="validate($event)"
            >
              <template #selection="{ index, text }">
                <v-chip
                  v-if="index < 2"
                  color="primary"
                  dark
                  label
                  small
                >
                  {{ text }}
                </v-chip>
                <span v-else-if="index === 2" class="overline grey--text text--darken-3 mx-2">
                  +{{ files.length - 2 }} File(s)
                </span>
              </template>
            </v-file-input>
          </ValidationProvider>
        </v-card-text>
        <v-card-actions>
          <v-btn :loading="loading" color="primary" type="submit" block depressed>
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
export default {
  data: () => ({
    loading: false,
    files: []
  }),
  computed: {
    ...mapGetters({
      vehicle_number: 'vehicle-dashboard/getVehicleNumber'
    })
  },
  methods: {
    ...mapActions({
      uploadDocuments: 'vehicle-dashboard/uploadDocuments'
    }),
    async submitDocuments () {
      try {
        this.loading = true
        await this.uploadDocuments({ vehicle: this.vehicle_number, files: this.files })
        this.$snotify.success(this.$i18n.t('documents_added'), this.$i18n.t('success'), { position: SnotifyPosition.centerBottom })
        this.files = []
      } catch (error) {
        this.$snotify.error(error, this.$i18n.t('error'), { position: SnotifyPosition.centerBottom })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
