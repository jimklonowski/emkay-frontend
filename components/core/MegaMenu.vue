<template>
  <v-menu
    v-model="open"
    :close-on-content-click="false"
    :nudge-bottom="8"
    origin="top right"
    transition="scale-transition"
    left
    offset-y
    bottom
  >
    <template #activator="{ on }">
      <v-btn
        :color="$vuetify.theme.dark ? 'white' : 'rgba(0, 0, 0, 0.54)'"
        :title="$t(menu.title)"
        min-width="60"
        text
        small
        v-on="on"
      >
        <span v-show="$vuetify.breakpoint.smAndDown">
          <v-icon v-text="menu.icon" />
        </span>
        <span v-show="$vuetify.breakpoint.mdAndUp">
          {{ $t(menu.title) }}
          <v-icon v-text="'mdi-chevron-down'" />
        </span>
      </v-btn>
    </template>
    <v-card>
      <v-list-item :to="localePath(menu.path)" two-line>
        <v-list-item-avatar color="primary">
          <v-icon dark v-text="menu.icon" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="title" v-text="$t(menu.title)" />
          <v-list-item-subtitle class="caption" v-text="$t(menu.subtitle)" />
        </v-list-item-content>
      </v-list-item>
      <v-divider />
      <v-tabs
        v-model="tab"
        color="primary"
        slider-color="primary"
        slider-size="3"
        show-arrows
        centered
      >
        <v-tab
          v-for="(category, c) in menu.categories"
          :key="`tab-${c}`"
          class="overline"
          v-text="$t(category.key)"
        />
      </v-tabs>
      <v-divider />
      <v-tabs-items v-model="tab">
        <v-tab-item v-for="(category, c) in menu.categories" :key="`tabitem-${c}`">
          <v-list nav tile dense>
            <v-list-item
              v-for="(item, i) in category.items"
              :key="`item-${i}`"
              :to="localePath(item.to)"
              :color="category.color"
              nuxt
            >
              <v-list-item-icon>
                <v-icon v-text="item.icon" />
              </v-list-item-icon>
              <v-list-item-subtitle class="font-weight-regular" v-text="$t(item.key)" />
            </v-list-item>
          </v-list>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  props: {
    menu: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    open: false,
    tab: 0
  })
}
</script>

<style>

</style>
