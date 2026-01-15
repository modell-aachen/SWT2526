import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TextContextBar from './TextContextBar.vue'

describe('TextContextBar', () => {
  it('positions correctly using shared composable logic', () => {
    const wrapper = mount(TextContextBar, {
      props: {
        width: 100,
        height: 50,
        y: 100,
        rotation: 90,
      },
    })

    const style = (wrapper.element as HTMLElement).style
    expect(style.top).toBe('-73px')
  })
})
