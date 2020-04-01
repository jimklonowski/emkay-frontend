/**
 * Set lang="en" in <html> tag
 */
export const htmlLang = {
  head () {
    return {
      htmlAttrs: {
        lang: this.$i18n.locale || 'en'
      }
    }
  }
}
