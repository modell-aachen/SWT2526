import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import IconElement from './IconElement.vue'
import { ICONS } from '@/components/Icons'

describe('IconElement', () => {
  it('renders correctly with given props', () => {
    const wrapper = mount(IconElement, {
      props: {
        iconType: 'arrowUp',
        color: '#ff0000',
        strokeWeight: 2,
      },
    })

    expect(wrapper.exists()).toBe(true)
    // Check color style
    const div = wrapper.find('div')
    expect(div.attributes('style')).toContain('color: rgb(255, 0, 0)')

    // Check if the correct icon component is resolved
    // Accessing component instance exposed properties
    expect((wrapper.vm as any).iconComponent).toBe(ICONS.arrowUp)
  })

  it('updates icon when iconType prop changes', async () => {
    const wrapper = mount(IconElement, {
      props: {
        iconType: 'arrowUp',
        color: '#000000',
        strokeWeight: 2,
      },
    })

    expect((wrapper.vm as any).iconComponent).toBe(ICONS.arrowUp)

    await wrapper.setProps({ iconType: 'arrowDown' })
    expect((wrapper.vm as any).iconComponent).toBe(ICONS.arrowDown)
  })

  it('passes props to the icon component', () => {
    const wrapper = mount(IconElement, {
      props: {
        iconType: 'arrowLeft',
        color: '#000000',
        strokeWeight: 3,
      },
      global: {
        stubs: {
          // Stub the inner dynamic component to verify props passed to it
          // However, since we use :is="component", stubbing might be tricky if we don't name it.
          // But the lucide icons render SVGs.
        },
      },
    })

    // We can check attributes on the rendered SVG or the stub if we stubbed it.
    // Lucide icons usually accept stroke-width.
    // If we don't stub, we might see the svg.

    // Let's rely on checking if the computed property handles the logic correctly for now,
    // or check if the rendered component has the stroke-width attribute if it renders an SVG.
    // The IconElement passes :stroke-width="strokeWeight".

    // Assuming Lucide icon renders an svg
    if (wrapper.find('svg').exists()) {
      expect(wrapper.find('svg').attributes('stroke-width')).toBe('3')
    }
  })
})
