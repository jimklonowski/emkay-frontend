import { createLocalVue, mount } from '@vue/test-utils'
// import Vue from 'vue'
import Vuetify from 'vuetify'
import DarkModeToggle from '../DarkModeToggle'
const localVue = createLocalVue()

describe('DarkModeToggle', () => {
  let vuetify
  let wrapper
  beforeEach(() => {
    vuetify = new Vuetify()
    wrapper = mount(DarkModeToggle, {
      localVue,
      vuetify
    })
  })

  it('mounts properly', () => {
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  it('renders properly', () => {
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('calls toggle function on click', () => {
    const button = wrapper.find('.v-btn')
    wrapper.vm.toggleDarkMode = jest.fn()
    expect(wrapper.vm.toggleDarkMode).toHaveBeenCalledTimes(0)
    button.trigger('click')
    expect(wrapper.vm.toggleDarkMode).toHaveBeenCalledTimes(1)
  })
})
