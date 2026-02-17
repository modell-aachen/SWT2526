import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import EditPage from './EditPage.vue'
import { useElementsStore } from '../../stores/elements/elements'
import ElementWrapper from '../../components/ElementWrapper/ElementWrapper.vue'
import GridCanvas from '../../components/GridCanvas/GridCanvas.vue'

describe('EditPage', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('page structure', () => {
    it('renders the page container', () => {
      const wrapper = mount(EditPage)
      const container = wrapper.find('[data-testid="edit-page-container"]')
      expect(container.exists()).toBe(true)
    })

    it('renders GridCanvas component', () => {
      const wrapper = mount(EditPage)
      expect(wrapper.findComponent(GridCanvas).exists()).toBe(true)
    })

    it('renders no elements initially', () => {
      const wrapper = mount(EditPage)
      expect(wrapper.findAllComponents(ElementWrapper)).toHaveLength(0)
    })

    it('renders elements from store', () => {
      const store = useElementsStore()
      store.addShape('rectangle')
      store.addShape('triangle')

      const wrapper = mount(EditPage)
      expect(wrapper.findAllComponents(ElementWrapper)).toHaveLength(2)
    })

    it('renders sidebar toggle button', () => {
      const wrapper = mount(EditPage)
      expect(wrapper.find('[data-testid="sidebar-toggle"]').exists()).toBe(true)
    })
  })

  describe('canvas integration', () => {
    it('deselects element when GridCanvas emits canvas-click', async () => {
      const store = useElementsStore()
      store.addShape('rectangle')
      if (store.elements[0]) store.selectElement(store.elements[0].id)

      const wrapper = mount(EditPage)
      const gridCanvas = wrapper.findComponent(GridCanvas)

      await gridCanvas.vm.$emit('canvas-click')

      expect(store.selectedElementId).toBeNull()
    })

    it('deletes selected element when GridCanvas emits delete-selected', async () => {
      const store = useElementsStore()
      store.addShape('rectangle')
      if (store.elements[0]) store.selectElement(store.elements[0].id)

      const wrapper = mount(EditPage)
      const gridCanvas = wrapper.findComponent(GridCanvas)

      await gridCanvas.vm.$emit('delete-selected')

      expect(store.elements).toHaveLength(0)
    })
  })

  describe('element interactions', () => {
    it('selects element when clicking on ElementWrapper', async () => {
      const store = useElementsStore()
      store.addShape('rectangle')
      const elementId = store.elements[0]!.id
      store.selectElement(null) // Deselect first

      const wrapper = mount(EditPage)
      const elementWrapper = wrapper.findComponent(ElementWrapper)

      // ElementWrapper emits 'select' event instead of click for selection
      await elementWrapper.vm.$emit('select')

      expect(store.selectedElementId).toBe(elementId)
    })

    it('passed correct props to ElementWrapper', () => {
      const store = useElementsStore()
      store.addShape('rectangle', 150, 200)
      store.elements[0]!.width = 120
      store.elements[0]!.height = 180
      // Outline/fill are part of element object now

      const wrapper = mount(EditPage)
      const elementWrapper = wrapper.findComponent(ElementWrapper)
      const elementProp = elementWrapper.props('element')

      expect(elementProp.x).toBe(150)
      expect(elementProp.y).toBe(200)
      expect(elementProp.width).toBe(120)
      expect(elementProp.height).toBe(180)
    })

    it('updates element position when ElementWrapper emits drag', async () => {
      const store = useElementsStore()
      store.addShape('rectangle', 100, 100)

      const wrapper = mount(EditPage)
      const elementWrapper = wrapper.findComponent(ElementWrapper)

      await elementWrapper.vm.$emit('drag', 25, 35)

      expect(store.elements[0]!.x).toBe(125)
      expect(store.elements[0]!.y).toBe(135)
    })

    it('updates element size when ElementWrapper emits resize', async () => {
      const store = useElementsStore()
      store.addShape('rectangle', 100, 100)

      const wrapper = mount(EditPage)
      const elementWrapper = wrapper.findComponent(ElementWrapper)

      // Mock calculateNewElementState logic via actual store update because tests run logic
      // Actually we just check if it calls the handler which updates the store
      // But we need to depend on the real logic unless we mock methods.
      // The real logic uses elementTransforms.

      await elementWrapper.vm.$emit('resize', 'se', 30, 40)

      expect(store.elements[0]!.width).toBe(140)
      expect(store.elements[0]!.height).toBe(140)
    })
  })

  describe('keyboard interactions', () => {
    it('moves selected element with arrow keys', async () => {
      const store = useElementsStore()
      store.addShape('rectangle', 100, 100) // id: shape-1
      const elementId = store.elements[0]!.id
      store.selectElement(elementId)

      mount(EditPage)

      // Initial position: 100, 100

      // Move Right (5px)
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
      expect(store.elements[0]!.x).toBe(105)
      expect(store.elements[0]!.y).toBe(100)

      // Move Down (5px)
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }))
      expect(store.elements[0]!.x).toBe(105)
      expect(store.elements[0]!.y).toBe(105)

      // Move Left with Shift (20px)
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowLeft', shiftKey: true })
      )
      expect(store.elements[0]!.x).toBe(85) // 105 - 20
      expect(store.elements[0]!.y).toBe(105)

      // Move Up (5px)
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }))
      expect(store.elements[0]!.x).toBe(85)
      expect(store.elements[0]!.y).toBe(100) // 105 - 5
    })
  })
})
