import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Toolbar from './Toolbar.vue'

describe('Toolbar', () => {
  describe('rendering', () => {
    it('renders all shape add buttons', () => {
      const wrapper = mount(Toolbar, {
        props: {
          hasSelectedShape: false,
        },
      })

      expect(wrapper.text()).toContain('Add Rectangle')
      expect(wrapper.text()).toContain('Add Triangle')
      expect(wrapper.text()).toContain('Add Trapezoid')
    })

    it('renders delete and clear buttons', () => {
      const wrapper = mount(Toolbar, {
        props: {
          hasSelectedShape: false,
        },
      })

      expect(wrapper.text()).toContain('Delete Selected')
      expect(wrapper.text()).toContain('Clear All')
    })

    it('applies correct styling classes', () => {
      const wrapper = mount(Toolbar, {
        props: {
          hasSelectedShape: false,
        },
      })

      const toolbar = wrapper.find('.flex.gap-2.p-3.bg-gray-100')
      expect(toolbar.exists()).toBe(true)
    })

    it('renders separator between shape and action buttons', () => {
      const wrapper = mount(Toolbar, {
        props: {
          hasSelectedShape: false,
        },
      })

      const separator = wrapper.find('.w-px.bg-gray-300')
      expect(separator.exists()).toBe(true)
    })
  })

  describe('add shape buttons', () => {
    it('emits add-shape with rectangle when clicking Add Rectangle', async () => {
      const wrapper = mount(Toolbar, {
        props: {
          hasSelectedShape: false,
        },
      })

      await wrapper.findAll('button')[0]?.trigger('click')

      expect(wrapper.emitted('add-shape')).toBeTruthy()
      expect(wrapper.emitted('add-shape')?.[0]).toEqual(['rectangle'])
    })

    it('emits add-shape with triangle when clicking Add Triangle', async () => {
      const wrapper = mount(Toolbar, {
        props: {
          hasSelectedShape: false,
        },
      })

      await wrapper.findAll('button')[1]?.trigger('click')

      expect(wrapper.emitted('add-shape')).toBeTruthy()
      expect(wrapper.emitted('add-shape')?.[0]).toEqual(['triangle'])
    })

    it('emits add-shape with trapezoid when clicking Add Trapezoid', async () => {
      const wrapper = mount(Toolbar, {
        props: {
          hasSelectedShape: false,
        },
      })

      await wrapper.findAll('button')[2]?.trigger('click')

      expect(wrapper.emitted('add-shape')).toBeTruthy()
      expect(wrapper.emitted('add-shape')?.[0]).toEqual(['trapezoid'])
    })
  })

  describe('delete button', () => {
    it('is disabled when hasSelectedShape is false', () => {
      const wrapper = mount(Toolbar, {
        props: {
          hasSelectedShape: false,
        },
      })

      const deleteButton = wrapper
        .findAll('button')
        .find((btn) => btn.text() === 'Delete Selected')

      expect(deleteButton?.attributes('disabled')).toBeDefined()
    })

    it('is enabled when hasSelectedShape is true', () => {
      const wrapper = mount(Toolbar, {
        props: {
          hasSelectedShape: true,
        },
      })

      const deleteButton = wrapper
        .findAll('button')
        .find((btn) => btn.text() === 'Delete Selected')

      expect(deleteButton?.attributes('disabled')).toBeUndefined()
    })

    it('emits delete-selected when clicked', async () => {
      const wrapper = mount(Toolbar, {
        props: {
          hasSelectedShape: true,
        },
      })

      const deleteButton = wrapper
        .findAll('button')
        .find((btn) => btn.text() === 'Delete Selected')
      await deleteButton?.trigger('click')

      expect(wrapper.emitted('delete-selected')).toBeTruthy()
    })

    it('has correct red styling', () => {
      const wrapper = mount(Toolbar, {
        props: {
          hasSelectedShape: true,
        },
      })

      const deleteButton = wrapper
        .findAll('button')
        .find((btn) => btn.text() === 'Delete Selected')

      expect(deleteButton?.classes()).toContain('border-red-400')
      expect(deleteButton?.classes()).toContain('bg-red-50')
      expect(deleteButton?.classes()).toContain('text-red-800')
    })
  })

  describe('clear all button', () => {
    it('emits clear-all when clicked', async () => {
      const wrapper = mount(Toolbar, {
        props: {
          hasSelectedShape: false,
        },
      })

      const clearButton = wrapper
        .findAll('button')
        .find((btn) => btn.text() === 'Clear All')
      await clearButton?.trigger('click')

      expect(wrapper.emitted('clear-all')).toBeTruthy()
    })

    it('has correct styling', () => {
      const wrapper = mount(Toolbar, {
        props: {
          hasSelectedShape: false,
        },
      })

      const clearButton = wrapper
        .findAll('button')
        .find((btn) => btn.text() === 'Clear All')

      expect(clearButton?.classes()).toContain('border-gray-300')
      expect(clearButton?.classes()).toContain('bg-white')
    })
  })

  describe('button interactions', () => {
    it('applies hover classes to all buttons', () => {
      const wrapper = mount(Toolbar, {
        props: {
          hasSelectedShape: false,
        },
      })

      const buttons = wrapper.findAll('button')

      buttons.forEach((button) => {
        expect(button.classes()).toContain('transition-all')
      })
    })
  })
})
