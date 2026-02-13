import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import ViewPage from './ViewPage.vue'
import { useElementsStore } from '../../stores/elements/elements'
import type { Snapshot } from '../../stores/elements/elements'
import GridCanvas from '../../components/GridCanvas/GridCanvas.vue'
import ElementWrapperReadOnly from '../../components/ElementWrapperReadOnly/ElementWrapperReadOnly.vue'

const mockCanvasJson: Snapshot = {
  version: 1,
  timestamp: 1700000000000,
  elements: [
    {
      id: 'shape-1',
      type: 'shape',
      shapeType: 'rectangle',
      x: 100,
      y: 150,
      width: 200,
      height: 120,
      rotation: 0,
      zIndex: 0,
      fill: '#ff0000',
      outline: '#000000',
      strokeWeight: 3,
    },
    {
      id: 'shape-2',
      type: 'shape',
      shapeType: 'triangle',
      x: 400,
      y: 200,
      width: 150,
      height: 150,
      rotation: 45,
      zIndex: 1,
      fill: 'transparent',
      outline: '#0000ff',
      strokeWeight: 2,
    },
  ],
  nextId: 3,
}

describe('ViewPage', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('page structure', () => {
    it('renders the page container', () => {
      const wrapper = mount(ViewPage)
      expect(wrapper.find('[data-testid="view-page-container"]').exists()).toBe(
        true
      )
    })

    it('renders GridCanvas component', () => {
      const wrapper = mount(ViewPage)
      expect(wrapper.findComponent(GridCanvas).exists()).toBe(true)
    })

    it('renders the floating toolbar', () => {
      const wrapper = mount(ViewPage)
      expect(wrapper.find('[data-testid="view-toolbar"]').exists()).toBe(true)
    })

    it('renders a load button', () => {
      const wrapper = mount(ViewPage)
      expect(wrapper.find('[data-testid="load-button"]').exists()).toBe(true)
    })

    it('canvas container has flex flex-col for proper GridCanvas sizing', () => {
      const wrapper = mount(ViewPage)
      const canvasContainer = wrapper.find(
        '[data-testid="view-page-container"] > div'
      )
      expect(canvasContainer.classes()).toContain('flex')
      expect(canvasContainer.classes()).toContain('flex-col')
      expect(canvasContainer.classes()).toContain('flex-1')
    })
  })

  describe('element rendering', () => {
    it('renders no elements initially', () => {
      const wrapper = mount(ViewPage)
      expect(wrapper.findAllComponents(ElementWrapperReadOnly)).toHaveLength(0)
    })

    it('renders elements from store', () => {
      const store = useElementsStore()
      store.addShape('rectangle')
      store.addShape('triangle')

      const wrapper = mount(ViewPage)
      expect(wrapper.findAllComponents(ElementWrapperReadOnly)).toHaveLength(2)
    })

    it('clears selection on mount', () => {
      const store = useElementsStore()
      store.addShape('rectangle')
      store.selectElement(store.elements[0]!.id)

      mount(ViewPage)
      expect(store.selectedElementId).toBeNull()
    })
  })

  describe('loading JSON snapshot', () => {
    it('renders shapes after importing a snapshot', async () => {
      const store = useElementsStore()
      const wrapper = mount(ViewPage)

      // Simulate what happens when a canvas.json is loaded
      store.importSnapshot(mockCanvasJson)
      await wrapper.vm.$nextTick()

      const renderers = wrapper.findAllComponents(ElementWrapperReadOnly)
      expect(renderers).toHaveLength(2)
    })

    it('renders the correct shape types from imported snapshot', async () => {
      const store = useElementsStore()
      const wrapper = mount(ViewPage)

      store.importSnapshot(mockCanvasJson)
      await wrapper.vm.$nextTick()

      // Verify both shapes are rendered as SVGs
      expect(wrapper.find('[data-testid="rectangle-shape"]').exists()).toBe(
        true
      )
      expect(wrapper.find('[data-testid="triangle-shape"]').exists()).toBe(true)
    })

    it('positions elements correctly from imported snapshot', async () => {
      const store = useElementsStore()
      const wrapper = mount(ViewPage)

      store.importSnapshot(mockCanvasJson)
      await wrapper.vm.$nextTick()

      const renderers = wrapper.findAllComponents(ElementWrapperReadOnly)
      const firstStyle = renderers[0]!.attributes('style')
      expect(firstStyle).toContain('left: 100px')
      expect(firstStyle).toContain('top: 150px')
      expect(firstStyle).toContain('width: 200px')
      expect(firstStyle).toContain('height: 120px')
    })

    it('stores elements correctly after import', async () => {
      const store = useElementsStore()

      store.importSnapshot(mockCanvasJson)

      expect(store.elements).toHaveLength(2)
      expect(store.elements[0]!.id).toBe('shape-1')
      expect(store.elements[1]!.id).toBe('shape-2')
      expect(store.nextId).toBe(3)
    })
  })
})
