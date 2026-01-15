import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ShapeContextBar from './ShapeContextBar.vue'

describe('ShapeContextBar', () => {
  it('positions correctly when unrotated', () => {
    const wrapper = mount(ShapeContextBar, {
      props: {
        shapeWidth: 100,
        shapeHeight: 100,
        shapeY: 100,
        rotation: 0,
      },
    })

    const style = (wrapper.element as HTMLElement).style
    expect(style.top).toBe('-48px')
  })

  it('positions correctly when rotated 90 degrees', () => {
    const wrapper = mount(ShapeContextBar, {
      props: {
        shapeWidth: 100,
        shapeHeight: 50,
        shapeY: 100,
        rotation: 90,
      },
    })

    const style = (wrapper.element as HTMLElement).style
    expect(style.top).toBe('-73px')
  })

  it('positions correctly when rotated 180 degrees', () => {
    const wrapper = mount(ShapeContextBar, {
      props: {
        shapeWidth: 100,
        shapeHeight: 100,
        shapeY: 100,
        rotation: 180,
      },
    })

    const style = (wrapper.element as HTMLElement).style
    expect(style.top).toBe('-48px')
  })
})
