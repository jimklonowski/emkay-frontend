<template>
  <!-- if route has vehicle param: show vehicle dashboard -->
  <!-- <nuxt-child v-if="$route.params.vehicle" /> -->

  <!-- else: show vehicle search -->
  <v-container class="vehicle-search" fill-height>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <vehicle-search />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'VehicleDashboardWrapper',
  components: {
    'vehicle-search': () => import(/* webpackChunkName: 'VehicleSearch' */ '@/components/vehicle-dashboard/VehicleSearch')
  },
  head () {
    const title = this.$i18n.t('vehicle_search')
    return {
      title,
      meta: [
        { hid: 'og:description', property: 'og:description', content: title }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.vehicle-search {
  &::before {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 50% 50%;

    .theme--dark & {
      background-image: url(~@/assets/images/coveredcar--dark.jpg);
      opacity: 0.5;
    }
    .theme--light & {
      background-image: url(~@/assets/images/coveredcar--light.jpg);
      opacity: 1.0;
    }
  }
}
</style>
