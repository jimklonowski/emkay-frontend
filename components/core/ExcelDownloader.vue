<template>
  <client-only>
    <download-excel :fields="downloadFields" :data="items" :name="exportName">
      <v-btn
        :title="`${$t('save')} .xls`"
        :color="color"
        :large="large"
        :icon="icon && !text"
        :outlined="outlined"
      >
        <v-icon v-if="icon" v-text="icon" />
        <span v-if="text" class="ml-2">{{ text }}</span>
      </v-btn>
    </download-excel>
  </client-only>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: undefined
    },
    downloadFields: {
      type: Object,
      required: true
    },
    exportName: {
      type: String,
      required: true
    },
    icon: {
      type: [String, Boolean],
      default: 'mdi-cloud-download'
    },
    items: {
      type: Array,
      required: true
    },
    large: {
      type: Boolean,
      default: true
    },
    outlined: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: null
    }
  }
}
</script>
