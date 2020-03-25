<template>
  <v-card class="vehicle-dashboard-widget">
    <slot name="top">
      <widget-toolbar
        :title="title"
        :icon="icon"
        :actions="actions"
      />
    </slot>

    <v-divider />

    <slot name="main" />
  </v-card>
</template>

<script>
export default {
  components: {
    'widget-toolbar': () => import(/* webpackChunkName: "WidgetToolbar" */ '@/components/vehicle-dashboard/widgets/WidgetToolbar.vue')
  },
  props: {
    title: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      default: 'mdi-widgets'
    },
    actions: {
      type: Array,
      default: () => []
    }
  }
}
</script>
