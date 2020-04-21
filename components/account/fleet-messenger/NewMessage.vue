<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="9" order="2" order-sm="1">
        <v-card outlined>
          <v-card-text>
            <v-btn-toggle v-model="message_type" class="mb-2" mandatory dense>
              <v-btn value="email" v-text="$t('email')" />
              <v-btn value="notification" v-text="$t('notification')" />
            </v-btn-toggle>
            <v-text-field v-model="recipient" :label="$t('recipient')" outlined dense />
            <v-text-field v-if="message_type === 'email'" v-model="subject" :label="$t('subject')" outlined dense />
            <v-textarea v-model="text" :label="$t('message')" outlined />
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
      <v-col cols="12" sm="3" order="1" order-sm="2">
        <v-btn-toggle v-model="contacts_type" mandatory>
          <v-btn value="drivers" v-text="$t('drivers')" />
          <v-btn value="distribution_lists" v-text="$t('distribution_lists')" />
        </v-btn-toggle>
        <v-list v-if="contacts_type === 'drivers'">
          drivers
        </v-list>
        <v-list v-else-if="contacts_type === 'distribution_lists'">
          distribution_lists
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  data: () => ({
    contacts_type: 'drivers',
    message_type: 'email',
    recipient: '',
    subject: '',
    text: ''
  })
}
</script>
