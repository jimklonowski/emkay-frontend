<template>
  <nuxt-child />
</template>
<script>
export default {
  name: 'Reporting',
  layout: 'reporting',
  head () {
    const title = this.$i18n.t('reporting')
    return {
      title,
      meta: [
        { hid: 'og:description', property: 'og:description', content: title }
      ]
    }
  }
}
</script>
