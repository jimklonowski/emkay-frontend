import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import LanguagePicker from '../LanguagePicker'
import { addElemWithDataAppToBody } from '@/utility/jest'
const locales = require('@/plugins/i18n/locales')
const localVue = createLocalVue()
describe('LanguagePicker', () => {
  let vuetify
  let wrapper
  let menuButton
  let localeButtons

  beforeEach(async () => {
    vuetify = new Vuetify()
    wrapper = mount(LanguagePicker, {
      localVue,
      vuetify,
      mocks: {
        $i18n: { locale: 'en', locales }
      }
    })
    addElemWithDataAppToBody()
    menuButton = wrapper.find('.v-btn--icon')
    menuButton.trigger('click')
    await wrapper.vm.$nextTick()
    localeButtons = wrapper.findAll('.v-menu__content > .v-card > .v-list > .v-list-item > button')
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('mounts properly', () => {
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  it('renders properly', () => {
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('opens menu on click', () => {
    expect(wrapper.vm.menu).toBe(true)
  })

  it('shows 3 locale buttons', () => {
    expect(localeButtons).toHaveLength(3)
  })

  it('calls changeLocale on locale button click', () => {
    const frenchButton = localeButtons.at(2)
    wrapper.vm.changeLocale = jest.fn()
    expect(wrapper.vm.changeLocale).toHaveBeenCalledTimes(0)
    frenchButton.trigger('click')
    expect(wrapper.vm.changeLocale).toHaveBeenCalledTimes(1)
  })
})
