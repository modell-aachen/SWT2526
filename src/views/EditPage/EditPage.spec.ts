import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import EditPage from './EditPage.vue'
import { useElementsStore } from '../../stores/elements/elements'
import ElementWrapper from '../../components/ElementWrapper/ElementWrapper.vue'
import GridCanvas from '../../components/GridCanvas/GridCanvas.vue'
import FloatingZoomControls from '../../components/FloatingZoomControls/FloatingZoomControls.vue'
import RightSidebar from '../../components/Sidebar/RightBar/RightSidebar.vue'

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

  describe('group rotation', () => {
    it('keeps group rotation at 0 and distributes rotation to children', async () => {
      const store = useElementsStore()
      store.addShape('rectangle', 0, 0)
      store.addShape('rectangle', 100, 0)
      const childId1 = store.elements[0]!.id
      const childId2 = store.elements[1]!.id

      store.selectElement(childId1)
      store.addToSelection(childId2)
      store.groupSelectedElements()

      const groupId = store.selectedElementIds[0]!

      const wrapper = mount(EditPage)
      const groupWrapper = wrapper
        .findAllComponents(ElementWrapper)
        .find((w) => w.props('element').id === groupId)

      expect(groupWrapper).toBeDefined()

      // Emit rotate on the group
      await groupWrapper!.vm.$emit('rotate')
      await wrapper.vm.$nextTick()

      // Group rotation should stay 0 (no double rotation via CSS)
      const updatedGroup = store.elements.find((e) => e.id === groupId)!
      expect(updatedGroup.rotation).toBe(0)

      // Children should have rotation = 90
      const child1 = store.elements.find((e) => e.id === childId1)!
      const child2 = store.elements.find((e) => e.id === childId2)!
      expect(child1.rotation).toBe(90)
      expect(child2.rotation).toBe(90)
    })

    it('recalculates group bounds after rotating children', async () => {
      const store = useElementsStore()
      store.addShape('rectangle', 0, 0)
      store.updateElement(
        store.elements[0]!.id,
        { width: 200, height: 50 },
        false
      )
      store.addShape('rectangle', 250, 0)
      store.updateElement(
        store.elements[1]!.id,
        { width: 50, height: 50 },
        false
      )

      store.selectElement(store.elements[0]!.id)
      store.addToSelection(store.elements[1]!.id)
      store.groupSelectedElements()

      const groupId = store.selectedElementIds[0]!
      const groupBefore = store.elements.find((e) => e.id === groupId)!

      expect(groupBefore.width).toBe(300)
      expect(groupBefore.height).toBe(50)

      const wrapper = mount(EditPage)
      const groupWrapper = wrapper
        .findAllComponents(ElementWrapper)
        .find((w) => w.props('element').id === groupId)

      await groupWrapper!.vm.$emit('rotate')
      await wrapper.vm.$nextTick()

      const groupAfter = store.elements.find((e) => e.id === groupId)!
      expect(groupAfter.rotation).toBe(0)
      // After children rotate, the 200x50 shape becomes visually 50x200
      // The group bounds must expand vertically
      expect(groupAfter.height).toBeGreaterThan(50)
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

  describe('floating zoom controls', () => {
    it('positions controls in bottom-right when right sidebar is collapsed', () => {
      const wrapper = mount(EditPage)
      const floatingControls = wrapper.findComponent(FloatingZoomControls)

      expect(floatingControls.exists()).toBe(true)
      expect(floatingControls.classes()).toContain('right-[50px]')
    })

    it('moves zoom controls left when right sidebar auto-expands', async () => {
      const store = useElementsStore()
      const wrapper = mount(EditPage)
      const floatingControls = wrapper.findComponent(FloatingZoomControls)
      expect(floatingControls.classes()).toContain('right-[50px]')

      store.addShape('rectangle')
      await wrapper.vm.$nextTick()

      expect(floatingControls.classes()).toContain('right-[330px]')
    })

    it('moves zoom controls back to bottom-right when right sidebar is collapsed', async () => {
      const store = useElementsStore()
      const wrapper = mount(EditPage)
      const floatingControls = wrapper.findComponent(FloatingZoomControls)

      store.addShape('rectangle')
      await wrapper.vm.$nextTick()

      expect(floatingControls.classes()).toContain('right-[330px]')

      const toggleButtons = wrapper.findAll('[data-testid="sidebar-toggle"]')
      const rightToggle = toggleButtons.find((btn) =>
        btn.classes().includes('right-3')
      )

      expect(rightToggle).toBeTruthy()

      await rightToggle!.trigger('click')

      expect(floatingControls.classes()).toContain('right-[50px]')
    })

    it('renders zoom in/out, percentage, reset, and auto-fit buttons', () => {
      const wrapper = mount(EditPage)

      expect(wrapper.find('[data-testid="zoom-out-button"]').exists()).toBe(
        true
      )
      expect(
        wrapper.find('[data-testid="zoom-percentage-button"]').exists()
      ).toBe(true)
      expect(wrapper.find('[data-testid="zoom-in-button"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="reset-zoom-button"]').exists()).toBe(
        true
      )
      expect(wrapper.find('[data-testid="auto-fit-button"]').exists()).toBe(
        true
      )
    })
  })

  describe('right sidebar behavior', () => {
    it('auto-expands when an element is selected', async () => {
      const store = useElementsStore()
      const wrapper = mount(EditPage)

      store.addShape('rectangle')
      await wrapper.vm.$nextTick()

      const rightSidebar = wrapper.findComponent(RightSidebar)
      expect(rightSidebar.exists()).toBe(true)
      expect(rightSidebar.props('isCollapsed')).toBe(false)
    })
  })
})
