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
    expect(polygon.attributes('points')).toBe('0,0 100,0 100,100 0,100')
  })

  it('renders ellipse correctly', () => {
    const wrapper = mount(GenericShape, {
      props: {
        width: 100,
        height: 100,
        shapeType: 'ellipse',
      },
    })

    const ellipse = wrapper.find('ellipse')
    expect(ellipse.exists()).toBe(true)
    expect(ellipse.attributes('cx')).toBe('50')
    expect(ellipse.attributes('cy')).toBe('50')
    expect(ellipse.attributes('rx')).toBe('50')
    expect(ellipse.attributes('ry')).toBe('50')
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
    expect(polygon.attributes('points')).toBe('50,0 100,100 0,100')
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
    expect(polygon.attributes('points')).toBe('20,0 80,0 100,100 0,100')
  })

  it('renders custom shape correctly', () => {
    const wrapper = mount(GenericShape, {
      props: {
        width: 100,
        height: 100,
        shapeType: 'custom',
        customPoints: '0,0 100,0 100,100 0,100',
      },
    })

    const polygon = wrapper.find('polygon')
    expect(polygon.exists()).toBe(true)
    expect(polygon.attributes('points')).toBe('0,0 100,0 100,100 0,100')
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
