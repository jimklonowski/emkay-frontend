<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="7" lg="8" order="2" order-md="1">
        <v-card outlined>
          <v-card-text>
            <v-btn-toggle v-model="message_type" class="mb-8" mandatory dense>
              <v-btn value="email">
                {{ $t('email') }}
              </v-btn>
              <v-btn value="notification">
                {{ $t('notification') }}
              </v-btn>
            </v-btn-toggle>
            <v-combobox
              v-model="recipients"
              :label="$t('recipient')"
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
                  @click="select"
                  @click:close="removeRecipient(item)"
                >
                  <strong>{{ [item.last_name, item.first_name].filter(Boolean).join(', ') }}</strong>
                </v-chip>
              </template>
            </v-combobox>
            <v-text-field v-if="message_type === 'email'" v-model="subject" :label="$t('subject')" outlined />
            <v-textarea v-model="message" :label="$t('message')" outlined />
            <v-file-input
              v-model="files"
              label="Upload Files"
              multiple
              placeholder="Select your files"
              :prepend-icon="null"
              outlined
              :show-size="1000"
            >
              <template #selection="{ index, text }">
                <v-chip
                  v-if="index < 2"
                  color="primary accent-4"
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
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" depressed>
              <v-icon class="mr-2" v-text="'mdi-send'" />
              Send
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" md="5" lg="4" order="1" order-md="2">
        <v-card outlined>
          <v-card-actions>
            <v-btn-toggle
              v-model="contacts_type"
              background-color="transparent"
              mandatory
              dense
              class="v-btn--block justify-center"
            >
              <v-btn value="drivers">
                {{ $t('drivers') }}
              </v-btn>
              <v-btn value="distribution_lists">
                {{ $t('distribution_lists') }}
              </v-btn>
            </v-btn-toggle>
          </v-card-actions>
          <v-card-text>
            <v-list v-if="contacts_type === 'drivers'" max-height="650" style="overflow:auto;" dense shaped>
              <v-list-item-group v-model="recipients" multiple>
                <v-list-item v-for="(driver, d) in filteredDrivers" :key="`driver-${d}`" :value="driver" link active-class="primary--text text--accent-4">
                  <v-list-item-title>{{ [driver.first_name, driver.last_name].filter(Boolean).join(' ') }}</v-list-item-title>
                  <v-list-item-subtitle>{{ driver.email }}</v-list-item-subtitle>
                </v-list-item>
              </v-list-item-group>
            </v-list>
            <v-list v-else-if="contacts_type === 'distribution_lists'">
              TODO: distribution lists
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data: () => ({
    contacts_type: 'drivers',
    files: [],
    message: '',
    message_type: 'email',
    recipients: [],
    subject: ''
  }),
  computed: {
    ...mapGetters({
      drivers: 'drivers/getDrivers'
    }),
    filteredDrivers () {
      return this.drivers.filter(x => this.checkDriver(x))
    }
  },
  methods: {
    addRecipient (item) {
      if (!this.recipients.includes(item)) {
        this.recipients.push(item)
      }
    },
    removeRecipient (item) {
      this.recipients.splice(this.recipients.indexOf(item), 1)
      this.recipients = [...this.recipients]
    },
    checkDriver (item) {
      if (!item.reference_number) { return false }
      if (!item.last_name && !item.first_name) { return false }
      return true
    }
  }
}
</script>
