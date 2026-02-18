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

  describe('floating zoom controls', () => {
    it('renders zoom controls', () => {
      const wrapper = mount(EditPage)
      const floatingControls = wrapper.findComponent(FloatingZoomControls)
      expect(floatingControls.exists()).toBe(true)
    })

    it('moves zoom controls when right sidebar auto-expands', async () => {
      const store = useElementsStore()
      const wrapper = mount(EditPage)
      const floatingControls = wrapper.findComponent(FloatingZoomControls)
      expect(floatingControls.classes()).toContain('right-[50px]')

      store.addShape('rectangle')
      await wrapper.vm.$nextTick()

      expect(floatingControls.classes()).toContain('right-[330px]')
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
