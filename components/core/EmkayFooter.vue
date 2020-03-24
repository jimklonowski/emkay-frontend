<template>
  <v-footer fixed app>
    <v-btn
      :ripple="false"
      color="secondary"
      disabled
      depressed
      x-small
      text
      nuxt
    >
      <v-icon class="mr-2" x-small v-text="'mdi-copyright'" />
      {{ $moment().year() }} - {{ $t('emkay_inc') }}
    </v-btn>
    <v-spacer />
    <v-menu v-for="(menu, m) in menus" :key="m" top offset-y>
      <template #activator="{ on }">
        <v-btn x-small text v-on="on">
          {{ $t(menu.category) }}
        </v-btn>
      </template>
      <v-list dense>
        <v-list-item v-for="(item, i) in menu.items" :key="i" :to="item.to">
          <v-list-item-title>{{ $t(item.key) }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-footer>
</template>

<script>
export default {
  data: () => ({
    // TODO: add to paths
    menus: [
      {
        category: 'about',
        items: [
          { key: 'about_emkay', to: {} },
          { key: 'blog', to: {} },
          { key: 'careers', to: {} },
          { key: 'contact', to: {} }
        ]
      },
      {
        category: 'more',
        items: [
          { key: 'press_releases', to: {} },
          { key: 'leadtime_guides', to: {} },
          { key: 'fleet_incentives', to: {} },
          { key: 'automotive_links', to: {} }
        ]
      },
      {
        category: 'tech',
        items: [
          { key: 'celsius', to: {} },
          { key: 'driver_360', to: {} },
          { key: 'fleet_360', to: {} },
          { key: 'fleet_exchange', to: {} },
          { key: 'geotab', to: {} }
        ]
      }
    ]
  })
}
</script>
