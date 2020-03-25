<template>
  <v-app-bar
    :src="require('@/assets/images/steeringwheel.jpg')"
    :elevate-on-scroll="false"
    dark
    extended
    prominent
    flat
    hide-on-scroll
    elevation="1"
    scroll-threshold="60"
  >
    <template #img="{ props }">
      <v-img
        v-bind="props"
        gradient="to top right, rgba(100,115,201,.7), rgba(25,32,72,.7)"
      />
    </template>
    <v-toolbar-title>
      <nuxt-link :to="vehicleRoute" class="text-decoration-none white--text" v-text="$t('vehicle_dashboard')" />
      <span class="caption" v-text="$route.params.vehicle" />
    </v-toolbar-title>

    <v-spacer />

    <template #extension>
      <v-tabs
        hide-slider
        show-arrows
        left
        background-color="transparent"
        color="white"
      >
        <v-tab v-for="(action, a) in actions" :key="`action-${a}`" :to="localePath(action.to)" text x-small>
          <v-icon v-text="action.icon" />
          {{ $t(action.key) }}
        </v-tab>
      </v-tabs>
      <v-spacer />
      <!-- <v-btn icon>
        <v-icon v-text="'mdi-dots-vertical'" />
      </v-btn> -->
    </template>
  </v-app-bar>
</template>

<script>
import { vehicleRoute } from '@/mixins/routing'
/**
 * Vehicle Dashboard Navigation with image background and tabs
 */
export default {
  mixins: [vehicleRoute],
  computed: {
    actions () {
      return [
        {
          key: 'documents_and_notes',
          to: { path: `/vehicle/${this.$route.params.vehicle}/documents-and-notes` }
        },
        {
          key: 'report_expenses',
          to: { path: `/vehicle/${this.$route.params.vehicle}/report-expenses` }
        },
        {
          key: 'saferoads',
          to: { path: `/vehicle/${this.$route.params.vehicle}/saferoads` }
        },
        {
          key: 'transports_and_storage',
          to: { path: `/vehicle/${this.$route.params.vehicle}/transports-and-storage` }
        }
      ]
    }
  }
}
</script>
