import { describe, it, expect, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import ElementContextBar from './ElementContextBar.vue'

describe('ElementContextBar', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    wrapper = mount(ElementContextBar)
  })

  it('renders all action buttons', () => {
    expect(wrapper.find('[data-testid="context-copy-button"]').exists()).toBe(
      true
    )
    expect(
      wrapper.find('[data-testid="context-duplicate-button"]').exists()
    ).toBe(true)
    expect(wrapper.find('[data-testid="context-rotate-button"]').exists()).toBe(
      true
    )
    expect(wrapper.find('[data-testid="context-up-button"]').exists()).toBe(
      true
    )
    expect(wrapper.find('[data-testid="context-down-button"]').exists()).toBe(
      true
    )
    expect(wrapper.find('[data-testid="context-delete-button"]').exists()).toBe(
      true
    )
  })

  it('emits copy event when copy button is clicked', async () => {
    await wrapper.find('[data-testid="context-copy-button"]').trigger('click')
    expect(wrapper.emitted('copy')).toHaveLength(1)
  })

  it('emits duplicate event when duplicate button is clicked', async () => {
    await wrapper
      .find('[data-testid="context-duplicate-button"]')
      .trigger('click')
    expect(wrapper.emitted('duplicate')).toHaveLength(1)
  })

  it('emits rotate event when rotate button is clicked', async () => {
    await wrapper.find('[data-testid="context-rotate-button"]').trigger('click')
    expect(wrapper.emitted('rotate')).toHaveLength(1)
  })

  it('emits up event when bring to front button is clicked', async () => {
    await wrapper.find('[data-testid="context-up-button"]').trigger('click')
    expect(wrapper.emitted('up')).toHaveLength(1)
  })

  it('emits down event when send to back button is clicked', async () => {
    await wrapper.find('[data-testid="context-down-button"]').trigger('click')
    expect(wrapper.emitted('down')).toHaveLength(1)
  })

  it('emits delete event when delete button is clicked', async () => {
    await wrapper.find('[data-testid="context-delete-button"]').trigger('click')
    expect(wrapper.emitted('delete')).toHaveLength(1)
  })
})
