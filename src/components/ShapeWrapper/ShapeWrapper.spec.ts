import { describe, it, expect, beforeEach, vi } from 'vitest'
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

      expect(wrapper.find('.absolute.select-none').exists()).toBe(true)
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

      const wrapperDiv = wrapper.find('.absolute.select-none')
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
      expect(rectangle.props('outline')).toBe('#000')
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

      expect(wrapper.find('.border-blue-500').exists()).toBe(false)
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

      expect(wrapper.find('.border-blue-500').exists()).toBe(true)
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
        '.bg-blue-500.border.border-white.rounded-full'
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
        '.bg-blue-500.border.border-white.rounded-full'
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

      const handles = wrapper.findAll(
        '.bg-blue-500.border.border-white.rounded-full'
      )
      expect(handles.length).toBe(8)

      // Verify cursor classes for each handle position
      expect(wrapper.find('.cursor-nw-resize').exists()).toBe(true)
      expect(wrapper.find('.cursor-n-resize').exists()).toBe(true)
      expect(wrapper.find('.cursor-ne-resize').exists()).toBe(true)
      expect(wrapper.find('.cursor-e-resize').exists()).toBe(true)
      expect(wrapper.find('.cursor-se-resize').exists()).toBe(true)
      expect(wrapper.find('.cursor-s-resize').exists()).toBe(true)
      expect(wrapper.find('.cursor-sw-resize').exists()).toBe(true)
      expect(wrapper.find('.cursor-w-resize').exists()).toBe(true)
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

      const nwHandle = wrapper.find('.cursor-nw-resize')
      expect(nwHandle.attributes('style')).toContain('left: 0px')
      expect(nwHandle.attributes('style')).toContain('top: 0px')

      const seHandle = wrapper.find('.cursor-se-resize')
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

      const nHandle = wrapper.find('.cursor-n-resize')
      expect(nHandle.attributes('style')).toContain('left: 50px')
      expect(nHandle.attributes('style')).toContain('top: 0px')

      const eHandle = wrapper.find('.cursor-e-resize')
      expect(eHandle.attributes('style')).toContain('left: 100px')
      expect(eHandle.attributes('style')).toContain('top: 50px')
    })
  })

  describe('click event', () => {
    it('emits click event when mousedown on wrapper', async () => {
      const wrapper = mount(ShapeWrapper, {
        props: {
          x: 100,
          y: 100,
          width: 100,
          height: 100,
          shapeType: 'rectangle',
        },
      })

      const wrapperDiv = wrapper.find('.absolute.select-none')
      await wrapperDiv.trigger('mousedown')

      expect(wrapper.emitted('click')).toBeTruthy()
    })

    it('stops propagation on mousedown', async () => {
      const wrapper = mount(ShapeWrapper, {
        props: {
          x: 100,
          y: 100,
          width: 100,
          height: 100,
          shapeType: 'rectangle',
        },
      })

      const wrapperDiv = wrapper.find('.absolute.select-none')
      const event = new MouseEvent('mousedown')
      const stopPropSpy = vi.spyOn(event, 'stopPropagation')

      await wrapperDiv.element.dispatchEvent(event)

      expect(stopPropSpy).toHaveBeenCalled()
    })
  })

  describe('drag functionality', () => {
    it('emits dragStart when mousedown on wrapper', async () => {
      const wrapper = mount(ShapeWrapper, {
        props: {
          x: 100,
          y: 100,
          width: 100,
          height: 100,
          shapeType: 'rectangle',
        },
      })

      const wrapperDiv = wrapper.find('.absolute.select-none')
      await wrapperDiv.trigger('mousedown')

      expect(wrapper.emitted('dragStart')).toBeTruthy()
    })

    it('emits drag event with delta when dragging', async () => {
      const wrapper = mount(ShapeWrapper, {
        props: {
          x: 100,
          y: 100,
          width: 100,
          height: 100,
          shapeType: 'rectangle',
        },
      })

      const wrapperDiv = wrapper.find('.absolute.select-none')

      // Start drag
      await wrapperDiv.trigger('mousedown', { clientX: 100, clientY: 100 })

      // Simulate mouse move
      document.dispatchEvent(
        new MouseEvent('mousemove', { clientX: 125, clientY: 135 })
      )

      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('drag')).toBeTruthy()
      expect(wrapper.emitted('drag')?.[0]).toEqual([25, 35])
    })

    it('emits dragEnd when mouse is released', async () => {
      const wrapper = mount(ShapeWrapper, {
        props: {
          x: 100,
          y: 100,
          width: 100,
          height: 100,
          shapeType: 'rectangle',
        },
      })

      const wrapperDiv = wrapper.find('.absolute.select-none')

      // Start drag
      await wrapperDiv.trigger('mousedown', { clientX: 100, clientY: 100 })

      // Move mouse
      document.dispatchEvent(
        new MouseEvent('mousemove', { clientX: 110, clientY: 110 })
      )

      // Release mouse
      document.dispatchEvent(new MouseEvent('mouseup'))

      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('dragEnd')).toBeTruthy()
    })
  })

  describe('resize functionality', () => {
    it('emits resizeStart when mousedown on resize handle', async () => {
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

      const seHandle = wrapper.find('.cursor-se-resize')
      await seHandle.trigger('mousedown', { clientX: 200, clientY: 200 })

      expect(wrapper.emitted('resizeStart')).toBeTruthy()
      expect(wrapper.emitted('resizeStart')?.[0]?.[0]).toBe('se')
    })

    it('emits resize event with handle and delta when resizing', async () => {
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

      const seHandle = wrapper.find('.cursor-se-resize')

      // Start resize
      await seHandle.trigger('mousedown', { clientX: 200, clientY: 200 })

      // Simulate mouse move
      document.dispatchEvent(
        new MouseEvent('mousemove', { clientX: 220, clientY: 230 })
      )

      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('resize')).toBeTruthy()
      expect(wrapper.emitted('resize')?.[0]).toEqual(['se', 20, 30])
    })

    it('emits resizeEnd when resize is complete', async () => {
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

      const seHandle = wrapper.find('.cursor-se-resize')

      // Start resize
      await seHandle.trigger('mousedown', { clientX: 200, clientY: 200 })

      // Move mouse
      document.dispatchEvent(
        new MouseEvent('mousemove', { clientX: 210, clientY: 210 })
      )

      // Release mouse
      document.dispatchEvent(new MouseEvent('mouseup'))

      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('resizeEnd')).toBeTruthy()
    })

    it('stops propagation on resize handle mousedown', async () => {
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

      const seHandle = wrapper.find('.cursor-se-resize')
      const event = new MouseEvent('mousedown')
      const stopPropSpy = vi.spyOn(event, 'stopPropagation')

      await seHandle.element.dispatchEvent(event)

      expect(stopPropSpy).toHaveBeenCalled()
    })
  })
})
