<template>
  <v-card class="vehicle-dashboard-widget" outlined>
    <widget-toolbar
      :title="title"
      :icon="icon"
      :actions="actions"
    />

    <v-divider />

    <slot name="main" />
  </v-card>
</template>

<script>
import WidgetToolbar from '@/components/vehicle-dashboard/widgets/WidgetToolbar'
export default {
  components: {
    WidgetToolbar
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
