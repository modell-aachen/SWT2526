import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Toolbar from './Toolbar.vue'

const defaultProps = {
  hasSelectedShape: false,
  canUndo: false,
  canRedo: false,
}

describe('Toolbar', () => {
  describe('rendering', () => {
    it('renders all shape add buttons', () => {
      const wrapper = mount(Toolbar, {
        props: defaultProps,
      })

      expect(wrapper.text()).toContain('Add Rectangle')
      expect(wrapper.text()).toContain('Add Triangle')
      expect(wrapper.text()).toContain('Add Trapezoid')
    })

    it('renders delete and clear buttons', () => {
      const wrapper = mount(Toolbar, {
        props: defaultProps,
      })

      expect(wrapper.text()).toContain('Delete Selected')
      expect(wrapper.text()).toContain('Clear All')
    })

    it('applies correct styling classes', () => {
      const wrapper = mount(Toolbar, {
        props: defaultProps,
      })

      const toolbar = wrapper.find('[data-testid="toolbar-container"]')
      expect(toolbar.exists()).toBe(true)
    })

    it('renders separator between shape and action buttons', () => {
      const wrapper = mount(Toolbar, {
        props: defaultProps,
      })

      const separator = wrapper.find('[data-testid="toolbar-separator"]')
      expect(separator.exists()).toBe(true)
    })

    it('renders undo and redo buttons', () => {
      const wrapper = mount(Toolbar, {
        props: defaultProps,
      })

      expect(wrapper.find('[data-testid="undo-button"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="redo-button"]').exists()).toBe(true)
    })
  })

  describe('add shape buttons', () => {
    it('emits add-shape with rectangle when clicking Add Rectangle', async () => {
      const wrapper = mount(Toolbar, {
        props: defaultProps,
      })

      const rectangleButton = wrapper.find(
        '[data-testid="add-rectangle-button"]'
      )
      await rectangleButton.trigger('click')

      expect(wrapper.emitted('add-shape')).toBeTruthy()
      expect(wrapper.emitted('add-shape')?.[0]).toEqual(['rectangle'])
    })

    it('emits add-shape with triangle when clicking Add Triangle', async () => {
      const wrapper = mount(Toolbar, {
        props: defaultProps,
      })

      const triangleButton = wrapper.find('[data-testid="add-triangle-button"]')
      await triangleButton.trigger('click')

      expect(wrapper.emitted('add-shape')).toBeTruthy()
      expect(wrapper.emitted('add-shape')?.[0]).toEqual(['triangle'])
    })

    it('emits add-shape with trapezoid when clicking Add Trapezoid', async () => {
      const wrapper = mount(Toolbar, {
        props: defaultProps,
      })

      const trapezoidButton = wrapper.find(
        '[data-testid="add-trapezoid-button"]'
      )
      await trapezoidButton.trigger('click')

      expect(wrapper.emitted('add-shape')).toBeTruthy()
      expect(wrapper.emitted('add-shape')?.[0]).toEqual(['trapezoid'])
    })
  })

  describe('delete button', () => {
    it('is disabled when hasSelectedShape is false', () => {
      const wrapper = mount(Toolbar, {
        props: defaultProps,
      })

      const deleteButton = wrapper.find('[data-testid="delete-button"]')

      expect(deleteButton.attributes('disabled')).toBeDefined()
    })

    it('is enabled when hasSelectedShape is true', () => {
      const wrapper = mount(Toolbar, {
        props: {
          ...defaultProps,
          hasSelectedShape: true,
        },
      })

      const deleteButton = wrapper.find('[data-testid="delete-button"]')

      expect(deleteButton.attributes('disabled')).toBeUndefined()
    })

    it('emits delete-selected when clicked', async () => {
      const wrapper = mount(Toolbar, {
        props: {
          ...defaultProps,
          hasSelectedShape: true,
        },
      })

      const deleteButton = wrapper.find('[data-testid="delete-button"]')
      await deleteButton.trigger('click')

      expect(wrapper.emitted('delete-selected')).toBeTruthy()
    })

    it('has correct red styling', () => {
      const wrapper = mount(Toolbar, {
        props: {
          ...defaultProps,
          hasSelectedShape: true,
        },
      })

      const deleteButton = wrapper.find('[data-testid="delete-button"]')

      expect(deleteButton.classes()).toContain('border-ma-danger')
      expect(deleteButton.classes()).toContain('bg-ma-danger')
      expect(deleteButton.classes()).toContain('text-white')
    })
  })

  describe('clear all button', () => {
    it('emits clear-all when clicked', async () => {
      const wrapper = mount(Toolbar, {
        props: defaultProps,
      })

      const clearButton = wrapper.find('[data-testid="clear-all-button"]')
      await clearButton.trigger('click')

      expect(wrapper.emitted('clear-all')).toBeTruthy()
    })

    it('has correct styling', () => {
      const wrapper = mount(Toolbar, {
        props: defaultProps,
      })

      const clearButton = wrapper.find('[data-testid="clear-all-button"]')

      expect(clearButton.classes()).toContain('border-ma-grey-500')
      expect(clearButton.classes()).toContain('bg-ma-grey-500')
    })
  })

  describe('undo/redo buttons', () => {
    it('undo button is disabled when canUndo is false', () => {
      const wrapper = mount(Toolbar, {
        props: defaultProps,
      })

      const undoButton = wrapper.find('[data-testid="undo-button"]')
      expect(undoButton.attributes('disabled')).toBeDefined()
    })

    it('undo button is enabled when canUndo is true', () => {
      const wrapper = mount(Toolbar, {
        props: {
          ...defaultProps,
          canUndo: true,
        },
      })

      const undoButton = wrapper.find('[data-testid="undo-button"]')
      expect(undoButton.attributes('disabled')).toBeUndefined()
    })

    it('redo button is disabled when canRedo is false', () => {
      const wrapper = mount(Toolbar, {
        props: defaultProps,
      })

      const redoButton = wrapper.find('[data-testid="redo-button"]')
      expect(redoButton.attributes('disabled')).toBeDefined()
    })

    it('redo button is enabled when canRedo is true', () => {
      const wrapper = mount(Toolbar, {
        props: {
          ...defaultProps,
          canRedo: true,
        },
      })

      const redoButton = wrapper.find('[data-testid="redo-button"]')
      expect(redoButton.attributes('disabled')).toBeUndefined()
    })

    it('emits undo when undo button is clicked', async () => {
      const wrapper = mount(Toolbar, {
        props: {
          ...defaultProps,
          canUndo: true,
        },
      })

      const undoButton = wrapper.find('[data-testid="undo-button"]')
      await undoButton.trigger('click')

      expect(wrapper.emitted('undo')).toBeTruthy()
    })

    it('emits redo when redo button is clicked', async () => {
      const wrapper = mount(Toolbar, {
        props: {
          ...defaultProps,
          canRedo: true,
        },
      })

      const redoButton = wrapper.find('[data-testid="redo-button"]')
      await redoButton.trigger('click')

      expect(wrapper.emitted('redo')).toBeTruthy()
    })
  })

  describe('button interactions', () => {
    it('applies hover classes to all buttons', () => {
      const wrapper = mount(Toolbar, {
        props: defaultProps,
      })

      const buttons = wrapper.findAll('button')

      buttons.forEach((button) => {
        expect(button.classes()).toContain('transition-all')
      })
    })
  })
})
