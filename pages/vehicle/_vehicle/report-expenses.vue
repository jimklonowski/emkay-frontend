<template>
  <report-expenses-form />
</template>

<script>
/**
 * Not sure if we need a full page here.  I'm leaving it for now, but maybe we just put the form in a modal
 */
export default {
  name: 'ReportExpenses',
  components: {
    'report-expenses-form': () => import(/* webpackChunkName: "ReportExpensesForm" */ '@/components/vehicle-dashboard/forms/ReportExpensesForm.vue')
  },
  layout: 'vehicle-dashboard'
}
</script>
