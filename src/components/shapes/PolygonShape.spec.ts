import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PolygonShape from './PolygonShape.vue'

describe('PolygonShape', () => {
  describe('rendering', () => {
    it('renders an SVG element', () => {
      const wrapper = mount(PolygonShape, {
        props: {
          shapeType: 'rectangle',
          width: 100,
          height: 100,
        },
      })

      expect(wrapper.find('svg').exists()).toBe(true)
    })

    it('applies width and height props to SVG', () => {
      const wrapper = mount(PolygonShape, {
        props: {
          shapeType: 'rectangle',
          width: 150,
          height: 200,
        },
      })

      const svg = wrapper.find('svg')
      expect(svg.attributes('width')).toBe('150')
      expect(svg.attributes('height')).toBe('200')
    })

    it('maintains viewBox of 0 0 100 100', () => {
      const wrapper = mount(PolygonShape, {
        props: {
          shapeType: 'rectangle',
          width: 150,
          height: 200,
        },
      })

      const svg = wrapper.find('svg')
      expect(svg.attributes('viewBox')).toBe('0 0 100 100')
    })
  })

  describe('data-testid attributes', () => {
    it('sets correct data-testid for rectangle', () => {
      const wrapper = mount(PolygonShape, {
        props: {
          shapeType: 'rectangle',
          width: 100,
          height: 100,
        },
      })

      expect(wrapper.find('[data-testid="rectangle-shape"]').exists()).toBe(
        true
      )
      expect(wrapper.find('[data-testid="rectangle-polygon"]').exists()).toBe(
        true
      )
    })

    it('sets correct data-testid for triangle', () => {
      const wrapper = mount(PolygonShape, {
        props: {
          shapeType: 'triangle',
          width: 100,
          height: 100,
        },
      })

      expect(wrapper.find('[data-testid="triangle-shape"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="triangle-polygon"]').exists()).toBe(
        true
      )
    })

    it('sets correct data-testid for trapezoid', () => {
      const wrapper = mount(PolygonShape, {
        props: {
          shapeType: 'trapezoid',
          width: 100,
          height: 100,
        },
      })

      expect(wrapper.find('[data-testid="trapezoid-shape"]').exists()).toBe(
        true
      )
      expect(wrapper.find('[data-testid="trapezoid-polygon"]').exists()).toBe(
        true
      )
    })
  })

  describe('styling props', () => {
    it('applies outline prop to polygon stroke', () => {
      const wrapper = mount(PolygonShape, {
        props: {
          shapeType: 'rectangle',
          width: 100,
          height: 100,
          outline: '#ff0000',
        },
      })

      const polygon = wrapper.find('polygon')
      expect(polygon.attributes('stroke')).toBe('#ff0000')
    })

    it('applies fill prop to polygon', () => {
      const wrapper = mount(PolygonShape, {
        props: {
          shapeType: 'rectangle',
          width: 100,
          height: 100,
          fill: '#00ff00',
        },
      })

      const polygon = wrapper.find('polygon')
      expect(polygon.attributes('fill')).toBe('#00ff00')
    })

    it('uses default outline color when not provided', () => {
      const wrapper = mount(PolygonShape, {
        props: {
          shapeType: 'rectangle',
          width: 100,
          height: 100,
        },
      })

      const polygon = wrapper.find('polygon')
      expect(polygon.attributes('stroke')).toBe('#000')
    })

    it('uses default transparent fill when not provided', () => {
      const wrapper = mount(PolygonShape, {
        props: {
          shapeType: 'rectangle',
          width: 100,
          height: 100,
        },
      })

      const polygon = wrapper.find('polygon')
      expect(polygon.attributes('fill')).toBe('transparent')
    })
  })

  describe('shape points', () => {
    it('renders polygon with correct rectangle points', () => {
      const wrapper = mount(PolygonShape, {
        props: {
          shapeType: 'rectangle',
          width: 100,
          height: 100,
        },
      })

      const polygon = wrapper.find('polygon')
      expect(polygon.attributes('points')).toBe('5,5 95,5 95,95 5,95')
    })

    it('renders polygon with correct triangle points', () => {
      const wrapper = mount(PolygonShape, {
        props: {
          shapeType: 'triangle',
          width: 100,
          height: 100,
        },
      })

      const polygon = wrapper.find('polygon')
      expect(polygon.attributes('points')).toBe('50,5 95,95 5,95')
    })

    it('renders polygon with correct trapezoid points', () => {
      const wrapper = mount(PolygonShape, {
        props: {
          shapeType: 'trapezoid',
          width: 100,
          height: 100,
        },
      })

      const polygon = wrapper.find('polygon')
      expect(polygon.attributes('points')).toBe('25,5 75,5 95,95 5,95')
    })

    it('renders polygon with correct diamond points', () => {
      const wrapper = mount(PolygonShape, {
        props: {
          shapeType: 'diamond',
          width: 100,
          height: 100,
        },
      })

      const polygon = wrapper.find('polygon')
      // Diamond: top, right, bottom, left
      expect(polygon.attributes('points')).toBe('50,5 95,50 50,95 5,50')
    })

    it('renders polygon with correct parallelogram points', () => {
      const wrapper = mount(PolygonShape, {
        props: {
          shapeType: 'parallelogram',
          width: 100,
          height: 100,
        },
      })

      const polygon = wrapper.find('polygon')
      // Parallelogram: slanted rectangle
      expect(polygon.attributes('points')).toBe('20,5 95,5 80,95 5,95')
    })

    it('renders polygon with correct hexagon points', () => {
      const wrapper = mount(PolygonShape, {
        props: {
          shapeType: 'hexagon',
          width: 100,
          height: 100,
        },
      })

      const polygon = wrapper.find('polygon')
      // Hexagon: 6 sides
      expect(polygon.attributes('points')).toBe(
        '25,5 75,5 95,50 75,95 25,95 5,50'
      )
    })

    it('renders polygon with correct chevron points', () => {
      const wrapper = mount(PolygonShape, {
        props: {
          shapeType: 'chevron',
          width: 100,
          height: 100,
        },
      })

      const polygon = wrapper.find('polygon')
      // Chevron/Arrow pointing right
      expect(polygon.attributes('points')).toBe(
        '5,5 70,5 95,50 70,95 5,95 30,50'
      )
    })

    it('renders polygon with correct roundedRectangle points', () => {
      const wrapper = mount(PolygonShape, {
        props: {
          shapeType: 'roundedRectangle',
          width: 100,
          height: 100,
        },
      })

      const polygon = wrapper.find('polygon')
      // Rounded rectangle approximated with more points
      expect(polygon.attributes('points')).toBe(
        '15,5 85,5 95,15 95,85 85,95 15,95 5,85 5,15'
      )
    })

    it('renders ellipse with correct data-testid', () => {
      const wrapper = mount(PolygonShape, {
        props: {
          shapeType: 'ellipse',
          width: 100,
          height: 100,
        },
      })

      expect(wrapper.find('[data-testid="ellipse-shape"]').exists()).toBe(true)
      // Ellipse uses <ellipse> element, not polygon
      expect(wrapper.find('ellipse').exists()).toBe(true)
    })
  })

  describe('rotation', () => {
    it('applies rotation to points', () => {
      const wrapper = mount(PolygonShape, {
        props: {
          shapeType: 'rectangle',
          width: 100,
          height: 100,
          rotation: 90,
        },
      })

      const polygon = wrapper.find('polygon')
      // After 90° rotation, the rectangle points should be different
      expect(polygon.attributes('points')).not.toBe('5,5 95,5 95,95 5,95')
    })

    it('uses 0 rotation when not provided', () => {
      const wrapper = mount(PolygonShape, {
        props: {
          shapeType: 'rectangle',
          width: 100,
          height: 100,
        },
      })

      const polygon = wrapper.find('polygon')
      // With no rotation, should have the default rectangle points
      expect(polygon.attributes('points')).toBe('5,5 95,5 95,95 5,95')
    })
  })
})
