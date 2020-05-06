<template>
  <v-simple-table>
    <template #default>
      <thead>
        <tr>
          <th />
          <th class="text-right overline" v-text="$t('fixed_costs')" />
          <th class="text-right overline" v-text="$t('cpm')" />
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ $t('depreciation') }}</td>
          <td class="text-right">
            {{ expense_summary.depreciation | currency }}
          </td>
          <td class="text-right">
            {{ expense_summary.depreciation_cpm | currency(3, 3) }}
          </td>
        </tr>
        <tr>
          <td v-text="$t('interest')" />
          <td class="text-right">
            {{ expense_summary.interest | currency }}
          </td>
          <td class="text-right">
            {{ expense_summary.interest_cpm | currency(3, 3) }}
          </td>
        </tr>
        <tr>
          <td v-text="$t('licensing')" />
          <td class="text-right">
            {{ expense_summary.licensing | currency }}
          </td>
          <td class="text-right">
            {{ expense_summary.licensing_cpm | currency(3, 3) }}
          </td>
        </tr>
        <tr>
          <td v-text="$t('tax')" />
          <td class="text-right">
            {{ expense_summary.tax | currency }}
          </td>
          <td class="text-right">
            {{ expense_summary.tax_cpm | currency(3, 3) }}
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th class="subtitle-1">
            {{ $t('total_fixed') }}
          </th>
          <td class="text-right body-1">
            {{ total_fixed | currency }}
          </td>
          <td class="text-right body-1">
            {{ total_fixed_cpm | currency(3, 3) }}
          </td>
        </tr>
      </tfoot>
    </template>
  </v-simple-table>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    /**
     * Vuex Getters
     */
    ...mapGetters({
      expense_summary: 'vehicle-dashboard/getExpenseSummary',
      total_fixed: 'vehicle-dashboard/getTotalFixed',
      total_fixed_cpm: 'vehicle-dashboard/getTotalFixedCPM'
    })
  }
}
</script>
