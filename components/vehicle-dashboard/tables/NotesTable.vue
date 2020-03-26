<template>
  <v-skeleton-loader :loading="!initialized" type="table">
    <v-data-table
      :headers="headers"
      :items="items"
      :items-per-page="5"
      :loading="loading"
      :mobile-breakpoint="0"
      :sort-by="['date']"
      :sort-desc="[true]"
      class="striped"
    >
      <template #top>
        <v-container>
          <v-dialog v-model="dialog" max-width="800">
            <template #activator="{ on }">
              <v-btn color="primary" depressed v-on="on">
                <v-icon class="mr-2" v-text="'mdi-note-plus'" />
                {{ $t('add_note') }}
              </v-btn>
            </template>
            <add-note-form />
          </v-dialog>
        </v-container>
        <v-divider />
      </template>
    </v-data-table>
  </v-skeleton-loader>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import AddNoteForm from '@/components/vehicle-dashboard/forms/AddNoteForm'
export default {
  components: {
    AddNoteForm
  },
  data: () => ({
    dialog: false,
    initialized: false
  }),
  computed: {
    ...mapGetters({
      items: 'vehicle-dashboard/getNotes',
      loading: 'vehicle-dashboard/getNotesLoading',
      vehicle_number: 'vehicle-dashboard/getVehicleNumber'
    }),
    headers () {
      return [
        {
          text: this.$i18n.t('date'),
          value: 'create_date',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('username'),
          value: 'create_operator',
          class: 'report-column',
          divider: true
        },
        {
          text: this.$i18n.t('note'),
          value: 'note',
          class: 'report-column'
        }
      ]
    }
  },
  async mounted () {
    await this.fetchNotes({ vehicle: this.vehicle_number })
    this.initialized = true
  },
  methods: {
    ...mapActions({
      fetchNotes: 'vehicle-dashboard/fetchNotes'
    })
  }
}
</script>
