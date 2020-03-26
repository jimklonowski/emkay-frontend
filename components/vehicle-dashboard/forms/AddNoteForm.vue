<template>
  <ValidationObserver ref="notesForm" v-slot="{ handleSubmit }">
    <v-form @submit.prevent="handleSubmit(submitNote)">
      <v-card>
        <v-card-title>{{ $t('add_note') }}</v-card-title>
        <v-card-subtitle>{{ vehicle_number }}</v-card-subtitle>
        <v-card-text>
          <ValidationProvider v-slot="{ errors }" :name="$t('note')" rules="required">
            <v-textarea
              v-model="note"
              :label="$t('note')"
              :error-messages="errors"
              outlined
              dense
            />
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
    note: ''
  }),
  computed: {
    ...mapGetters({
      vehicle_number: 'vehicle-dashboard/getVehicleNumber'
    })
  },
  methods: {
    ...mapActions({
      addNote: 'vehicle-dashboard/addNote'
    }),
    async submitNote () {
      try {
        this.loading = true
        await this.addNote({ vehicle: this.vehicle_number, note: this.note })
        this.$snotify.success(this.$i18n.t('note_added'), this.$i18n.t('success'), { position: SnotifyPosition.centerBottom })
        this.note = ''
      } catch (error) {
        this.$snotify.error(error, this.$i18n.t('error'), { position: SnotifyPosition.centerBottom })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
