import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import RightSidebar from './RightSidebar.vue'
import { useElementsStore } from '@/stores/elements/elements'
import flushPromises from 'flush-promises'
import type { ShapeElement } from '@/types/Element'

const { loadFromFileMock } = vi.hoisted(() => ({
  loadFromFileMock: vi.fn(),
}))

vi.mock('@/composables/useCanvasIO', () => ({
  useCanvasIO: () => ({
    loadFromFile: loadFromFileMock,
  }),
}))

describe('RightSidebar', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders when a shape is selected', async () => {
    const store = useElementsStore()
    store.addShape('rectangle')
    if (store.elements[0]) store.selectElement(store.elements[0].id)

    const wrapper = mount(RightSidebar)

    expect(wrapper.find('[data-testid="right-sidebar"]').exists()).toBe(true)
  })

  it('does not render when no shape is selected', () => {
    const wrapper = mount(RightSidebar)

    expect(wrapper.find('[data-testid="right-sidebar"]').exists()).toBe(false)
  })

  it('initializes input with current shape link without protocol', async () => {
    const store = useElementsStore()
    store.addShape('rectangle')
    store.updateElement(store.elements[0]!.id, { link: 'https://test.com' })
    store.selectElement(store.elements[0]!.id)

    const wrapper = mount(RightSidebar)
    await wrapper.vm.$nextTick()

    const input = wrapper.find('#shape-link')
    expect((input.element as HTMLInputElement).value).toBe('test.com')
  })

  it('updates shape link with https prefix when save button is clicked', async () => {
    const store = useElementsStore()
    store.addShape('rectangle')
    store.selectElement(store.elements[0]!.id)

    const wrapper = mount(RightSidebar)
    const input = wrapper.find('#shape-link')
    // Find button by title since we added title="Save link"
    const button = wrapper.find('button[title="Save link"]')

    await input.setValue('new-link.com')
    await button.trigger('click')

    expect((store.elements[0] as ShapeElement).link).toBe(
      'https://new-link.com'
    )
  })

  it('updates input value when selected shape changes', async () => {
    const store = useElementsStore()
    store.addShape('rectangle')
    const id1 = store.elements[0]!.id
    store.updateElement(id1, { link: 'https://link1.com' })

    store.addShape('triangle')
    const id2 = store.elements[1]!.id
    store.updateElement(id2, { link: 'https://link2.com' })

    store.selectElement(id1)
    const wrapper = mount(RightSidebar)
    await wrapper.vm.$nextTick()

    // Ensure input exists before checking
    expect(wrapper.find('#shape-link').exists()).toBe(true)
    expect(
      (wrapper.find('#shape-link').element as HTMLInputElement).value
    ).toBe('link1.com')

    store.selectElement(id2)
    await wrapper.vm.$nextTick()

    expect(
      (wrapper.find('#shape-link').element as HTMLInputElement).value
    ).toBe('link2.com')
  })

  it('removes shape link when remove button is clicked', async () => {
    const store = useElementsStore()
    store.addShape('rectangle')
    store.updateElement(store.elements[0]!.id, { link: 'https://test.com' })
    store.selectElement(store.elements[0]!.id)

    const wrapper = mount(RightSidebar)
    // Find remove button by title "Remove link"
    const button = wrapper.find('button[title="Remove link"]')

    await button.trigger('click')

    expect((store.elements[0] as ShapeElement).link).toBeUndefined()
  })

  it('strips duplicate protocol from input before saving', async () => {
    const store = useElementsStore()
    store.addShape('rectangle')
    store.selectElement(store.elements[0]!.id)

    const wrapper = mount(RightSidebar)
    const input = wrapper.find('#shape-link')
    const button = wrapper.find('button[title="Save link"]')

    // User types full URL including https://
    await input.setValue('https://duplicate.com')
    await button.trigger('click')

    // Should result in https://duplicate.com, NOT https://https://duplicate.com
    expect((store.elements[0] as any).link).toBe('https://duplicate.com')
  })

  it('updates shape outline color', async () => {
    const store = useElementsStore()
    store.addShape('rectangle')
    store.selectElement(store.elements[0]!.id)

    const wrapper = mount(RightSidebar)
    const input = wrapper.find('#shape-outline')

    await input.setValue('#ff0000')
    await input.trigger('input') // Trigger input to update model
    await input.trigger('change')

    expect((store.elements[0] as ShapeElement).outline).toBe('#ff0000')
  })

  it('updates shape fill color', async () => {
    const store = useElementsStore()
    store.addShape('rectangle')
    store.selectElement(store.elements[0]!.id)

    const wrapper = mount(RightSidebar)
    const input = wrapper.find('#shape-fill')

    await input.setValue('#00ff00')
    await input.trigger('input')
    await input.trigger('change')

    expect((store.elements[0] as ShapeElement).fill).toBe('#00ff00')
  })

  it('updates shape stroke weight', async () => {
    const store = useElementsStore()
    store.addShape('rectangle')
    store.selectElement(store.elements[0]!.id)

    const wrapper = mount(RightSidebar)
    const input = wrapper.find('#shape-stroke-width')

    await input.setValue('5')
    await input.trigger('input')
    await input.trigger('change')

    expect((store.elements[0] as any).strokeWeight).toBe(5)
  })

  it('allows updating text within shapes', async () => {
    const store = useElementsStore()
    store.addShape('rectangle')
    store.selectElement(store.elements[0]!.id)

    const wrapper = mount(RightSidebar)
    const input = wrapper.find('#shape-text-content')

    await input.setValue('test')
    await input.trigger('input')
    await input.trigger('change')

    expect((store.elements[0] as ShapeElement).content).toBe('test')

    const fontSizeInput = wrapper.find('#shape-font-size')

    await fontSizeInput.setValue('16')
    await fontSizeInput.trigger('input')
    await fontSizeInput.trigger('change')

    expect((store.elements[0] as ShapeElement).fontSize).toBe(16)

    const textColorInput = wrapper.find('#shape-text-color')

    await textColorInput.setValue('#ff0000')
    await textColorInput.trigger('input')
    await textColorInput.trigger('change')

    expect((store.elements[0] as ShapeElement).color).toBe('#ff0000')
  })

  it('shows an alert when loading an invalid file', async () => {
    const store = useElementsStore()
    store.addShape('rectangle')
    store.selectElement(store.elements[0]!.id)

    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => { })

    const wrapper = mount(RightSidebar)
    const fileInput = wrapper.find('input[type="file"]')

    const file = new File(['invalid content'], 'test.txt', {
      type: 'text/plain',
    })
    Object.defineProperty(fileInput.element, 'files', {
      value: [file],
      writable: false,
    })

    loadFromFileMock.mockRejectedValue(new Error('Invalid JSON'))

    await fileInput.trigger('change')

    // Wait for async handler
    await flushPromises()

    expect(alertSpy).toHaveBeenCalledWith(
      'Failed to load file. Please ensure it is a valid JSON file.'
    )
  })
})
