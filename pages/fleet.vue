<template>
  <v-container class="fleet" fill-height fluid pa-0>
    <v-row v-show="!initialized" justify="center" no-gutters>
      <v-card color="primary" width="300" dark>
        <v-card-text>
          {{ $t('building_fleet_dashboard') }}
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          />
        </v-card-text>
      </v-card>
    </v-row>
    <iframe
      v-show="initialized"
      :src="src"
      style="position:absolute;border:none;"
      height="100%"
      width="100%"
      @load="frameLoaded"
    />
  </v-container>
</template>

<script>
export default {
  name: 'FleetDashboard',
  data: vm => ({
    initialized: false,
    src: null,
    title: vm.$i18n.t('fleet_dashboard')
  }),
  computed: {
    fleetDashboardUrl: vm => `${process.env.FLEET_DASHBOARD_URL_DEV}/Authorize?customer=${vm.$auth.user.account}&username=${vm.$auth.user.username}`
  },
  mounted () {
    this.src = this.fleetDashboardUrl
  },
  methods: {
    frameLoaded () {
      console.log('Fleet Dashboard Loaded.')
      this.initialized = true
    }
  },
  head () {
    const title = this.$t('fleet_dashboard')
    return {
      title,
      meta: [
        { hid: 'og:description', property: 'og:description', content: title }
      ]
    }
  }
}
</script>
<style scoped>
.fleet::before {
  content: "";
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(~@/assets/images/road.jpg);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  opacity: 0.3;
}
</style>
