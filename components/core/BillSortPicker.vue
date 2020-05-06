<script>
import { VSelect } from 'vuetify/lib'

export default {
  name: 'bill-sort-picker',
  extends: VSelect,
  props: {
    items: {
      type: Array,
      default () {
        const bill_sorts = this.$store.getters['account/getBillSorts']
        return bill_sorts
      }
    }
  },
  async created () {
    await this.$store.dispatch('account/fetchBillSorts')
  }
}
</script>
