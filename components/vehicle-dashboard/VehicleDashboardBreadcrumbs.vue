<template>
  <v-breadcrumbs
    v-show="crumbs.length > 1"
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
</template>

<script>
export default {
  computed: {
    crumbs () {
      const crumbs = []
      const path = this.$route.path.substr(1).split('/')
      // if first part of path is locale, remove it for now
      if (path && path[0] === this.$i18n.locale) {
        path.shift()
      }
      let prefix = ''
      // if vehicle dashboard, don't include the /vehicle path
      if (path[0] === 'vehicle') {
        prefix = path.shift()
      }
      path.forEach((crumb, i) => {
        crumbs.push({
          text: (i === 0) ? crumb.toUpperCase() : this.$i18n.t(crumb.toLowerCase().replace(/-/g, '_')),
          disabled: (i + 1 === path.length),
          to: this.localePath({ path: `/${prefix}/${crumb}` })
        })
        prefix = `${prefix}/${crumb}`
      })
      return crumbs
    }
  }
}
</script>
