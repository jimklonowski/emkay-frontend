<template>
  <v-card outlined tile>
    <v-toolbar height="72" tile flat color="transparent">
      <v-tabs
        v-model="tab"
        grow
        centered
        icons-and-text
      >
        <v-tabs-slider />
        <v-tab>
          {{ $t('documents') }}
          <v-icon v-text="'mdi-file-document-box-multiple'" />
        </v-tab>
        <v-tab>
          {{ $t('notes') }}
          <v-icon v-text="'mdi-note-multiple'" />
        </v-tab>
      </v-tabs>
    </v-toolbar>
    <v-divider />
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <documents-table />
      </v-tab-item>
      <v-tab-item>
        <notes-table />
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import DatatableLoading from '@/components/vehicle-dashboard/datatables/DatatableLoading'
export default {
  name: 'VehicleDocumentsAndNotes',
  components: {
    'documents-table': () => ({
      component: import(/* webpackChunkName: "DocumentsTable" */'@/components/vehicle-dashboard/datatables/DocumentsTable.vue'),
      loading: DatatableLoading,
      delay: 0
    }),
    'notes-table': () => ({
      component: import(/* webpackChunkName: "NotesTable" */'@/components/vehicle-dashboard/datatables/NotesTable.vue'),
      loading: DatatableLoading,
      delay: 0
    })
  },
  layout: 'vehicle-dashboard',
  data: () => ({
    tab: 0
  }),
  head () {
    const title = `${this.$route.params.vehicle} - ${this.$t('documents_and_notes')}`
    return {
      title,
      meta: [
        { hid: 'og:description', property: 'og:description', content: title }
      ]
    }
  }
}
</script>
