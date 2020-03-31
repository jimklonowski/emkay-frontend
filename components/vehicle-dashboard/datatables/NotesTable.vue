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
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import AddNoteForm from '@/components/vehicle-dashboard/forms/AddNoteForm'
export default {
  components: {
    AddNoteForm
  },
  /**
   * Fetch Notes
   */
  async fetch () {
    await this.fetchNotes({ vehicle: this.vehicle_number })
  },
  data: () => ({
    dialog: false
  }),
  computed: {
    /**
     * Vuex Getters
     */
    ...mapGetters({
      items: 'vehicle-dashboard/getNotes',
      vehicle_number: 'vehicle-dashboard/getVehicleNumber'
    }),
    /**
     * Datatable headers
     */
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
  methods: {
    /**
     * Vuex Actions
     */
    ...mapActions({
      fetchNotes: 'vehicle-dashboard/fetchNotes'
    })
  }
}
</script>
