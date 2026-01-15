import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ElementLink from './ElementLink.vue'

describe('ElementLink', () => {
  it('renders correctly with given link', () => {
    const link = 'https://example.com'
    const wrapper = mount(ElementLink, {
      props: { link },
    })

    const anchor = wrapper.find('a')
    expect(anchor.exists()).toBe(true)
    expect(anchor.attributes('href')).toBe(link)
    expect(anchor.attributes('target')).toBe('_blank')
    expect(anchor.attributes('rel')).toBe('noopener noreferrer')
  })

  it('stops propagation of mousedown event', async () => {
    const wrapper = mount(ElementLink, {
      props: { link: 'https://example.com' },
    })

    const anchor = wrapper.find('a')

    const stopPropagation = vi.fn()
    await anchor.trigger('mousedown', { stopPropagation })

    // Vue's @mousedown.stop modifier calls stopPropagation
    expect(stopPropagation).toHaveBeenCalled()
  })
})
