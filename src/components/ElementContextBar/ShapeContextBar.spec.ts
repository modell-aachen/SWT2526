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

    // Unrotated: top of shape relative to center is -50
    // Center offset is 50. Vertical top is 50-50 = 0
    // Bar should be at -48px (top - BAR_HEIGHT - TOP_OFFSET) relative to wrapper top (which is 0+50) ?
    // Wait, the calculation returns offset relative to top-left of unrotated box.
    // top = 0.
    // Expected top style: 0 - 40 - 8 = -48px

    const style = (wrapper.element as HTMLElement).style
    expect(style.top).toBe('-48px')
  })

  it('positions correctly when rotated 90 degrees', () => {
    const wrapper = mount(ShapeContextBar, {
      props: {
        shapeWidth: 100, // wider
        shapeHeight: 50, // shorter
        shapeY: 100,
        rotation: 90,
      },
    })

    // Rotated 90 deg:
    // Width becomes vertical dimension = 100
    // Height becomes horizontal dimension = 50

    // Center is at (50, 25) relative to unrotated top-left
    // The visual top of the rotated shape (vertical bar of length 100)
    // should be center.y - 50 = 25 - 50 = -25?

    // Let's trace the code logic:
    // w=100, h=50. Center relative to unrotated box is (50, 25).
    // Corners relative to center:
    // (-50, -25), (50, -25), (50, 25), (-50, 25)

    // Rotate 90 deg (pi/2): x' = -y, y' = x
    // Corners becomes:
    // (25, -50), (25, 50), (-25, 50), (-25, -50)

    // MinY = -50.
    // Top relative to unrotated top-left (0,0) is:
    // h/2 + minY = 25 - 50 = -25.

    // So visual top is at -25px.
    // Bar position: -25 - 40 - 8 = -73px.

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

    // 180 rotation doesn't change AABB of a square/rectangle in terms of extent (just key points swap)
    // MinY should still be -50 relative to center
    // Top should be 0.
    // Bar: -48px

    const style = (wrapper.element as HTMLElement).style
    expect(style.top).toBe('-48px')
  })
})
