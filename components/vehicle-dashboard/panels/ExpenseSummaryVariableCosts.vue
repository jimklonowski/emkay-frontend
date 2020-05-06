<template>
  <v-simple-table>
    <template #default>
      <thead>
        <tr>
          <th />
          <th class="text-right overline" v-text="$t('variable_costs')" />
          <th class="text-right overline" v-text="$t('cpm')" />
        </tr>
      </thead>
      <tbody>
        <tr>
          <td v-text="$t('accident')" />
          <td class="text-right">
            {{ expense_summary.accident | currency }}
          </td>
          <td class="text-right">
            {{ expense_summary.accident_cpm | currency(3, 3) }}
          </td>
        </tr>
        <tr>
          <td v-text="$t('fuel')" />
          <td class="text-right">
            {{ expense_summary.fuel | currency }}
          </td>
          <td class="text-right">
            {{ expense_summary.fuel_cpm | currency(3, 3) }}
          </td>
        </tr>
        <tr>
          <td>{{ $t('maintenance') }}</td>
          <td class="text-right">
            {{ expense_summary.maintenance | currency }}
          </td>
          <td class="text-right">
            {{ expense_summary.maintenance_cpm | currency(3, 3) }}
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th class="subtitle-1">
            {{ $t('total_variable') }}
          </th>
          <th class="text-right body-1">
            {{ total_variable | currency }}
          </th>
          <th class="text-right body-1">
            {{ total_variable_cpm | currency(3, 3) }}
          </th>
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
      total_variable: 'vehicle-dashboard/getTotalVariable',
      total_variable_cpm: 'vehicle-dashboard/getTotalVariableCPM'
    })
  }
}
</script>
