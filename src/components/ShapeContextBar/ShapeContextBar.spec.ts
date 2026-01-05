import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ShapeContextBar from './ShapeContextBar.vue'

const defaultProps = {
  shapeWidth: 100,
  shapeY: 200,
}

describe('ShapeContextBar', () => {
  describe('rendering', () => {
    it('renders all action buttons', () => {
      const wrapper = mount(ShapeContextBar, {
        props: defaultProps,
      })

      expect(wrapper.find('[data-testid="context-copy-button"]').exists()).toBe(
        true
      )
      expect(
        wrapper.find('[data-testid="context-duplicate-button"]').exists()
      ).toBe(true)
      expect(
        wrapper.find('[data-testid="context-rotate-button"]').exists()
      ).toBe(true)
      expect(
        wrapper.find('[data-testid="context-delete-button"]').exists()
      ).toBe(true)
    })

    it('renders with correct container styling', () => {
      const wrapper = mount(ShapeContextBar, {
        props: defaultProps,
      })

      const container = wrapper.find('[data-testid="shape-context-bar"]')
      expect(container.exists()).toBe(true)
      expect(container.classes()).toContain('absolute')
      expect(container.classes()).toContain('flex')
    })

    it('has correct title attributes for accessibility', () => {
      const wrapper = mount(ShapeContextBar, {
        props: defaultProps,
      })

      expect(
        wrapper.find('[data-testid="context-copy-button"]').attributes('title')
      ).toBe('Copy')
      expect(
        wrapper
          .find('[data-testid="context-duplicate-button"]')
          .attributes('title')
      ).toBe('Duplicate')
      expect(
        wrapper
          .find('[data-testid="context-rotate-button"]')
          .attributes('title')
      ).toBe('Rotate 90°')
      expect(
        wrapper
          .find('[data-testid="context-delete-button"]')
          .attributes('title')
      ).toBe('Delete')
    })
  })

  describe('positioning', () => {
    it('positions above shape when shape is far from top', () => {
      const wrapper = mount(ShapeContextBar, {
        props: {
          shapeWidth: 100,
          shapeY: 200, // Far from top
        },
      })

      const container = wrapper.find('[data-testid="shape-context-bar"]')
      const style = container.attributes('style')

      expect(style).toContain('bottom:')
      expect(style).not.toContain('top:')
    })

    it('positions below shape when shape is near top', () => {
      const wrapper = mount(ShapeContextBar, {
        props: {
          shapeWidth: 100,
          shapeY: 20, // Near top, less than BAR_HEIGHT + TOP_OFFSET (48)
        },
      })

      const container = wrapper.find('[data-testid="shape-context-bar"]')
      const style = container.attributes('style')

      expect(style).toContain('top:')
      expect(style).not.toContain('bottom:')
    })

    it('centers horizontally', () => {
      const wrapper = mount(ShapeContextBar, {
        props: defaultProps,
      })

      const container = wrapper.find('[data-testid="shape-context-bar"]')
      const style = container.attributes('style')

      expect(style).toContain('left: 50%')
      expect(style).toContain('translateX(-50%)')
    })
  })

  describe('button events', () => {
    it('emits copy when copy button is clicked', async () => {
      const wrapper = mount(ShapeContextBar, {
        props: defaultProps,
      })

      await wrapper.find('[data-testid="context-copy-button"]').trigger('click')

      expect(wrapper.emitted('copy')).toBeTruthy()
      expect(wrapper.emitted('copy')?.length).toBe(1)
    })

    it('emits duplicate when duplicate button is clicked', async () => {
      const wrapper = mount(ShapeContextBar, {
        props: defaultProps,
      })

      await wrapper
        .find('[data-testid="context-duplicate-button"]')
        .trigger('click')

      expect(wrapper.emitted('duplicate')).toBeTruthy()
      expect(wrapper.emitted('duplicate')?.length).toBe(1)
    })

    it('emits rotate when rotate button is clicked', async () => {
      const wrapper = mount(ShapeContextBar, {
        props: defaultProps,
      })

      await wrapper
        .find('[data-testid="context-rotate-button"]')
        .trigger('click')

      expect(wrapper.emitted('rotate')).toBeTruthy()
      expect(wrapper.emitted('rotate')?.length).toBe(1)
    })

    it('emits delete when delete button is clicked', async () => {
      const wrapper = mount(ShapeContextBar, {
        props: defaultProps,
      })

      await wrapper
        .find('[data-testid="context-delete-button"]')
        .trigger('click')

      expect(wrapper.emitted('delete')).toBeTruthy()
      expect(wrapper.emitted('delete')?.length).toBe(1)
    })
  })

  describe('event propagation', () => {
    it('stops mousedown propagation to prevent deselection', async () => {
      const wrapper = mount(ShapeContextBar, {
        props: defaultProps,
      })

      const container = wrapper.find('[data-testid="shape-context-bar"]')
      const event = new MouseEvent('mousedown', { bubbles: true })
      const stopPropagationSpy = vi.spyOn(event, 'stopPropagation')

      container.element.dispatchEvent(event)

      expect(stopPropagationSpy).toHaveBeenCalled()
    })
  })

  describe('delete button styling', () => {
    it('has danger styling', () => {
      const wrapper = mount(ShapeContextBar, {
        props: defaultProps,
      })

      const deleteButton = wrapper.find('[data-testid="context-delete-button"]')

      expect(deleteButton.classes()).toContain('border-ma-danger')
      expect(deleteButton.classes()).toContain('bg-ma-danger')
      expect(deleteButton.classes()).toContain('text-white')
    })
  })
})
