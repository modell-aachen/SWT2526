import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import EditPage from './EditPage.vue'

describe('EditPage', () => {
  it('renders properly', () => {
    const wrapper = mount(EditPage)
    expect(wrapper.exists()).toBe(true)
  })

  it('displays the correct heading', () => {
    const wrapper = mount(EditPage)
    const heading = wrapper.find('h1')
    expect(heading.exists()).toBe(true)
    expect(heading.text()).toBe('Edit Page')
  })

  it('matches snapshot', () => {
    const wrapper = mount(EditPage)
    expect(wrapper.html()).toMatchSnapshot()
  })
})
