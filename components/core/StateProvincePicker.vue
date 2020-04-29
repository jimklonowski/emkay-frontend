<script>
import { VAutocomplete } from 'vuetify/lib'
import { states, provinces } from '@/utility/geography'
export default {
  name: 'state-province-picker',
  extends: VAutocomplete,
  props: {
    items: {
      type: Array,
      default () {
        return this.states_and_provinces
      }
    },
    itemText: {
      type: String,
      default: 'name'
    },
    itemValue: {
      type: String,
      default: 'abbreviation'
    }
  },
  computed: {
    states_and_provinces () {
      const usaHeader = { header: 'USA', divider: true }
      const canadaHeader = { header: 'CANADA', divider: true }
      return [usaHeader, ...states, canadaHeader, ...provinces]
    }
  }
}
</script>
