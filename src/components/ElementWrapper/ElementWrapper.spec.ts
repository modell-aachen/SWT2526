import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ElementWrapper from './ElementWrapper.vue'
import type { ShapeElement, IconElement } from '@/types/Element'

vi.mock('@/composables/useDraggable', () => ({
  useDraggable: () => ({ startDrag: vi.fn() }),
}))
vi.mock('@/composables/useResizable', () => ({
  useResizable: () => ({ startResize: vi.fn() }),
}))

const createShapeElement = (overrides?: Partial<ShapeElement>): ShapeElement => ({
  id: '1',
  type: 'shape',
  shapeType: 'rectangle',
  x: 100,
  y: 100,
  width: 100,
  height: 100,
  rotation: 0,
  zIndex: 1,
  outline: '#000',
  fill: 'transparent',
  strokeWeight: 5,
  ...overrides,
})

const createIconElement = (overrides?: Partial<IconElement>): IconElement => ({
  id: '1',
  type: 'icon',
  x: 0,
  y: 0,
  width: 24,
  height: 24,
  rotation: 0,
  zIndex: 1,
  iconType: 'star',
  color: '#000',
  strokeWeight: 2,
  ...overrides,
})

describe('ElementWrapper', () => {
  describe('wrapper styles', () => {
    it('applies correct positioning and rotation', () => {
      const wrapper = mount(ElementWrapper, {
        props: {
          element: createShapeElement({ x: 100, y: 200, width: 150, height: 75, rotation: 45 }),
          selected: false,
        },
      })

      const style = wrapper.find('.absolute').attributes('style')
      expect(style).toContain('left: 100px')
      expect(style).toContain('top: 200px')
      expect(style).toContain('width: 150px')
      expect(style).toContain('height: 75px')
      expect(style).toContain('rotate(45deg)')
    })
  })

  describe('selection UI', () => {
    it.each([
      [true, true],
      [false, false],
    ])('when selected=%s, shows selection UI=%s', (selected, shouldShow) => {
      const wrapper = mount(ElementWrapper, {
        props: { element: createShapeElement(), selected },
      })

      expect(wrapper.find('.border-ma-primary-500').exists()).toBe(shouldShow)
    })
  })

  describe('resize handles', () => {
    it.each([
      ['icon', createIconElement(), 4],
      ['shape', createShapeElement(), 8],
    ])('%s elements show %i handles', (_, element, expectedCount) => {
      const wrapper = mount(ElementWrapper, {
        props: { element, selected: true },
      })

      expect(wrapper.findAll('.bg-ma-primary-500').length).toBe(expectedCount)
    })
  })

  describe('events', () => {
    it('emits select on mousedown', async () => {
      const wrapper = mount(ElementWrapper, {
        props: { element: createShapeElement(), selected: false },
      })

      await wrapper.find('.absolute').trigger('mousedown')
      expect(wrapper.emitted('select')).toHaveLength(1)
    })
  })
})
