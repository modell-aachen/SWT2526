import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ViewPage from './ViewPage.vue'

describe('ViewPage', () => {
  it('renders properly', () => {
    const wrapper = mount(ViewPage)
    expect(wrapper.exists()).toBe(true)
  })

  it('displays the correct heading', () => {
    const wrapper = mount(ViewPage)
    const heading = wrapper.find('h1')
    expect(heading.exists()).toBe(true)
    expect(heading.text()).toBe('View Page')
  })

  it('matches snapshot', () => {
    const wrapper = mount(ViewPage)
    expect(wrapper.html()).toMatchSnapshot()
  })
})
