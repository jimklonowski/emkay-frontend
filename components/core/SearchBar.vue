<script>
import { VTextField } from 'vuetify/lib'

export default {
  name: 'search-bar',
  extends: VTextField,
  props: {
    backgroundColor: {
      type: String,
      default: 'transparent'
    },
    clearable: {
      type: Boolean,
      default: true
    },
    dense: {
      type: Boolean,
      default: true
    },
    flat: {
      type: Boolean,
      default: true
    },
    hideDetails: {
      type: Boolean,
      default: true
    },
    outlined: {
      type: Boolean,
      default: true
    },
    prependInnerIcon: {
      type: String,
      default: 'mdi-magnify'
    },
    rounded: {
      type: Boolean,
      default: true
    },
    singleLine: {
      type: Boolean,
      default: true
    },
    solo: {
      type: Boolean,
      default: true
    }
  }
}
</script>
