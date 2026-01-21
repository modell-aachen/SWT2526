import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import GridCanvas from './GridCanvas.vue'

describe('GridCanvas', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })
  describe('rendering', () => {
    it('renders the canvas container', () => {
      const wrapper = mount(GridCanvas)

      const canvas = wrapper.find('[data-testid="canvas-container"]')
      expect(canvas.exists()).toBe(true)
    })

    it('applies correct styling classes', () => {
      const wrapper = mount(GridCanvas)

      const canvas = wrapper.find('[data-testid="canvas-container"]')
      expect(canvas.classes()).toContain('flex-1')
      expect(canvas.classes()).toContain('relative')
      expect(canvas.classes()).toContain('bg-bg-maincontent')
      expect(canvas.classes()).toContain('overflow-auto')
      expect(canvas.classes()).toContain('outline-none')
    })

    it('has tabindex for keyboard focus', () => {
      const wrapper = mount(GridCanvas)

      const canvas = wrapper.find('[data-testid="canvas-container"]')
      expect(canvas.attributes('tabindex')).toBe('0')
    })

    it('renders grid pattern SVG', () => {
      const wrapper = mount(GridCanvas)

      const svg = wrapper.find('[data-testid="grid-svg"]')
      expect(svg.exists()).toBe(true)
    })

    it('SVG has correct structure', () => {
      const wrapper = mount(GridCanvas)

      const svg = wrapper.find('[data-testid="grid-svg"]')
      expect(svg.classes()).toContain('absolute')
      expect(svg.classes()).toContain('pointer-events-none')
      expect(svg.classes()).toContain('z-0')
    })

    it('grid pattern is defined in SVG defs', () => {
      const wrapper = mount(GridCanvas)

      const pattern = wrapper.find('pattern#grid')
      expect(pattern.exists()).toBe(true)
    })

    it('grid pattern has correct dimensions', () => {
      const wrapper = mount(GridCanvas)

      const pattern = wrapper.find('pattern#grid')
      expect(pattern.attributes('width')).toBe('20')
      expect(pattern.attributes('height')).toBe('20')
      expect(pattern.attributes('patternUnits')).toBe('userSpaceOnUse')
    })

    it('grid pattern path has correct attributes', () => {
      const wrapper = mount(GridCanvas)

      const path = wrapper.find('[data-testid="grid-pattern-path"]')
      expect(path.attributes('d')).toBe('M 20 0 L 0 0 0 20')
      expect(path.attributes('fill')).toBe('none')
      expect(path.attributes('stroke')).toBe('currentColor')
      expect(path.attributes('stroke-width')).toBe('0.5')
    })

    it('grid rect covers entire canvas', () => {
      const wrapper = mount(GridCanvas)

      const rect = wrapper.find('rect')
      expect(rect.attributes('width')).toBe('100%')
      expect(rect.attributes('height')).toBe('100%')
      expect(rect.attributes('fill')).toBe('url(#grid)')
    })
  })

  describe('slot content', () => {
    it('renders slot content', () => {
      const wrapper = mount(GridCanvas, {
        slots: {
          default: '<div class="test-content">Test Content</div>',
        },
      })

      expect(wrapper.find('.test-content').exists()).toBe(true)
      expect(wrapper.text()).toContain('Test Content')
    })

    it('renders multiple slot items', () => {
      const wrapper = mount(GridCanvas, {
        slots: {
          default: `
            <div class="item-1">Item 1</div>
            <div class="item-2">Item 2</div>
            <div class="item-3">Item 3</div>
          `,
        },
      })

      expect(wrapper.find('.item-1').exists()).toBe(true)
      expect(wrapper.find('.item-2').exists()).toBe(true)
      expect(wrapper.find('.item-3').exists()).toBe(true)
    })

    it('renders overlay slot content', () => {
      const wrapper = mount(GridCanvas, {
        slots: {
          overlay: '<div class="overlay-content">Overlay</div>',
        },
      })

      expect(wrapper.find('.overlay-content').exists()).toBe(true)
      expect(wrapper.text()).toContain('Overlay')
    })
  })

  describe('canvas click event', () => {
    it('emits canvas-click when clicking on canvas directly', async () => {
      const wrapper = mount(GridCanvas)
      const canvas = wrapper.find('[data-testid="canvas-container"]')

      await canvas.trigger('mousedown')

      expect(wrapper.emitted('canvas-click')).toBeTruthy()
    })

    it('emits canvas-click when clicking on grid-pattern', async () => {
      const wrapper = mount(GridCanvas, {
        slots: {
          default: '<div class="grid-pattern">Grid</div>',
        },
      })

      const gridPattern = wrapper.find('.grid-pattern')
      await gridPattern.trigger('mousedown')

      expect(wrapper.emitted('canvas-click')).toBeTruthy()
    })

    it('does not emit canvas-click when clicking on child elements', async () => {
      const wrapper = mount(GridCanvas, {
        slots: {
          default: '<div class="child-element">Child</div>',
        },
      })

      const child = wrapper.find('.child-element')
      await child.trigger('mousedown')

      expect(wrapper.emitted('canvas-click')).toBeFalsy()
    })

    it('mousedown event stops propagation for non-canvas elements', async () => {
      const wrapper = mount(GridCanvas, {
        slots: {
          default: '<button class="test-button">Button</button>',
        },
      })

      const button = wrapper.find('.test-button')
      await button.trigger('mousedown')

      // Canvas-click should not be emitted for child elements
      expect(wrapper.emitted('canvas-click')).toBeFalsy()
    })
  })

  describe('keyboard events', () => {
    it('emits delete-selected on Delete key', async () => {
      const wrapper = mount(GridCanvas)
      const canvas = wrapper.find('.flex-1.relative.bg-bg-maincontent')

      await canvas.trigger('keydown.delete')

      expect(wrapper.emitted('delete-selected')).toBeTruthy()
    })

    it('emits delete-selected on Backspace key', async () => {
      const wrapper = mount(GridCanvas)
      const canvas = wrapper.find('.flex-1.relative.bg-bg-maincontent')

      await canvas.trigger('keydown.backspace')

      expect(wrapper.emitted('delete-selected')).toBeTruthy()
    })

    it('emits delete-selected only once per key press', async () => {
      const wrapper = mount(GridCanvas)
      const canvas = wrapper.find('.flex-1.relative.bg-bg-maincontent')

      await canvas.trigger('keydown.delete')

      expect(wrapper.emitted('delete-selected')).toHaveLength(1)
    })

    it('emits copy-selected on Ctrl+C', async () => {
      const wrapper = mount(GridCanvas)
      const canvas = wrapper.find('[data-testid="canvas-container"]')

      await canvas.trigger('keydown', { key: 'c', ctrlKey: true })

      expect(wrapper.emitted('copy-selected')).toBeTruthy()
    })

    it('emits paste on Ctrl+V', async () => {
      const wrapper = mount(GridCanvas)
      const canvas = wrapper.find('[data-testid="canvas-container"]')

      await canvas.trigger('keydown', { key: 'v', ctrlKey: true })

      expect(wrapper.emitted('paste')).toBeTruthy()
    })

    it('emits duplicate on Ctrl+D', async () => {
      const wrapper = mount(GridCanvas)
      const canvas = wrapper.find('[data-testid="canvas-container"]')

      await canvas.trigger('keydown', { key: 'd', ctrlKey: true })

      expect(wrapper.emitted('duplicate')).toBeTruthy()
    })
  })

  describe('accessibility', () => {
    it('canvas is focusable for keyboard navigation', () => {
      const wrapper = mount(GridCanvas)
      const canvas = wrapper.find('.flex-1.relative.bg-bg-maincontent')

      expect(canvas.attributes('tabindex')).toBe('0')
    })

    it('has outline-none for custom focus styling', () => {
      const wrapper = mount(GridCanvas)
      const canvas = wrapper.find('.flex-1.relative.bg-bg-maincontent')

      expect(canvas.classes()).toContain('outline-none')
    })
  })
})
