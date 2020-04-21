<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="items"
        >
          <template #top>
            <v-toolbar color="transparent" flat>
              <v-toolbar-title v-text="$t('distribution_lists')" />
              <v-spacer />
              <v-dialog v-model="dialog" max-width="850" scrollable>
                <template #activator="{ on }">
                  <v-btn color="primary" depressed v-on="on">
                    {{ $t('create_new') }}
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>New Distribution List</v-card-title>
                  <v-divider />
                  <v-card-text height="650">
                    <v-subheader>Settings</v-subheader>
                    <v-text-field v-model="list_name" :label="$t('name')" autocomplete="off" outlined />
                    <v-combobox
                      v-show="drivers_selected.length > 0"
                      v-model="drivers_selected"
                      :label="$t('selection')"
                      :append-icon="null"
                      multiple
                      outlined
                      readonly
                    >
                      <template #selection="{ attrs, item, select, selected }">
                        <v-chip
                          v-bind="attrs"
                          :input-value="selected"
                          close
                          @click:close="removeRecipient(item)"
                        >
                          <strong>{{ [item.last_name, item.first_name].filter(Boolean).join(', ') }}</strong>
                        </v-chip>
                      </template>
                    </v-combobox>
                    <v-data-table
                      v-model="drivers_selected"
                      :headers="drivers_headers"
                      :items="drivers"
                      item-key="reference_number"
                      mobile-breakpoint="0"
                      show-select
                    />
                  </v-card-text>
                  <v-card-actions>
                    <v-btn block>
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template #item.date="{ item }">
            {{ item.date | date }}
          </template>
          <template #item.actions="{ item }">
            <v-icon small class="mr-2" @click="editList(item)" v-text="'mdi-pencil'" />
            <v-icon small class="mr-2" @click="deleteList(item)" v-text="'mdi-delete'" />
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data: () => ({
    dialog: false,
    drivers_selected: [],
    list_name: ''
  }),
  computed: {
    ...mapGetters({
      drivers: 'drivers/getDrivers'
    }),
    drivers_headers () {
      return [
        {
          text: this.$i18n.t('driver_#'),
          value: 'reference_number'
        },
        {
          text: this.$i18n.t('driver_last_name'),
          value: 'last_name'
        },
        {
          text: this.$i18n.t('driver_first_name'),
          value: 'first_name'
        },
        {
          text: this.$i18n.t('email'),
          value: 'email'
        },
        {
          text: this.$i18n.t('vehicle_#'),
          value: 'driver_vehicle'
        }
      ]
    },
    headers () {
      return [
        {
          text: this.$i18n.t('name'),
          value: 'name'
        },
        {
          text: this.$i18n.t('date'),
          value: 'date'
        },
        {
          text: this.$i18n.t('actions'),
          value: 'actions'
        }
      ]
    },
    items () {
      return [
        {
          id: '1',
          name: 'Fleet Messenger Team Test',
          date: '2020-04-01'
        },
        {
          id: '2',
          name: 'Mobile Team Test',
          date: '2020-03-21'
        }
      ]
    }
  },
  methods: {
    deleteList (item) {
      console.log('delete')
    },
    editList (item) {
      console.log('edit')
    }
  }
}
</script>
