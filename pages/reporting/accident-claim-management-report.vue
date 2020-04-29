<template>
  <v-card outlined class="report">
    <v-toolbar flat color="transparent">
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer />
    </v-toolbar>
    <v-toolbar flat color="transparent">
      <h2>I am here!</h2>
    </v-toolbar>
  </v-card>
</template>

<script>
import { reportMixins } from '@/mixins/reports'
/**
 * Accident Claim Management Report
 */
export default {
  name: 'AccidentClaimManagementReport',
  mixins: [reportMixins],
  data: vm => ({
    start_dialog: false,
    end_dialog: false,
    title: vm.$i18n.t('accident_claim_management_report')
  })
}
</script>
