import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TextContextBar from './TextContextBar.vue'

describe('TextContextBar', () => {
  it('renders all action buttons', () => {
    const wrapper = mount(TextContextBar)

    expect(wrapper.find('[data-testid="context-copy-button"]').exists()).toBe(
      true
    )
    expect(
      wrapper.find('[data-testid="context-duplicate-button"]').exists()
    ).toBe(true)
    expect(wrapper.find('[data-testid="context-rotate-button"]').exists()).toBe(
      true
    )
    expect(wrapper.find('[data-testid="context-delete-button"]').exists()).toBe(
      true
    )
  })

  it('emits correct events when buttons are clicked', async () => {
    const wrapper = mount(TextContextBar)

    await wrapper.find('[data-testid="context-copy-button"]').trigger('click')
    expect(wrapper.emitted('copy')).toBeTruthy()

    await wrapper
      .find('[data-testid="context-duplicate-button"]')
      .trigger('click')
    expect(wrapper.emitted('duplicate')).toBeTruthy()

    await wrapper.find('[data-testid="context-rotate-button"]').trigger('click')
    expect(wrapper.emitted('rotate')).toBeTruthy()

    await wrapper.find('[data-testid="context-delete-button"]').trigger('click')
    expect(wrapper.emitted('delete')).toBeTruthy()
  })
})
