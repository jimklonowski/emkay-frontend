<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :items-per-page="-1"
    :mobile-breakpoint="0"
    hide-default-footer
    dense
  >
    <template #item.profile_group="{ item }">
      <v-chip small>
        {{ item.profile_group | capitalize }}
      </v-chip>
    </template>
    <template #item.profile_date_modified="{ item }">
      {{ item.profile_date_modified | date }}
    </template>
    <template #item.actions="{ item }">
      <v-tooltip top>
        <template #activator="{ on }">
          <v-btn icon v-on="on" @click="loadProfile(item.profile_id)">
            <v-icon v-text="'mdi-file-eye'" />
          </v-btn>
        </template>
        <span>{{ $t('view') }}</span>
      </v-tooltip>
      <v-tooltip top>
        <template #activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon v-text="'mdi-file-cog'" />
          </v-btn>
        </template>
        <span>{{ $t('edit') }}</span>
      </v-tooltip>
      <v-tooltip top>
        <template #activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon v-text="'mdi-file-refresh'" />
          </v-btn>
        </template>
        <span>{{ $t('duplicate') }}</span>
      </v-tooltip>
      <v-tooltip top>
        <template #activator="{ on }">
          <v-btn icon color="error" v-on="on">
            <v-icon v-text="'mdi-delete'" />
          </v-btn>
        </template>
        <span>{{ $t('delete') }}</span>
      </v-tooltip>
    </template>
  </v-data-table>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  async fetch () {
    await this.fetchProfiles()
    await this.fetchSuggestedEmails()
  },
  computed: {
    /**
     * Vuex Getters
     */
    ...mapGetters({
      items: 'my-reports/getProfiles'
    }),
    headers () {
      return [
        {
          text: this.$i18n.t('profile_name'),
          value: 'profile_name',
          class: 'report-column'
        },
        {
          text: this.$i18n.t('profile_group'),
          value: 'profile_group',
          class: 'report-column'
        },
        {
          text: this.$i18n.t('profile_date_modified'),
          value: 'profile_date_modified',
          class: 'report-column'
        },
        {
          text: this.$i18n.t('actions'),
          value: 'actions',
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
      fetchProfiles: 'my-reports/fetchProfiles',
      fetchSuggestedEmails: 'my-reports/fetchSuggestedEmails',
      loadProfile: 'my-reports/loadProfile'
    })
  }
}
</script>
