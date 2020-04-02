<template>
  <!-- v-show="crumbs.length > 1" -->
  <v-breadcrumbs
    v-if="crumbs.length > 1"
    :items="crumbs"
    class="px-0"
  >
    <template #item="{ item }">
      <nuxt-link v-if="!item.disabled" :to="item.to" class="text-decoration-none" v-text="item.text" />
      <span v-else class="text--disabled" v-text="item.text" />
    </template>

    <template #divider>
      <v-icon v-text="'mdi-chevron-right'" />
    </template>
  </v-breadcrumbs>
  <nuxt-link v-else :to="localePath({ path: '/vehicle' })" nuxt class="text-decoration-none py-4">
    {{ $t('vehicle_search') }}
  </nuxt-link>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      vehicle_number: 'vehicle-dashboard/getVehicleNumber'
    }),
    crumbs () {
      const crumbs = []
      const path = this.$route.path.substr(1).split('/')
      // if first part of path is locale, remove it for now
      if (path && path[0] === this.$i18n.locale) {
        path.shift()
      }
      // if last part of path is '/', remove it
      if (path && path[path.length - 1] === '') {
        path.pop()
      }
      let prefix = ''
      // if vehicle dashboard, don't include the /vehicle path
      // if (path[0] === 'vehicle') {
      //   prefix = path.shift()
      // }
      path.forEach((crumb, i) => {
        switch (i) {
          // Vehicle Search route
          case 0:
            crumbs.push({
              text: this.$i18n.t('vehicle_search'),
              disabled: false,
              to: this.localePath({ path: '/vehicle' })
            })
            break
          // Vehicle Dashboard route
          case 1:
            crumbs.push({
              text: this.vehicle_number,
              disabled: (i + 1 === path.length),
              to: this.localePath({ path: '/vehicle/dashboard' })
            })
            break
          // Vehicle Dashboard Child routes
          default:
            crumbs.push({
              text: this.$i18n.t(crumb.toLowerCase().replace(/-/g, '_')),
              disabled: (i + 1 === path.length),
              to: this.localePath({ path: [prefix, crumb].join('/') })
            })
        }
        prefix = [prefix, crumb].join('/')
      })
      return crumbs
    }
  }
}
</script>
