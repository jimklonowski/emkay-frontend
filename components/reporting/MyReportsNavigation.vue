<template>
  <span>
    <v-app-bar
      :src="require('@/assets/images/myreports.jpg')"
      :elevate-on-scroll="false"
      dark
      extended
      prominent
      flat
      hide-on-scroll
      elevation="1"
      scroll-threshold="60"
      class="emkay-image-nav"
    >
      <template #img="{ props }">
        <v-img
          v-bind="props"
          gradient="to top right, rgba(100,115,201,.7), rgba(25,32,72,.7)"
        />
      </template>
      <v-toolbar-title>
        <nuxt-link :to="localePath({ path: '/my-reports' })" class="text-decoration-none white--text">
          {{ $t('my_reports') }}
        </nuxt-link>
      </v-toolbar-title>
      <template #extension>
        <div class="body-2 font-weight-light">(i18n)Load a saved report or build your own!</div>
      </template>
    </v-app-bar>
    <v-card :style="$vuetify.theme.dark ? 'border-bottom: thin solid rgba(255, 255, 255, 0.12)' : 'border-bottom: thin solid rgba(0, 0, 0, .12)'" flat tile>
      <v-container>
        <v-row>
          <v-col cols="12" sm="6" md="4" lg="3">
            <v-subheader class="pl-0 mb-2">{{ $t('load_a_saved_report') }}</v-subheader>
            <v-select
              v-model="selected_report"
              :items="saved_reports"
              :label="$t('pick_a_report')"
              :loading="saved_reports_loading"
              :menu-props="{ bottom: true, offsetY: true }"
              max-width="auto"
              outlined
              dense
              clearable
            />
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </span>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      saved_reports_loading: 'my-reports/getReportLoading',
      saved_reports: 'my-reports/getSavedReports',
      selectedReport: 'my-reports/getSelectedReport'
    }),
    selected_report: {
      set (reportId) {
        // this.$store.commit('my-reports/setSelectedReport', reportId)
        this.selectReport(reportId)
      },
      get () {
        return this.selectedReport
      }
    }
  },
  watch: {
    /**
     * Change the query parameter when selection changes
     */
    async selected_report () {
      if (this.$route.query.reportId !== this.selected_report) {
        await this.$router.replace({ query: { reportId: this.selected_report } })
      }
    }
  },
  async mounted () {
    await this.fetchSavedReports()
    if (this.$route.query && this.$route.query.reportId) {
      this.selectReport(this.$route.query.reportId)
    }
  },
  methods: {
    ...mapActions({
      fetchSavedReports: 'my-reports/fetchSavedReports',
      selectReport: 'my-reports/setSelectedReport'
    })
  }
}
</script>
