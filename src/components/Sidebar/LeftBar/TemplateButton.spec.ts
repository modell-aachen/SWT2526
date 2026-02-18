import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import TemplateButton from './TemplateButton.vue'
import { useElementsStore } from '@/stores/elements/elements'
import type { Template } from '@/templates'

const mockTemplate: Template = {
  name: 'Test Template',
  description: 'A test template',
  snapshot: {
    version: 1,
    timestamp: 0,
    nextId: 5,
    elements: [
      {
        id: 'shape-1',
        type: 'shape',
        shapeType: 'rectangle',
        x: 100,
        y: 100,
        width: 100,
        height: 100,
        outline: '#000',
        fill: 'transparent',
        strokeWeight: 2,
        zIndex: 0,
        rotation: 0,
      },
    ],
  },
}

describe('TemplateButton', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('rendering', () => {
    it('renders the template name when not collapsed', () => {
      const wrapper = mount(TemplateButton, {
        props: { template: mockTemplate, collapsed: false },
      })
      expect(wrapper.text()).toContain('Test Template')
    })

    it('does not render the template name when collapsed', () => {
      const wrapper = mount(TemplateButton, {
        props: { template: mockTemplate, collapsed: true },
      })
      expect(wrapper.find('span').exists()).toBe(false)
    })

    it('renders with the correct data-testid', () => {
      const wrapper = mount(TemplateButton, {
        props: { template: mockTemplate, collapsed: false },
      })
      expect(
        wrapper.find('[data-testid="template-button-Test Template"]').exists()
      ).toBe(true)
    })

    it('sets the title attribute to the template name', () => {
      const wrapper = mount(TemplateButton, {
        props: { template: mockTemplate, collapsed: true },
      })
      const button = wrapper.find('button')
      expect(button.attributes('title')).toBe('Test Template')
    })
  })

  describe('interaction', () => {
    it('shows a confirm dialog when clicked', async () => {
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false)
      const wrapper = mount(TemplateButton, {
        props: { template: mockTemplate, collapsed: false },
      })

      await wrapper.find('button').trigger('click')

      expect(confirmSpy).toHaveBeenCalledWith(
        `Load template "Test Template"? This will replace the current canvas.`
      )
    })

    it('calls importSnapshot with the correct snapshot when confirmed', async () => {
      vi.spyOn(window, 'confirm').mockReturnValue(true)
      const store = useElementsStore()
      const importSpy = vi.spyOn(store, 'importSnapshot')

      const wrapper = mount(TemplateButton, {
        props: { template: mockTemplate, collapsed: false },
      })

      await wrapper.find('button').trigger('click')

      expect(importSpy).toHaveBeenCalledWith(mockTemplate.snapshot)
    })

    it('does NOT call importSnapshot when the confirm dialog is cancelled', async () => {
      vi.spyOn(window, 'confirm').mockReturnValue(false)
      const store = useElementsStore()
      const importSpy = vi.spyOn(store, 'importSnapshot')

      const wrapper = mount(TemplateButton, {
        props: { template: mockTemplate, collapsed: false },
      })

      await wrapper.find('button').trigger('click')

      expect(importSpy).not.toHaveBeenCalled()
    })
  })
})
