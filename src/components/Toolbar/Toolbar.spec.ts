import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Toolbar from './Toolbar.vue'

const defaultProps = {
  hasCopiedShape: false,
  canUndo: false,
  canRedo: false,
}

describe('Toolbar', () => {
  describe('rendering', () => {
    it('renders clear all button', () => {
      const wrapper = mount(Toolbar, {
        props: defaultProps,
      })

      expect(wrapper.text()).toContain('Clear All')
    })

    it('applies correct styling classes', () => {
      const wrapper = mount(Toolbar, {
        props: defaultProps,
      })

      const toolbar = wrapper.find('[data-testid="toolbar-container"]')
      expect(toolbar.exists()).toBe(true)
    })

    it('renders undo and redo buttons', () => {
      const wrapper = mount(Toolbar, {
        props: defaultProps,
      })

      expect(wrapper.find('[data-testid="undo-button"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="redo-button"]').exists()).toBe(true)
    })

    it('renders paste button', () => {
      const wrapper = mount(Toolbar, {
        props: defaultProps,
      })

      expect(wrapper.find('[data-testid="paste-button"]').exists()).toBe(true)
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

  describe('paste button', () => {
    it('paste button is disabled when hasCopiedShape is false', () => {
      const wrapper = mount(Toolbar, {
        props: defaultProps,
      })

      const pasteButton = wrapper.find('[data-testid="paste-button"]')
      expect(pasteButton.attributes('disabled')).toBeDefined()
    })

    it('paste button is enabled when hasCopiedShape is true', () => {
      const wrapper = mount(Toolbar, {
        props: {
          ...defaultProps,
          hasCopiedShape: true,
        },
      })

      const pasteButton = wrapper.find('[data-testid="paste-button"]')
      expect(pasteButton.attributes('disabled')).toBeUndefined()
    })

    it('emits paste when paste button is clicked', async () => {
      const wrapper = mount(Toolbar, {
        props: {
          ...defaultProps,
          hasCopiedShape: true,
        },
      })

      const pasteButton = wrapper.find('[data-testid="paste-button"]')
      await pasteButton.trigger('click')

      expect(wrapper.emitted('paste')).toBeTruthy()
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
