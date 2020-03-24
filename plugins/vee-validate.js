import Vue from 'vue'
import { ValidationProvider, ValidationObserver, extend, localize } from 'vee-validate'
import en from 'vee-validate/dist/locale/en.json'
import fr from 'vee-validate/dist/locale/fr.json'
import * as rules from 'vee-validate/dist/rules'

export default ({ app }) => {
  // import all vee-validate rules
  for (const rule in rules) {
    // eslint-disable-next-line import/namespace
    extend(rule, rules[rule])
  }

  // Add Custom Validations
  extend('after', {
    params: ['other'],
    validate (value, { other }) {
      return app.$moment(value).isAfter(app.$moment(other), 'day')
    },
    message: (field, { other }) => {
      return app.i18n.t('validations.after', [field, other])
    }
  })

  extend('before', {
    params: ['other'],
    validate (value, { other }) {
      return app.$moment(value).isBefore(app.$moment(other), 'day')
    },
    message: (field, { other }) => {
      return app.i18n.t('validations.before', [field, other])
    }
  })

  extend('on_or_after', {
    params: ['other'],
    validate (value, { other }) {
      return app.$moment(value).isSameOrAfter(app.$moment(other), 'day')
    },
    message: (field, { other }) => {
      return app.i18n.t('validations.on_or_after', [field, other])
    }
  })

  extend('on_or_before', {
    params: ['other'],
    validate (value, { other }) {
      return app.$moment(value).isSameOrBefore(app.$moment(other), 'days')
    },
    message: (field, { other }) => {
      return app.i18n.t('validations.on_or_before')
    }
  })

  extend('not_past', {
    validate (value) {
      return app.$moment(value).isSameOrAfter(app.$moment(), 'day')
    },
    message: field => app.i18n.t('validations.not_past', [field])
  })

  // Register the wrapper components
  Vue.component('ValidationProvider', ValidationProvider)
  Vue.component('ValidationObserver', ValidationObserver)

  // Localize validation messages
  localize('en', en)
  localize('fr', fr)
  localize('ca', en)
}
