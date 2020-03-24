import { localize } from 'vee-validate'
export default ({ app }) => {
  /**
   * Change the locale for each plugin that relies on it.
   * @param {*} locale
   */
  const setLocale = (locale) => {
    switch (locale) {
      case 'ca': {
        app.vuetify.framework.lang.current = 'ca'
        app.$moment.locale('en-ca')
        localize('ca')
        break
      }
      case 'fr': {
        app.vuetify.framework.lang.current = 'fr'
        app.$moment.locale('fr-ca')
        localize('fr')
        break
      }
      case 'en': // fallthrough to default
      default: {
        app.vuetify.framework.lang.current = 'en'
        app.$moment.locale('en')
        localize('en')
        break
      }
    }
  }

  // Initialize the locales for each plugin relies on it
  if (process.browser) {
    if (app.i18n.locale) {
      console.log(`Locale: ${app.i18n.locale}`)
      setLocale(app.i18n.locale)
    }
  }

  // Run the above function whenever the locale is switched
  app.i18n.onLanguageSwitched = (oldLocale, newLocale) => {
    console.log(`Switching Locale: ${oldLocale} => ${newLocale}`)
    setLocale(newLocale)
  }
}
