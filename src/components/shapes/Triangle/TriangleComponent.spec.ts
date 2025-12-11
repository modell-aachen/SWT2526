import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Triangle from './TriangleComponent.vue'

describe('Triangle', () => {
  it('renders an SVG element', () => {
    const wrapper = mount(Triangle, {
      props: {
        width: 100,
        height: 100,
      },
    })

    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('applies width and height props to SVG', () => {
    const wrapper = mount(Triangle, {
      props: {
        width: 120,
        height: 180,
      },
    })

    const svg = wrapper.find('[data-testid="triangle-shape"]')
    expect(svg.attributes('width')).toBe('120')
    expect(svg.attributes('height')).toBe('180')
  })

  it('maintains viewBox of 0 0 100 100', () => {
    const wrapper = mount(Triangle, {
      props: {
        width: 120,
        height: 180,
      },
    })

    const svg = wrapper.find('[data-testid="triangle-shape"]')
    expect(svg.attributes('viewBox')).toBe('0 0 100 100')
  })

  it('applies outline prop to polygon stroke', () => {
    const wrapper = mount(Triangle, {
      props: {
        width: 100,
        height: 100,
        outline: '#0000ff',
      },
    })

    const polygon = wrapper.find('[data-testid="triangle-polygon"]')
    expect(polygon.attributes('stroke')).toBe('#0000ff')
  })

  it('applies fill prop to polygon', () => {
    const wrapper = mount(Triangle, {
      props: {
        width: 100,
        height: 100,
        fill: '#ffff00',
      },
    })

    const polygon = wrapper.find('[data-testid="triangle-polygon"]')
    expect(polygon.attributes('fill')).toBe('#ffff00')
  })

  it('uses default outline color when not provided', () => {
    const wrapper = mount(Triangle, {
      props: {
        width: 100,
        height: 100,
      },
    })

    const polygon = wrapper.find('[data-testid="triangle-polygon"]')
    expect(polygon.attributes('stroke')).toBe('#000')
  })

  it('uses default transparent fill when not provided', () => {
    const wrapper = mount(Triangle, {
      props: {
        width: 100,
        height: 100,
      },
    })

    const polygon = wrapper.find('[data-testid="triangle-polygon"]')
    expect(polygon.attributes('fill')).toBe('transparent')
  })

  it('renders polygon with correct triangle points', () => {
    const wrapper = mount(Triangle, {
      props: {
        width: 100,
        height: 100,
      },
    })

    const polygon = wrapper.find('[data-testid="triangle-polygon"]')
    expect(polygon.attributes('points')).toBe('50,5 95,95 5,95')
  })
})
