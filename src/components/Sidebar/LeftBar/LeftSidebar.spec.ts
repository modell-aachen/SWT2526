import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import LeftSidebar from './LeftSidebar.vue'
import { useElementsStore } from '@/stores/elements/elements'

describe('LeftSidebar', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    document.documentElement.classList.remove('dark-mode')
  })

  describe('rendering', () => {
    it('renders the sidebar container', () => {
      const wrapper = mount(LeftSidebar, {
        props: { isCollapsed: false },
      })

      expect(wrapper.find('[data-testid="app-sidebar"]').exists()).toBe(true)
    })

    it('shows "Tools" header when expanded', () => {
      const wrapper = mount(LeftSidebar, {
        props: { isCollapsed: false },
      })

      expect(wrapper.text()).toContain('Tools')
    })

    it('hides "Tools" header when collapsed', () => {
      const wrapper = mount(LeftSidebar, {
        props: { isCollapsed: true },
      })

      expect(wrapper.text()).not.toContain('Tools')
    })

    it('renders shape buttons for all shapes', () => {
      const wrapper = mount(LeftSidebar, {
        props: { isCollapsed: false },
      })

      const shapeButtons = wrapper.findAll('[data-testid="shape-button"]')
      expect(shapeButtons).toHaveLength(3) // rectangle, triangle, trapezoid
    })

    it('renders sidebar group with Shapes title', () => {
      const wrapper = mount(LeftSidebar, {
        props: { isCollapsed: false },
      })

      expect(wrapper.text()).toContain('Shapes')
      expect(wrapper.find('[data-testid="sidebar-group"]').exists()).toBe(true)
    })
  })

  describe('footer buttons', () => {
    it('renders all footer action buttons', () => {
      const wrapper = mount(LeftSidebar, {
        props: { isCollapsed: false },
      })

      expect(wrapper.find('[data-testid="undo-button"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="redo-button"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="paste-button"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="clear-all-button"]').exists()).toBe(
        true
      )
      expect(wrapper.find('[data-testid="dark-mode-button"]').exists()).toBe(
        true
      )
    })

    it('disables undo button when no history', () => {
      const wrapper = mount(LeftSidebar, {
        props: { isCollapsed: false },
      })

      const undoButton = wrapper.find('[data-testid="undo-button"]')
      expect(undoButton.attributes('disabled')).toBeDefined()
    })

    it('enables undo button when history exists', () => {
      const store = useElementsStore()
      store.addShape('rectangle')

      const wrapper = mount(LeftSidebar, {
        props: { isCollapsed: false },
      })

      const undoButton = wrapper.find('[data-testid="undo-button"]')
      expect(undoButton.attributes('disabled')).toBeUndefined()
    })

    it('calls undo when undo button is clicked', async () => {
      const store = useElementsStore()
      store.addShape('rectangle')

      const wrapper = mount(LeftSidebar, {
        props: { isCollapsed: false },
      })

      await wrapper.find('[data-testid="undo-button"]').trigger('click')
      expect(store.elements).toHaveLength(0)
    })

    it('calls redo when redo button is clicked', async () => {
      const store = useElementsStore()
      store.addShape('rectangle')
      store.undo()

      const wrapper = mount(LeftSidebar, {
        props: { isCollapsed: false },
      })

      await wrapper.find('[data-testid="redo-button"]').trigger('click')
      expect(store.elements).toHaveLength(1)
    })

    it('shows confirmation before clearing all shapes', async () => {
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)
      const store = useElementsStore()
      store.addShape('rectangle')
      store.addShape('triangle')

      const wrapper = mount(LeftSidebar, {
        props: { isCollapsed: false },
      })

      await wrapper.find('[data-testid="clear-all-button"]').trigger('click')

      expect(confirmSpy).toHaveBeenCalled()
      expect(store.elements).toHaveLength(0)
    })

    it('does not clear shapes if confirmation is cancelled', async () => {
      vi.spyOn(window, 'confirm').mockReturnValue(false)
      const store = useElementsStore()
      store.addShape('rectangle')

      const wrapper = mount(LeftSidebar, {
        props: { isCollapsed: false },
      })

      await wrapper.find('[data-testid="clear-all-button"]').trigger('click')
      expect(store.elements).toHaveLength(1)
    })
  })

  describe('collapsed state', () => {
    it('applies collapsed width class when collapsed', () => {
      const wrapper = mount(LeftSidebar, {
        props: { isCollapsed: true },
      })

      const sidebar = wrapper.find('[data-testid="app-sidebar"]')
      expect(sidebar.classes()).toContain('w-14')
    })

    it('applies expanded width class when not collapsed', () => {
      const wrapper = mount(LeftSidebar, {
        props: { isCollapsed: false },
      })

      const sidebar = wrapper.find('[data-testid="app-sidebar"]')
      expect(sidebar.classes()).toContain('w-56')
    })

    it('hides group toggle when sidebar is collapsed', () => {
      const wrapper = mount(LeftSidebar, {
        props: { isCollapsed: true },
      })

      expect(
        wrapper.find('[data-testid="sidebar-group-toggle"]').exists()
      ).toBe(false)
    })

    it('shows group toggle when sidebar is expanded', () => {
      const wrapper = mount(LeftSidebar, {
        props: { isCollapsed: false },
      })

      expect(
        wrapper.find('[data-testid="sidebar-group-toggle"]').exists()
      ).toBe(true)
    })
  })

  describe('SidebarGroup collapse', () => {
    it('can collapse Shapes group by clicking toggle', async () => {
      const wrapper = mount(LeftSidebar, {
        props: { isCollapsed: false },
      })

      const groupToggle = wrapper.find('[data-testid="sidebar-group-toggle"]')
      await groupToggle.trigger('click')

      // Shape buttons should be hidden after collapsing the group
      const shapeButtons = wrapper.findAll('[data-testid="shape-button"]')
      expect(shapeButtons.every((btn) => !btn.isVisible())).toBe(true)
    })
  })
})
