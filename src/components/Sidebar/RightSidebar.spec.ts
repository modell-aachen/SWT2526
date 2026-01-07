import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import RightSidebar from './RightSidebar.vue'
import { useShapesStore } from '@/stores/shapes/shapes'

describe('RightSidebar', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders when a shape is selected', async () => {
    const store = useShapesStore()
    store.addShape('rectangle')
    store.selectShape(store.shapes[0].id)

    const wrapper = mount(RightSidebar)

    expect(wrapper.find('[data-testid="right-sidebar"]').exists()).toBe(true)
  })

  it('does not render when no shape is selected', () => {
    const wrapper = mount(RightSidebar)

    expect(wrapper.find('[data-testid="right-sidebar"]').exists()).toBe(false)
  })

  it('initializes input with current shape link without protocol', async () => {
    const store = useShapesStore()
    store.addShape('rectangle')
    store.updateShapeLink(store.shapes[0]!.id, 'https://test.com')
    store.selectShape(store.shapes[0]!.id)

    const wrapper = mount(RightSidebar)
    await wrapper.vm.$nextTick()

    const input = wrapper.find('input')
    expect(input.element.value).toBe('test.com')
  })

  it('updates shape link with https prefix when save button is clicked', async () => {
    const store = useShapesStore()
    store.addShape('rectangle')
    store.selectShape(store.shapes[0]!.id)

    const wrapper = mount(RightSidebar)
    const input = wrapper.find('input')
    // Find button by title since we added title="Save link"
    const button = wrapper.find('button[title="Save link"]')

    await input.setValue('new-link.com')
    await button.trigger('click')

    expect(store.shapes[0]!.link).toBe('https://new-link.com')
  })

  it('updates input value when selected shape changes', async () => {
    const store = useShapesStore()
    store.addShape('rectangle') // id: rectangle-1
    store.updateShapeLink('rectangle-1', 'https://link1.com')
    store.addShape('triangle') // id: triangle-2
    store.updateShapeLink('triangle-2', 'https://link2.com')

    store.selectShape('rectangle-1')
    const wrapper = mount(RightSidebar)
    await wrapper.vm.$nextTick()

    expect(wrapper.find('input').element.value).toBe('link1.com')

    store.selectShape('triangle-2')
    await wrapper.vm.$nextTick()

    expect(wrapper.find('input').element.value).toBe('link2.com')
  })
  it('removes shape link when remove button is clicked', async () => {
    const store = useShapesStore()
    store.addShape('rectangle')
    store.updateShapeLink(store.shapes[0]!.id, 'https://test.com')
    store.selectShape(store.shapes[0]!.id)

    const wrapper = mount(RightSidebar)
    // Find remove button by title "Remove link"
    const button = wrapper.find('button[title="Remove link"]')

    await button.trigger('click')

    expect(store.shapes[0]!.link).toBeUndefined()
  })

  it('strips duplicate protocol from input before saving', async () => {
    const store = useShapesStore()
    store.addShape('rectangle')
    store.selectShape(store.shapes[0]!.id)

    const wrapper = mount(RightSidebar)
    const input = wrapper.find('input')
    const button = wrapper.find('button[title="Save link"]')

    // User types full URL including https://
    await input.setValue('https://duplicate.com')
    await button.trigger('click')

    // Should result in https://duplicate.com, NOT https://https://duplicate.com
    expect(store.shapes[0]!.link).toBe('https://duplicate.com')
  })
})
