<template>
  <v-toolbar flat color="transparent">
    <v-avatar class="mr-2" size="36">
      <v-icon color="grey" v-text="icon" />
    </v-avatar>
    <v-toolbar-title v-text="title" />
    <v-spacer />

    <!-- Dropdown Menu -->
    <v-menu
      v-if="actions.length > 0"
      v-model="menu"
      :close-on-content-click="false"
      origin="top right"
      transition="scale-transition"
      left
    >
      <template #activator="{ on }">
        <v-btn icon v-on="on">
          <v-icon v-text="'mdi-dots-vertical'" />
        </v-btn>
      </template>
      <v-card>
        <v-list nav dense>
          <v-list-item
            v-for="(action, a) in actions"
            :key="`action-${a}`"
            :to="action.to"
            link
          >
            <v-list-item-action>
              <v-icon v-text="action.icon" />
            </v-list-item-action>
            <v-list-item-title v-text="action.text" />
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </v-toolbar>
</template>

<script>
export default {
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
  },
  data: () => ({
    menu: false
  })
}
</script>
