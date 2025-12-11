import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ShapeWrapper from './ShapeWrapper.vue'
import Rectangle from '../shapes/Rectangle/RectangleComponent.vue'
import Triangle from '../shapes/Triangle/TriangleComponent.vue'
import Trapezoid from '../shapes/Trapezoid/TrapezoidComponent.vue'

describe('ShapeWrapper', () => {
  beforeEach(() => {
    // Reset any module state between tests
    vi.clearAllMocks()
  })

  afterEach(() => {
    // Trigger mouseup to end any active drag/resize operations and clean up listeners
    document.dispatchEvent(new MouseEvent('mouseup'))
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders a wrapper div', () => {
      const wrapper = mount(ShapeWrapper, {
        props: {
          x: 100,
          y: 100,
          width: 100,
          height: 100,
          shapeType: 'rectangle',
        },
      })

      expect(wrapper.find('[data-testid="shape-wrapper"]').exists()).toBe(true)
    })

    it('applies correct positioning styles', () => {
      const wrapper = mount(ShapeWrapper, {
        props: {
          x: 150,
          y: 200,
          width: 120,
          height: 80,
          shapeType: 'rectangle',
        },
      })

      const wrapperDiv = wrapper.find('[data-testid="shape-wrapper"]')
      const style = wrapperDiv.attributes('style')

      expect(style).toContain('left: 150px')
      expect(style).toContain('top: 200px')
      expect(style).toContain('width: 120px')
      expect(style).toContain('height: 80px')
    })

    it('renders Rectangle component for rectangle type', () => {
      const wrapper = mount(ShapeWrapper, {
        props: {
          x: 100,
          y: 100,
          width: 100,
          height: 100,
          shapeType: 'rectangle',
        },
      })

      expect(wrapper.findComponent(Rectangle).exists()).toBe(true)
    })

    it('renders Triangle component for triangle type', () => {
      const wrapper = mount(ShapeWrapper, {
        props: {
          x: 100,
          y: 100,
          width: 100,
          height: 100,
          shapeType: 'triangle',
        },
      })

      expect(wrapper.findComponent(Triangle).exists()).toBe(true)
    })

    it('renders Trapezoid component for trapezoid type', () => {
      const wrapper = mount(ShapeWrapper, {
        props: {
          x: 100,
          y: 100,
          width: 100,
          height: 100,
          shapeType: 'trapezoid',
        },
      })

      expect(wrapper.findComponent(Trapezoid).exists()).toBe(true)
    })

    it('passes width and height to shape component', () => {
      const wrapper = mount(ShapeWrapper, {
        props: {
          x: 100,
          y: 100,
          width: 150,
          height: 200,
          shapeType: 'rectangle',
        },
      })

      const rectangle = wrapper.findComponent(Rectangle)
      expect(rectangle.props('width')).toBe(150)
      expect(rectangle.props('height')).toBe(200)
    })

    it('passes outline prop to shape component', () => {
      const wrapper = mount(ShapeWrapper, {
        props: {
          x: 100,
          y: 100,
          width: 100,
          height: 100,
          shapeType: 'rectangle',
          outline: '#ff0000',
        },
      })

      const rectangle = wrapper.findComponent(Rectangle)
      expect(rectangle.props('outline')).toBe('#ff0000')
    })

    it('passes fill prop to shape component', () => {
      const wrapper = mount(ShapeWrapper, {
        props: {
          x: 100,
          y: 100,
          width: 100,
          height: 100,
          shapeType: 'rectangle',
          fill: '#00ff00',
        },
      })

      const rectangle = wrapper.findComponent(Rectangle)
      expect(rectangle.props('fill')).toBe('#00ff00')
    })

    it('uses default outline when not provided', () => {
      const wrapper = mount(ShapeWrapper, {
        props: {
          x: 100,
          y: 100,
          width: 100,
          height: 100,
          shapeType: 'rectangle',
        },
      })

      const rectangle = wrapper.findComponent(Rectangle)
      expect(rectangle.props('outline')).toBe('var(--ma-text-01)')
    })

    it('uses default fill when not provided', () => {
      const wrapper = mount(ShapeWrapper, {
        props: {
          x: 100,
          y: 100,
          width: 100,
          height: 100,
          shapeType: 'rectangle',
        },
      })

      const rectangle = wrapper.findComponent(Rectangle)
      expect(rectangle.props('fill')).toBe('transparent')
    })
  })

  describe('selection state', () => {
    it('does not show selection border when not selected', () => {
      const wrapper = mount(ShapeWrapper, {
        props: {
          x: 100,
          y: 100,
          width: 100,
          height: 100,
          shapeType: 'rectangle',
          selected: false,
        },
      })

      expect(wrapper.find('[data-testid="selection-border"]').exists()).toBe(false)
    })

    it('shows selection border when selected', () => {
      const wrapper = mount(ShapeWrapper, {
        props: {
          x: 100,
          y: 100,
          width: 100,
          height: 100,
          shapeType: 'rectangle',
          selected: true,
        },
      })

      expect(wrapper.find('[data-testid="selection-border"]').exists()).toBe(true)
    })

    it('shows resize handles when selected', () => {
      const wrapper = mount(ShapeWrapper, {
        props: {
          x: 100,
          y: 100,
          width: 100,
          height: 100,
          shapeType: 'rectangle',
          selected: true,
        },
      })

      const handles = wrapper.findAll(
        '.bg-ma-primary-500.border.border-white.rounded-full'
      )
      expect(handles.length).toBe(8)
    })

    it('does not show resize handles when not selected', () => {
      const wrapper = mount(ShapeWrapper, {
        props: {
          x: 100,
          y: 100,
          width: 100,
          height: 100,
          shapeType: 'rectangle',
          selected: false,
        },
      })

      const handles = wrapper.findAll(
        '.bg-ma-primary-500.border.border-white.rounded-full'
      )
      expect(handles.length).toBe(0)
    })

    it('applies pointer cursor when not selected', () => {
      const wrapper = mount(ShapeWrapper, {
        props: {
          x: 100,
          y: 100,
          width: 100,
          height: 100,
          shapeType: 'rectangle',
          selected: false,
        },
      })

      expect(wrapper.find('.cursor-pointer').exists()).toBe(true)
    })

    it('applies move cursor when selected', () => {
      const wrapper = mount(ShapeWrapper, {
        props: {
          x: 100,
          y: 100,
          width: 100,
          height: 100,
          shapeType: 'rectangle',
          selected: true,
        },
      })

      expect(wrapper.find('.cursor-move').exists()).toBe(true)
    })
  })

  describe('resize handles', () => {
    it('creates 8 resize handles in correct positions', () => {
      const wrapper = mount(ShapeWrapper, {
        props: {
          x: 100,
          y: 100,
          width: 100,
          height: 100,
          shapeType: 'rectangle',
          selected: true,
        },
      })

      // Verify all 8 handles exist
      expect(wrapper.find('[data-testid="resize-handle-nw"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="resize-handle-n"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="resize-handle-ne"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="resize-handle-e"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="resize-handle-se"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="resize-handle-s"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="resize-handle-sw"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="resize-handle-w"]').exists()).toBe(true)
    })

    it('positions corner handles correctly', () => {
      const wrapper = mount(ShapeWrapper, {
        props: {
          x: 100,
          y: 100,
          width: 100,
          height: 100,
          shapeType: 'rectangle',
          selected: true,
        },
      })

      const nwHandle = wrapper.find('[data-testid="resize-handle-nw"]')
      expect(nwHandle.attributes('style')).toContain('left: 0px')
      expect(nwHandle.attributes('style')).toContain('top: 0px')

      const seHandle = wrapper.find('[data-testid="resize-handle-se"]')
      expect(seHandle.attributes('style')).toContain('left: 100px')
      expect(seHandle.attributes('style')).toContain('top: 100px')
    })

    it('positions edge handles at midpoints', () => {
      const wrapper = mount(ShapeWrapper, {
        props: {
          x: 100,
          y: 100,
          width: 100,
          height: 100,
          shapeType: 'rectangle',
          selected: true,
        },
      })

      const nHandle = wrapper.find('[data-testid="resize-handle-n"]')
      expect(nHandle.attributes('style')).toContain('left: 50px')
      expect(nHandle.attributes('style')).toContain('top: 0px')

      const eHandle = wrapper.find('[data-testid="resize-handle-e"]')
      expect(eHandle.attributes('style')).toContain('left: 100px')
      expect(eHandle.attributes('style')).toContain('top: 50px')
    })
  })
})
