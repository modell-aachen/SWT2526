import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import GenericShape from './GenericShape.vue'

describe('GenericShape', () => {
  it('renders rectangle correctly', () => {
    const wrapper = mount(GenericShape, {
      props: {
        width: 100,
        height: 100,
        shapeType: 'rectangle',
      },
    })

    const polygon = wrapper.find('polygon')
    expect(polygon.exists()).toBe(true)
    expect(polygon.attributes('points')).toBe('5,5 95,5 95,95 5,95')
  })

  it('renders triangle correctly', () => {
    const wrapper = mount(GenericShape, {
      props: {
        width: 100,
        height: 100,
        shapeType: 'triangle',
      },
    })

    const polygon = wrapper.find('polygon')
    expect(polygon.exists()).toBe(true)
    expect(polygon.attributes('points')).toBe('50,5 95,95 5,95')
  })

  it('renders trapezoid correctly', () => {
    const wrapper = mount(GenericShape, {
      props: {
        width: 100,
        height: 100,
        shapeType: 'trapezoid',
      },
    })

    const polygon = wrapper.find('polygon')
    expect(polygon.exists()).toBe(true)
    expect(polygon.attributes('points')).toBe('20,5 80,5 95,95 5,95')
  })

  it('applies props correctly', () => {
    const wrapper = mount(GenericShape, {
      props: {
        width: 200,
        height: 150,
        shapeType: 'rectangle',
        fill: 'red',
        outline: 'blue',
        strokeWeight: 5,
      },
    })

    const svg = wrapper.find('svg')
    expect(svg.attributes('width')).toBe('200')
    expect(svg.attributes('height')).toBe('150')

    const polygon = wrapper.find('polygon')
    expect(polygon.attributes('fill')).toBe('red')
    expect(polygon.attributes('stroke')).toBe('blue')
    expect(polygon.attributes('stroke-width')).toBe('5')
  })
})
