<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :items-per-page="5"
    :loading="$fetchState.pending"
    :mobile-breakpoint="0"
    :sort-by="['date']"
    :sort-desc="[true]"
    class="striped"
  >
    <template #top>
      <v-container>
        <v-dialog v-model="dialog" max-width="800">
          <template #activator="{ on }">
            <v-btn color="primary" v-on="on">
              <v-icon class="mr-2" v-text="'mdi-file-plus'" />
              {{ $t('upload_document') }}
            </v-btn>
          </template>
          <upload-document-form />
        </v-dialog>
      </v-container>
      <v-divider />
    </template>
  </v-data-table>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import UploadDocumentForm from '@/components/vehicle-dashboard/forms/UploadDocumentForm'
export default {
  components: {
    UploadDocumentForm
  },
  /**
   * Fetch Documents
   */
  async fetch () {
    await this.fetchDocuments({ vehicle: this.vehicle_number })
  },
  data: () => ({
    dialog: false
  }),
  computed: {
    /**
     * Vuex Getters
     */
    ...mapGetters({
      items: 'vehicle-dashboard/getDocuments',
      vehicle_number: 'vehicle-dashboard/getVehicleNumber'
    }),
    /**
     * Datatable headers
     */
    headers () {
      return [
        {
          text: this.$i18n.t('date'),
          value: 'date',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('document_type'),
          value: 'document_type',
          class: 'report-column'
        }
      ]
    }
  },
  methods: {
    /**
     * Vuex Actions
     */
    ...mapActions({
      fetchDocuments: 'vehicle-dashboard/fetchDocuments'
    })
  }
}
</script>
