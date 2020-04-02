<template>
  <report-expenses-form />
</template>

<script>
/**
 * Not sure if we need a full page here.  I'm leaving it for now, but maybe we just put the form in a modal
 */
import ReportExpensesForm from '@/components/vehicle-dashboard/forms/ReportExpensesForm'
export default {
  name: 'ReportExpenses',
  components: {
    ReportExpensesForm
  },
  layout: 'vehicle-dashboard',
  head () {
    const title = this.$i18n.t('report_expenses')
    return {
      title,
      meta: [
        { hid: 'og:description', property: 'og:description', content: title }
      ]
    }
  }
}
</script>
