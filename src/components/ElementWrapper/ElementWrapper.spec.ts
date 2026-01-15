import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ElementWrapper from './ElementWrapper.vue'
import GenericShape from '../Shapes/GenericShape.vue'
import { createPinia, setActivePinia } from 'pinia'

// Mock the draggable/resizable composables to avoid errors
vi.mock('@/composables/useDraggable', () => ({
  useDraggable: () => ({ startDrag: vi.fn() }),
}))
vi.mock('@/composables/useResizable', () => ({
  useResizable: () => ({ startResize: vi.fn() }),
}))

describe('ElementWrapper', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('passes strokeWeight prop to shape component', () => {
    const element = {
      id: '1',
      type: 'shape',
      shapeType: 'rectangle',
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      rotation: 0,
      zIndex: 1,
      outline: '#000',
      fill: 'transparent',
      strokeWeight: 5,
    } as any

    const wrapper = mount(ElementWrapper, {
      props: {
        element,
        selected: false,
      },
    })

    // Find the Rectangle component
    const rectangle = wrapper.findComponent(GenericShape)
    expect(rectangle.exists()).toBe(true)

    // Check props
    expect(rectangle.props('strokeWeight')).toBe(5)
  })

  it('updates component props when element changes', async () => {
    const element = {
      id: '1',
      type: 'shape',
      shapeType: 'rectangle',
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      rotation: 0,
      zIndex: 1,
      outline: '#000',
      fill: 'transparent',
      strokeWeight: 5,
    } as any

    const wrapper = mount(ElementWrapper, {
      props: {
        element,
        selected: false,
      },
    })

    const rectangle = wrapper.findComponent(GenericShape)
    expect(rectangle.props('strokeWeight')).toBe(5)

    // Update element prop
    await wrapper.setProps({
      element: {
        ...element,
        strokeWeight: 10,
      },
    })

    expect(rectangle.props('strokeWeight')).toBe(10)
  })
})
