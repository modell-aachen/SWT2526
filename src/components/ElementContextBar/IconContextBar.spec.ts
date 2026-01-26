import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import IconContextBar from './IconContextBar.vue'

describe('IconContextBar', () => {
  it('renders correctly', () => {
    const wrapper = mount(IconContextBar)
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('[data-testid="icon-context-bar"]').exists()).toBe(true)
  })

  it('emits events when buttons are clicked', async () => {
    const wrapper = mount(IconContextBar)

    await wrapper.find('[data-testid="context-copy-button"]').trigger('click')
    expect(wrapper.emitted('copy')).toHaveLength(1)

    await wrapper
      .find('[data-testid="context-duplicate-button"]')
      .trigger('click')
    expect(wrapper.emitted('duplicate')).toHaveLength(1)

    await wrapper.find('[data-testid="context-delete-button"]').trigger('click')
    expect(wrapper.emitted('delete')).toHaveLength(1)
  })
})
